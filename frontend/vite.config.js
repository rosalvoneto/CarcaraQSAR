import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    // needed for the Docker Container port mapping to work
    host: true,
    strictPort: true,
    // you can replace this port with any port
    port: 5173, 
  }
})
