
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Esto es necesario para exponer el servidor a la máquina host en Docker
    host: '0.0.0.0', 
    port: 5173,
    // Proxy para las solicitudes de API al servicio de backend
    proxy: {
      '/api': {
        target: 'http://backend:5000', // El servicio de backend como se define en docker-compose.yml
        changeOrigin: true,
      },
    },
  },
})
