import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Single app entry; games are split naturally by their dynamic imports
        // in ChatWindow.jsx. Only isolate the heavy firebase SDK into its own
        // chunk — do NOT force react into a manual chunk (that duplicated
        // React and crashed the game components).
        manualChunks(id) {
          if (id.includes('@firebase') || id.includes('node_modules/firebase')) {
            return 'firebase'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: { port: 5173 },
})
