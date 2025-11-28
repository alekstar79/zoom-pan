import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      rollupTypes: true,
      include: ['src/**/*'],
      insertTypesEntry: true,
      exclude: ['node_modules', 'dist', 'tests']
    })
  ],
  build: {
    lib: {
      name: 'ZoomPan',
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format}.js`
    },
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 5,
        toplevel: true,
        pure_getters: true,
        pure_funcs: ['console.log','console.debug','console.info','console.warn'],
        drop_console: true,
        drop_debugger: true,
        unused: true,
        dead_code: true,
        if_return: true,
        join_vars: true,
        reduce_vars: true,
        collapse_vars: true,
        reduce_funcs: true,
        hoist_props: true,
        side_effects: false
      },
      mangle: {
        toplevel: true,
        properties: true,
        reserved: ['Renderer','useZoomPan','zoomPan']
      },
      format: {
        comments: false,
        semicolons: false,
        wrap_iife: true
      }
    },
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      output: [
        {
          format: 'es',
          entryFileNames: 'index.esm.js',
          exports: 'named',
          inlineDynamicImports: true,
        },
        {
          format: 'umd',
          entryFileNames: 'index.umd.js',
          exports: 'named',
          name: 'ZoomPan',
          inlineDynamicImports: true,
        }
      ]
    },
    sourcemap: false,
    reportCompressedSize: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
