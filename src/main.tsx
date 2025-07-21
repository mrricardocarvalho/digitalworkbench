import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx' // Note the .tsx extension
import './index.css'
// Initialize PWA manager
import './utils/pwa';

// GitHub Pages SPA routing fix
// This script checks to see if a redirect is present in the query string,
// converts it back into the correct url and replaces the current entry in the browser history.
const isGitHubPages = window.location.hostname.includes('github.io');
if (isGitHubPages) {
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, '', l.pathname.slice(0, -1) + decoded + l.hash);
    }
  }(window.location))
}

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/digitalworkbench">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)