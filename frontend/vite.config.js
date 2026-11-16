import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Khi dev: gọi /api sẽ được chuyển tới backend (giống Nginx ở production)
    proxy: { '/api': 'http://localhost:3000' },
  },
});
