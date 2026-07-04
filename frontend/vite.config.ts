import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      include: '**/*.svg?component',  // ← thêm dòng này
      svgrOptions: {
        icon: true,
      },
    }),
    react(),
  ],
});