import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(rootDirectory, 'src/components'),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        letaiTv: resolve(rootDirectory, 'letai-tv.html'),
      },
    },
  },
});
