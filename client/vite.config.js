import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,            // cổng dev của Vite
    proxy: {
      '/api': 'http://localhost:3001' // chuyển mọi gọi /api sang backend
    }
  }
})
