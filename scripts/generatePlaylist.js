import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsmediatags from 'jsmediatags';
import sharp from 'sharp';

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
 * Save cover art from ID3 tags to a WebP file with 70% quality compression
 */
async function saveCoverArt(picture, outputPath) {
    if (!picture) return null;

    const { data } = picture;
    const buffer = Buffer.from(data);

    // Always save as WebP with 70% quality for optimal compression
    const finalPath = outputPath.replace(/\.[^.]+$/, '.webp');

    await sharp(buffer)
        .webp({ quality: 70 })
        .toFile(finalPath);

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
 * Load existing playlist to preserve track IDs and order
 */
function loadExistingPlaylist() {
    try {
        if (fs.existsSync(playlistPath)) {
            const data = fs.readFileSync(playlistPath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('⚠️  Could not load existing playlist:', error.message);
    }
    return [];
}

/**
 * Scan audio directory and generate playlist
 */
async function generatePlaylist() {
    console.log('🎵 Scanning audio directory...');

    // Load existing playlist to preserve IDs
    const existingPlaylist = loadExistingPlaylist();
    const existingTracks = new Map();
    let maxId = 0;

    // Build a map of existing tracks by their src path
    for (const track of existingPlaylist) {
        existingTracks.set(track.src, track);
        if (track.id !== undefined && track.id > maxId) {
            maxId = track.id;
        }
    }

    // Get all MP3 files
    const files = fs.readdirSync(audioDir).filter(f =>
        f.toLowerCase().endsWith('.mp3')
    );

    if (files.length === 0) {
        console.log('⚠️  No MP3 files found in', audioDir);
        fs.writeFileSync(playlistPath, JSON.stringify([], null, 2));
        return [];
    }

    console.log(`📂 Found ${files.length} MP3 file(s)`);

    const playlist = [];

    for (const file of files) {
        const filePath = path.join(audioDir, file);
        const slug = generateSlug(file);
        const srcPath = `/audio/${file}`;

        console.log(`  Processing: ${file}`);

        // Check if this track already exists in the playlist
        const existingTrack = existingTracks.get(srcPath);
        let trackId;

        if (existingTrack && existingTrack.id !== undefined) {
            // Preserve existing ID
            trackId = existingTrack.id;
            console.log(`    ↳ Keeping existing ID: ${trackId}`);
        } else {
            // Assign new ID (next available)
            maxId++;
            trackId = maxId;
            console.log(`    ↳ Assigned new ID: ${trackId}`);
        }

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
                coverFile = await saveCoverArt(tags.picture, coverPath);
                if (coverFile) {
                    console.log(`    ✓ Extracted cover art: ${coverFile}`);
                }
            }
        } catch (error) {
            console.log(`    ⚠️  Could not read metadata: ${error.message || error.type}`);
        }

        playlist.push({
            id: trackId,
            title,
            artist,
            album,
            src: srcPath,
            cover: coverFile ? `/audio/covers/${coverFile}` : '/audio/covers/default.webp'
        });
    }

    // Sort playlist by ID (oldest tracks first)
    playlist.sort((a, b) => a.id - b.id);

    // Write playlist.json
    fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2));
    console.log(`✅ Generated playlist.json with ${playlist.length} track(s) (sorted by ID)`);

    return playlist;
}

// Run only when executed directly (not when imported)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    generatePlaylist().catch(console.error);
}

export { generatePlaylist };
