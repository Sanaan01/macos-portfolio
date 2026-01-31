import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare Pages Function to list gallery images from R2
 * Returns JSON with image metadata and Cloudflare Image Resizing URLs
 */
export async function onRequest(context) {
    const { env } = context;

    // Validate environment variables
    const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'];
    const missing = required.filter(key => !env[key]);

    if (missing.length > 0) {
        return new Response(
            JSON.stringify({ error: `Missing environment variables: ${missing.join(', ')}` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // Create S3 client for R2
    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
    });

    try {
        // List all objects in the bucket
        const listCommand = new ListObjectsV2Command({
            Bucket: env.R2_BUCKET_NAME,
        });

        const listResponse = await client.send(listCommand);
        const objects = listResponse.Contents || [];

        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
        const imageObjects = objects.filter(obj => {
            const key = obj.Key.toLowerCase();
            return imageExtensions.some(ext => key.endsWith(ext));
        });

        // Get metadata for each image
        const images = await Promise.all(
            imageObjects.map(async (obj) => {
                try {
                    // Get object metadata
                    const headCommand = new HeadObjectCommand({
                        Bucket: env.R2_BUCKET_NAME,
                        Key: obj.Key,
                    });

                    const headResponse = await client.send(headCommand);
                    const metadata = headResponse.Metadata || {};

                    // Parse categories from metadata
                    const categories = metadata.categories
                        ? metadata.categories.split(',').map(c => c.trim())
                        : ['Library'];

                    // Construct URLs
                    const fullUrl = `${env.R2_PUBLIC_URL}/${obj.Key}`;
                    // Cloudflare Image Resizing URL for thumbnails
                    const thumbnailUrl = `https://sanaan.dev/cdn-cgi/image/width=300,height=300,fit=cover,quality=85/${fullUrl}`;

                    // Extract filename from key
                    const name = obj.Key.split('/').pop();

                    return {
                        id: obj.Key,
                        name,
                        img: fullUrl,
                        thumbnail: thumbnailUrl,
                        categories,
                        uploadedAt: metadata.uploadedat || obj.LastModified?.toISOString(),
                    };
                } catch (err) {
                    console.error(`Error getting metadata for ${obj.Key}:`, err);
                    // Return with default categories if metadata fetch fails
                    const fullUrl = `${env.R2_PUBLIC_URL}/${obj.Key}`;
                    return {
                        id: obj.Key,
                        name: obj.Key.split('/').pop(),
                        img: fullUrl,
                        thumbnail: `https://sanaan.dev/cdn-cgi/image/width=300,height=300,fit=cover,quality=85/${fullUrl}`,
                        categories: ['Library'],
                    };
                }
            })
        );

        // Sort by upload date (newest first)
        images.sort((a, b) => {
            const dateA = a.uploadedAt ? new Date(a.uploadedAt) : new Date(0);
            const dateB = b.uploadedAt ? new Date(b.uploadedAt) : new Date(0);
            return dateB - dateA;
        });

        return new Response(
            JSON.stringify({ images }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Cache: 5 min browser, 1 hour CDN
                    'Cache-Control': 'public, max-age=300, s-maxage=3600',
                },
            }
        );
    } catch (error) {
        console.error('Error listing R2 objects:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to list gallery images', details: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
