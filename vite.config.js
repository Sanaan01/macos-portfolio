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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), playlistGeneratorPlugin()],
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

