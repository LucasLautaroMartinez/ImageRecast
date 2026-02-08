import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@server": path.resolve(__dirname, "../server/src"),
    },
  },
  plugins: [react()],
  
  server: {
    https: true,
    host: true,
    port: 5173
  },

  base: '/ImageRecast/',

  build: {
    outDir: 'docs', // En lugar de crear una carpeta "dist" crea una "docs", para utilizar en GitHub Pages
    emptyOutDir: true // Elimina la carpeta docs antes de buildear
  }
});