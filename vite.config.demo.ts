import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'public',
  root: 'examples',
  build: {
    outDir: '../dist-demo',
    copyPublicDir: true,
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
  },
  server: {
    port: 3001,
    open: true,
    fs: { allow: ['..'] }
  },
  plugins: [tsconfigPaths()],
  define: {
    global: 'globalThis'
  }
})
