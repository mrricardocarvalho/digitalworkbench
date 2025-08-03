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
          // CRITICAL FIX: Put ALL React ecosystem in ONE chunk to ensure proper loading
          // This includes ANY library that might use React hooks
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/@radix-ui/') ||
              id.includes('node_modules/react-router-dom/') || 
              id.includes('react-router') ||
              id.includes('node_modules/framer-motion/') ||
              id.includes('node_modules/use-sidecar/') ||
              id.includes('node_modules/use-callback-ref/') ||
              id.includes('node_modules/use-isomorphic-layout-effect/') ||
              id.includes('node_modules/@floating-ui/react') ||
              id.includes('node_modules/react-') ||
              id.includes('use-layout-effect')) {
            return 'react-bundle';
          }
          
          // 3D libraries - split Spline into smaller chunks for better loading
          if (id.includes('node_modules/@splinetool/runtime')) {
            return 'spline-runtime';
          }
          
          if (id.includes('node_modules/@splinetool/react-spline')) {
            return 'react-bundle'; // Keep React Spline with React
          }
          
          if (id.includes('node_modules/@splinetool/')) {
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
          
          // Utility libraries
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
          
          // Default to vendor for other node_modules (BUT NOT if they're React-related)
          if (id.includes('node_modules/')) {
            // Double-check: if it has any React-related patterns, put in react-bundle
            if (id.includes('react') || id.includes('use-') || id.includes('hook')) {
              return 'react-bundle';
            }
            return 'vendor';
          }
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
