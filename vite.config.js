import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { watch } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom plugin to auto-generate playlist from audio files
function playlistGeneratorPlugin() {
  const audioDir = join(__dirname, 'public', 'audio');
  let watcher = null;

  return {
    name: 'playlist-generator',
    async buildStart() {
      // Generate playlist on build/dev start
      const { generatePlaylist } = await import('./scripts/generatePlaylist.js');
      await generatePlaylist();
    },
    configureServer(server) {
      // Watch audio directory for changes during dev
      const { generatePlaylist } = import('./scripts/generatePlaylist.js');

      watcher = watch(audioDir, { recursive: false }, async (eventType, filename) => {
        if (filename && filename.toLowerCase().endsWith('.mp3')) {
          console.log(`\n🎵 Audio file ${eventType}: ${filename}`);
          const { generatePlaylist: gen } = await import('./scripts/generatePlaylist.js');
          await gen();
          // Trigger HMR by sending custom event
          server.ws.send({ type: 'full-reload' });
        }
      });

      server.httpServer?.on('close', () => {
        if (watcher) watcher.close();
      });
    }
  };
}

import { execSync } from 'child_process';
import fs from 'fs';

// Get build-time constants
// Cloudflare Pages provides CF_PAGES_COMMIT_SHA and CF_PAGES_BRANCH
let gitCommit = process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || 'dev';
let gitBranch = process.env.CF_PAGES_BRANCH || 'unknown';

// Fallback to git commands for local development
if (gitCommit === 'dev') {
  try {
    gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch { }
}

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), playlistGeneratorPlugin()],
  define: {
    __GIT_COMMIT__: JSON.stringify(gitCommit),
    __GIT_BRANCH__: JSON.stringify(gitBranch),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/constants'),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), 'src/store'),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), 'src/hoc'),
      '#windows': resolve(dirname(fileURLToPath(import.meta.url)), 'src/windows'),
    }
  }
})

