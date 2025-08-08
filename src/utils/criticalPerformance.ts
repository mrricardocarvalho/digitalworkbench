/**
 * Critical CSS and font loading optimization utilities
 */

// Critical CSS variables that should be inlined
export const criticalCSS = `
  :root {
    --primary-color: #007cf0;
    --background-color: #ffffff;
    --text-color: #1a1a1a;
    --border-color: #e5e7eb;
    --surface-color: #fafafa;
    --accent-color: #007cf0;
    --subtle-text-color: #6b7280;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
  }
  
  .dark {
    --background-color: #0a0a0a;
    --text-color: #ffffff;
    --border-color: #2d2d2d;
    --surface-color: #111111;
    --subtle-text-color: #a1a1aa;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    color: var(--text-color);
    background-color: var(--background-color);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

/**
 * Inject critical CSS into document head
 */
export const injectCriticalCSS = () => {
  if (typeof window === 'undefined') return;
  
  const existingStyle = document.getElementById('critical-css');
  if (existingStyle) return; // Already injected
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  
  // Insert before any other stylesheets
  const firstLink = document.head.querySelector('link[rel="stylesheet"]');
  if (firstLink) {
    document.head.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
};

/**
 * Font optimization utilities
 */
export const fontOptimizations = {
  // Preload critical fonts with font-display: swap
  preloadFonts: () => {
    const fonts = [
      {
        href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
        family: 'Inter',
        weight: '400'
      },
      {
        href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
        family: 'Inter',
        weight: '600'
      }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font.href;
      document.head.appendChild(link);
    });
  },

  // Load Google Fonts with optimal performance
  loadGoogleFonts: () => {
    const fontDisplay = 'swap';
    const fontUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=${fontDisplay}`;
    
    // Preconnect to Google Fonts
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    // Load fonts asynchronously
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.media = 'print';
    link.onload = () => {
      if (link.media === 'print') {
        link.media = 'all';
      }
    };
    document.head.appendChild(link);

    // Fallback for browsers that don't support onload
    setTimeout(() => {
      if (link.media === 'print') {
        link.media = 'all';
      }
    }, 3000);
  },

  // Add font-display: swap to existing fonts
  optimizeExistingFonts: () => {
    const fontFaces = document.styleSheets;
    Array.from(fontFaces).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        Array.from(rules).forEach(rule => {
          if (rule.type === CSSRule.FONT_FACE_RULE) {
            const fontFaceRule = rule as CSSFontFaceRule;
            const style = fontFaceRule.style as any; // Type assertion for font-display
            if (!style.fontDisplay) {
              style.fontDisplay = 'swap';
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets may throw errors
        console.warn('Could not optimize font in stylesheet:', e);
      }
    });
  }
};

/**
 * Resource hints for performance
 */
export const resourceHints = {
  // DNS prefetch for external domains
  addDNSPrefetch: (domains: string[]) => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  },

  // Preconnect to critical origins
  addPreconnect: (origins: { href: string; crossorigin?: boolean }[]) => {
    origins.forEach(({ href, crossorigin }) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      if (crossorigin) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  },

  // Prefetch likely next pages
  prefetchPages: (urls: string[]) => {
    // Only prefetch on fast connections
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && (connection.effectiveType === '4g' || connection.effectiveType === '3g')) {
        urls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          document.head.appendChild(link);
        });
      }
    }
  }
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Inject critical CSS immediately
  injectCriticalCSS();
  
  // DNS prefetch for external domains
  resourceHints.addDNSPrefetch([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]);

  // Preconnect to critical origins
  resourceHints.addPreconnect([
    { href: 'https://fonts.googleapis.com' },
    { href: 'https://fonts.gstatic.com', crossorigin: true }
  ]);

  // Load fonts optimally
  fontOptimizations.loadGoogleFonts();

  // Prefetch likely navigation targets
  resourceHints.prefetchPages([
    '/digitalworkbench/projects',
    '/digitalworkbench/resume',
    '/digitalworkbench/insights'
  ]);

  // Optimize existing fonts after a delay
  setTimeout(() => {
    fontOptimizations.optimizeExistingFonts();
  }, 100);
};

export default {
  criticalCSS,
  injectCriticalCSS,
  fontOptimizations,
  resourceHints,
  initializePerformanceOptimizations
};
