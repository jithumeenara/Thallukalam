import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the inline limit so small assets get inlined instead of fetched
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — long-term cacheable, never changes between deploys
          react:  ['react', 'react-dom'],
          // lottie-web is ~250 KB — split so it doesn't block initial parse
          lottie: ['lottie-react', 'lottie-web'],
        },
      },
    },
  },
})
