import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: parseInt(process.env.PORT || '5173') },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    // Three.js core is ~680 kB and loads on the landing page, so it can't be
    // lazily split without hurting first paint. Raise the limit to acknowledge
    // this is expected rather than a problem to fix.
    chunkSizeWarningLimit: 800,
    // Split the heavy 3D libraries into their own vendor chunk so the
    // main app code stays small and cacheable.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
