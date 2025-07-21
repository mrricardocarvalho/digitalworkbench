import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx' // Note the .tsx extension
import './index.css'
// Initialize PWA manager
import './utils/pwa';

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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)