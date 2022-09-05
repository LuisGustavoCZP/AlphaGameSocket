import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/assets/map': {
        target: 'https://localhost:8000/assets/map'
      }
    }
  }
})
