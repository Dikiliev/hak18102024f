import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), viteStaticCopy({
    targets: [
      {
        src: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
        dest: '',
      },
    ],}),],

});
