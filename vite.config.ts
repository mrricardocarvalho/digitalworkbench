import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use /digitalworkbench/ for production GitHub Pages, / for development
  base: mode === 'production' ? '/digitalworkbench/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Routing
          'routing': ['react-router-dom'],
          // UI/Animation libraries
          'ui-vendor': ['framer-motion', '@radix-ui/react-dialog', 'cmdk'],
          // Performance utilities
          'performance': ['web-vitals']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    chunkSizeWarningLimit: 1000, // Stricter chunk size monitoring
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      '@radix-ui/react-use-layout-effect',
      '@radix-ui/react-dialog',
      '@radix-ui/react-portal',
      '@radix-ui/react-presence',
      '@radix-ui/react-use-controllable-state',
      '@radix-ui/react-use-effect-event',
      '@radix-ui/react-id',
      'use-sidecar',
      'use-callback-ref',
      'use-isomorphic-layout-effect'
    ],
    exclude: ['@testing-library/react', '@testing-library/dom', '@testing-library/jest-dom'],
    // Force pre-bundling of React to ensure it's available first
    force: true
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    // Ensure global React is available for dependencies that expect it
    global: 'globalThis',
    // Fix for @radix-ui/react-use-layout-effect and other React hooks dependencies
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  // Add external configuration to prevent React from being bundled incorrectly
  external: mode === 'production' ? [] : undefined,
}))
