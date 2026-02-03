import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsmediatags from 'jsmediatags';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const audioDir = path.join(rootDir, 'public', 'audio');
const coversDir = path.join(audioDir, 'covers');
const playlistPath = path.join(rootDir, 'public', 'playlist.json');

// Ensure covers directory exists
if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
}

/**
 * Extract metadata from an MP3 file using jsmediatags
 */
function extractMetadata(filePath) {
    return new Promise((resolve, reject) => {
        jsmediatags.read(filePath, {
            onSuccess: (tag) => resolve(tag),
            onError: (error) => reject(error)
        });
    });
}

/**
 * Save cover art from ID3 tags to a file
 */
function saveCoverArt(picture, outputPath) {
    if (!picture) return null;

    const { data, format } = picture;
    // Convert format to file extension
    let ext = 'jpg';
    if (format && format.includes('png')) ext = 'png';
    if (format && format.includes('webp')) ext = 'webp';

    const finalPath = outputPath.replace(/\.[^.]+$/, `.${ext}`);
    const buffer = Buffer.from(data);
    fs.writeFileSync(finalPath, buffer);

    return path.basename(finalPath);
}

/**
 * Generate a slug from a filename for cover art naming
 */
function generateSlug(filename) {
    return filename
        .replace(/\.mp3$/i, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .toLowerCase();
}

/**
 * Scan audio directory and generate playlist
 */
async function generatePlaylist() {
    console.log('🎵 Scanning audio directory...');

    // Get all MP3 files
    const files = fs.readdirSync(audioDir).filter(f =>
        f.toLowerCase().endsWith('.mp3')
    );

    if (files.length === 0) {
        console.log('⚠️  No MP3 files found in', audioDir);
        fs.writeFileSync(playlistPath, JSON.stringify([], null, 2));
        return [];
    }

    // Sort files by modification time (oldest first)
    const filesWithStats = files.map(f => ({
        name: f,
        mtime: fs.statSync(path.join(audioDir, f)).mtime.getTime()
    }));
    filesWithStats.sort((a, b) => a.mtime - b.mtime);
    const sortedFiles = filesWithStats.map(f => f.name);

    console.log(`📂 Found ${sortedFiles.length} MP3 file(s) (sorted oldest first)`);

    const playlist = [];

    for (const file of sortedFiles) {
        const filePath = path.join(audioDir, file);
        const slug = generateSlug(file);

        console.log(`  Processing: ${file}`);

        let title = file.replace(/\.mp3$/i, '');
        let artist = 'Unknown Artist';
        let album = 'Unknown Album';
        let coverFile = null;

        try {
            const metadata = await extractMetadata(filePath);
            const tags = metadata.tags;

            if (tags.title) title = tags.title;
            if (tags.artist) artist = tags.artist;
            if (tags.album) album = tags.album;

            // Extract and save cover art
            if (tags.picture) {
                const coverPath = path.join(coversDir, `${slug}.jpg`);
                coverFile = saveCoverArt(tags.picture, coverPath);
                if (coverFile) {
                    console.log(`    ✓ Extracted cover art: ${coverFile}`);
                }
            }
        } catch (error) {
            console.log(`    ⚠️  Could not read metadata: ${error.message || error.type}`);
        }

        playlist.push({
            title,
            artist,
            album,
            src: `/audio/${file}`,
            cover: coverFile ? `/audio/covers/${coverFile}` : '/audio/covers/default.webp'
        });
    }

    // Write playlist.json
    fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2));
    console.log(`✅ Generated playlist.json with ${playlist.length} track(s)`);

    return playlist;
}

// Run if called directly
generatePlaylist().catch(console.error);

export { generatePlaylist };
