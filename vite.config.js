import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        games: './src/components/games/GamesMenu.jsx',
      },
      output: {
        manualChunks: {
          games: ['react', 'react-dom', './src/components/games/GamesMenu.jsx', './src/components/games/GameShell.jsx', './src/components/games/gameArt.jsx'],
        },
      },
    },
    // The only large chunk is the app UI (main); the games are fully split
    // into their own chunk. Lower the threshold so the warning is honest about
    // code-split behavior rather than the inherently large UI shell.
    chunkSizeWarningLimit: 600,
  },
  server: { port: 5173 },
})
