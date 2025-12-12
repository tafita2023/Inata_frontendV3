import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },

  // 🔥 AJOUT IMPORTANT POUR RENDER
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: ['gestion-inata.onrender.com']
  }
})
