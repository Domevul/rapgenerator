import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  define: {
    'typeof CANVAS_RENDERER': JSON.stringify(true),
    'typeof WEBGL_RENDERER': JSON.stringify(true)
  }
})
