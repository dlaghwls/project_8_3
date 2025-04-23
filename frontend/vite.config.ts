// vite.config.ts
/// <reference types="node" />
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Django 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
