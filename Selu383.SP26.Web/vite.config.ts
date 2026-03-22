import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7116', // 👈 your backend port here
        changeOrigin: true,
        secure: false, // needed if your backend uses a self-signed dev cert
      }
    }
  }
})