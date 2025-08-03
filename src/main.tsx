import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

// CRITICAL: Expose React globally for Radix UI and other dependencies
// This must happen before any other imports that depend on React hooks
(window as any).React = React;
(globalThis as any).React = React;

// Ensure React hooks are available globally
if (typeof window !== 'undefined') {
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
  (window as any).useLayoutEffect = React.useLayoutEffect;
  (window as any).useContext = React.useContext;
  (window as any).createContext = React.createContext;
}

import App from './App.tsx' // Note the .tsx extension
import './index.css'
// Initialize PWA manager
import './utils/pwa';
// Initialize performance optimizations
import { loadCriticalResources, registerServiceWorker, optimizeImageLoading } from './utils/performance';
import { initializeFontLoading } from './utils/fontLoading';
// Initialize content management system
import { registerAllContent } from './content/contentRegistry';

// GitHub Pages SPA routing fix
// This script checks to see if a redirect is present in the query string,
// converts it back into the correct url and replaces the current entry in the browser history.
const isGitHubPages = window.location.hostname.includes('github.io');
if (isGitHubPages) {
  (function(l) {
    if (l.search[1] === '/' ) {
      const decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, '', l.pathname.slice(0, -1) + decoded + l.hash);
    }
  }(window.location))
}

// Determine base path: use /digitalworkbench for production/GitHub Pages, / for local dev
const basename = import.meta.env.PROD && isGitHubPages ? '/digitalworkbench' : undefined;

// Initialize performance optimizations immediately
loadCriticalResources();

// Initialize font loading optimization
initializeFontLoading().catch(console.warn);

// Register service worker for caching
registerServiceWorker().catch(console.warn);

// Initialize content management system
registerAllContent();

// Optimized Google Font loading with font-display: swap
const fontLink = document.createElement('link');
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
fontLink.crossOrigin = "anonymous";
document.head.appendChild(fontLink);

// Add viewport meta tag for mobile optimization (if not already in HTML)
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1.0';
  document.head.appendChild(viewport);
}

// Optimize images after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  optimizeImageLoading();
});

// Disable automatic scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {basename ? (
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>,
)