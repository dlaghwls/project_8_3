/// <reference types="node" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // 클라이언트에서 /api 로 시작하는 모든 요청을
      // http://localhost:8000/api/... 로 포워딩
      '/api': {
        target: 'http://localhost:8000',  // Django 백엔드
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,          // URL 경로 그대로 유지
      },
    },
  },
});