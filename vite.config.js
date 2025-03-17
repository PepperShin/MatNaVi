import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/naver-api': {
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver-api/, ''),
      },
      
      '/naver-local-api': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver-local-api/, ''),
      },

      '/tour-api': {
        target: 'http://apis.data.go.kr/B551011/KorService1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tour-api/, ''),
      },
      
      '/google-api': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-api/, ''),
      },

    },
  },
});
