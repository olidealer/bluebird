
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxying API requests from /api to the backend service
      // This is crucial for the frontend container to communicate with the backend container
      '/api': {
        target: 'http://backend:5000', // The service name and port from docker-compose.yml
        changeOrigin: true,
        secure: false,
      },
    },
  },
})