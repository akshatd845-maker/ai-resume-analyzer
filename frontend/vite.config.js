import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'vendor-react-dom'
            }
            if (
              id.includes('react-router') ||
              id.includes('@remix-run') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor-react-router'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-react-query'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion'
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts'
            }
            if (id.includes('radix-ui') || id.includes('@radix-ui')) {
              return 'vendor-radix-ui'
            }
            if (id.includes('react')) {
              return 'vendor-react'
            }
            return 'vendor-libs'
          }
        },
      },
    },
  },
})
