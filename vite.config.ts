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
          // React vendor libraries - include Radix UI with React to ensure proper resolution
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/@radix-ui/')) {
            return 'react-vendor';
          }
          
          // React Router - only if actually used
          if (id.includes('node_modules/react-router-dom/') || id.includes('react-router')) {
            return 'router';
          }
          
          // Animation libraries
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion';
          }
          
          // 3D libraries - split Spline into smaller chunks for better loading
          if (id.includes('node_modules/@splinetool/runtime')) {
            return 'spline-runtime';
          }
          
          if (id.includes('node_modules/@splinetool/react-spline')) {
            return 'spline-react';
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
          
          // Default to vendor for other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
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
      '@radix-ui/react-id'
    ],
    exclude: ['@testing-library/react', '@testing-library/dom', '@testing-library/jest-dom']
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
}))
