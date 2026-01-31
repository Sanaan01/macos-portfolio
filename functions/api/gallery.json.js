/**
 * Cloudflare Pages Function to list gallery images from R2
 * Uses R2 Binding (no AWS SDK needed!)
 * 
 * Required bindings (configure in Cloudflare Dashboard → Settings → Functions → R2 bucket bindings):
 * - MY_BUCKET: R2 bucket binding
 * 
 * Required environment variables:
 * - R2_PUBLIC_URL: Public URL for R2 bucket (e.g., https://assets.sanaan.dev)
 * - R2_PATH_PREFIX: Optional folder prefix (e.g., macos-portfolio/)
 */
export async function onRequest(context) {
    const { env } = context;

    // Check for R2 binding
    if (!env.MY_BUCKET) {
        return new Response(
            JSON.stringify({ error: 'R2 bucket binding (MY_BUCKET) not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Check for public URL
    if (!env.R2_PUBLIC_URL) {
        return new Response(
            JSON.stringify({ error: 'R2_PUBLIC_URL environment variable not set' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // List objects in bucket with optional prefix
        const prefix = env.R2_PATH_PREFIX || '';
        const listed = await env.MY_BUCKET.list({ prefix });

        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
        const imageObjects = (listed.objects || []).filter(obj => {
            const key = obj.key.toLowerCase();
            return imageExtensions.some(ext => key.endsWith(ext));
        });

        // Get metadata for each image
        const images = await Promise.all(
            imageObjects.map(async (obj) => {
                try {
                    // Get object with metadata using head()
                    const headResult = await env.MY_BUCKET.head(obj.key);
                    const customMetadata = headResult?.customMetadata || {};

                    // Parse categories from metadata
                    const categories = customMetadata.categories
                        ? customMetadata.categories.split(',').map(c => c.trim())
                        : ['Library'];

                    // Construct URLs
                    const fullUrl = `${env.R2_PUBLIC_URL}/${obj.key}`;
                    // Cloudflare Image Resizing URL for thumbnails (800px long side, maintain aspect ratio)
                    const thumbnailUrl = `https://sanaan.dev/cdn-cgi/image/width=800,fit=scale-down,quality=85,format=auto/${fullUrl}`;

                    // Extract filename from key
                    const name = obj.key.split('/').pop();

                    return {
                        id: obj.key,
                        name,
                        img: fullUrl,
                        thumbnail: thumbnailUrl,
                        categories,
                        uploadedAt: customMetadata.uploadedAt || obj.uploaded?.toISOString(),
                    };
                } catch (err) {
                    console.error(`Error getting metadata for ${obj.key}:`, err);
                    // Return with default categories if metadata fetch fails
                    const fullUrl = `${env.R2_PUBLIC_URL}/${obj.key}`;
                    return {
                        id: obj.key,
                        name: obj.key.split('/').pop(),
                        img: fullUrl,
                        thumbnail: `https://sanaan.dev/cdn-cgi/image/width=800,fit=scale-down,quality=85,format=auto/${fullUrl}`,
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
                    // No browser cache, CDN caches for 5 min but revalidates
                    'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
                },
            }
        );
    } catch (error) {
        console.error('Error listing R2 objects:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to list gallery images', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
