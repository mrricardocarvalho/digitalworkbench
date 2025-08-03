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
        manualChunks: (id) => {
          // NUCLEAR OPTION: Don't chunk React ecosystem at all - keep everything in main bundle
          // This ensures React is ALWAYS available when any component needs it
          
          // Only chunk NON-React related large libraries
          // 3D libraries - split Spline into smaller chunks for better loading
          if (id.includes('node_modules/@splinetool/runtime')) {
            return 'spline-runtime';
          }
          
          if (id.includes('node_modules/@splinetool/') && !id.includes('react-spline')) {
            return 'spline-core';
          }
          
          if (id.includes('node_modules/three/build/three.module.js')) {
            return 'three-core';
          }
          
          if (id.includes('node_modules/three/')) {
            return 'three-addons';
          }
          
          // Physics libraries
          if (id.includes('node_modules/@dimforge/') || id.includes('rapier')) {
            return 'physics';
          }
          
          // Audio libraries
          if (id.includes('node_modules/howler/')) {
            return 'audio';
          }
          
          // Utility libraries (non-React)
          if (id.includes('node_modules/lodash') || id.includes('node_modules/date-fns')) {
            return 'utils';
          }
          
          // Large analysis/processing libraries
          if (id.includes('node_modules/opentype') || id.includes('node_modules/gaussian-splat')) {
            return 'heavy-libs';
          }
          
          // App-specific chunks for large pages
          if (id.includes('/pages/InsightPostPage')) {
            return 'blog-post';
          }
          
          if (id.includes('/pages/ProjectsPage') || id.includes('/components/ProjectGallery')) {
            return 'projects';
          }
          
          // Only vendor chunk for truly non-React dependencies
          if (id.includes('node_modules/') && 
              !id.includes('react') && 
              !id.includes('use-') && 
              !id.includes('hook') &&
              !id.includes('@radix-ui') &&
              !id.includes('framer-motion')) {
            return 'vendor';
          }
          
          // Everything else (including ALL React stuff) stays in main bundle
          // This guarantees React is available when anything needs it
        },
        // Remove globals configuration as it might be causing issues
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 5000, // Increased to 5MB for 3D libraries like Spline
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
