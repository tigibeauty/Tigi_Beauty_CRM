import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/macros/s/AKfycbwuvIpjC7ajwxmgJ034TD6NhXoX9Kn6H2pyuSUSYQnuq9gy1Aok7NhqPNv5P5g8fEZq/exec'),
      },
    },
  },
})
