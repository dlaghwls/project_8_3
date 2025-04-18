import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],  // jsxRuntime: 'classic' 제거
  resolve: {
    alias: [
      { find: '@', replacement: '/src' }
    ]
  }
});
