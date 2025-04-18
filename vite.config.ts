import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic' // CRA에서 마이그레이션 시 필요
  })],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' }
    ]
  }
});
