/**
 * Performance optimization utilities
 * Handles progressive loading, resource hints, and performance monitoring
 */

import { useEffect, useState, useCallback } from 'react';

// Performance metrics tracking
interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

// Progressive loading hook for content sections
export const useProgressiveLoading = (delay: number = 100) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isReady;
};

// Resource preloading utility
export const preloadResource = (
  href: string, 
  type: 'script' | 'style' | 'font' | 'image' = 'script',
  crossorigin?: 'anonymous' | 'use-credentials'
) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = type;
  
  if (crossorigin) {
    link.crossOrigin = crossorigin;
  }
  
  // For fonts, add type attribute
  if (type === 'font') {
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
  
  return () => {
    if (document.head.contains(link)) {
      document.head.removeChild(link);
    }
  };
};

// Critical font preloading
export const preloadCriticalFonts = () => {
  const fonts = [
    '/digitalworkbench/fonts/inter-var.woff2',
    '/digitalworkbench/fonts/jetbrains-mono.woff2'
  ];
  
  const cleanupFunctions = fonts.map(font => 
    preloadResource(font, 'font')
  );
  
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

// DNS prefetch for external resources
export const addDNSPrefetch = (domains: string[]) => {
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Preconnect to critical origins
export const addPreconnect = (origins: string[]) => {
  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Web Vitals measurement
export const measureWebVitals = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    const metrics: PerformanceMetrics = {};
    
    // Measure FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }
    });
    
    // Measure LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
      }
    });
    
    // Measure FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any; // Type assertion for PerformanceEventTiming
      if (firstEntry && firstEntry.processingStart) {
        metrics.fid = firstEntry.processingStart - firstEntry.startTime;
      }
    });
    
    // Measure CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      metrics.cls = clsValue;
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
    
    // Get TTFB from navigation timing
    if ('navigation' in performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }
    }
    
    // Resolve after a short delay to collect metrics
    setTimeout(() => {
      resolve(metrics);
      
      // Cleanup observers
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    }, 3000);
  });
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(true);
  
  useEffect(() => {
    // Check if Performance Observer is supported
    if (!('PerformanceObserver' in window)) {
      setIsSupported(false);
      return;
    }
    
    measureWebVitals().then(setMetrics);
  }, []);
  
  return { metrics, isSupported };
};

// Lazy load content sections with intersection observer
export const useLazySection = (threshold: number = 0.1, rootMargin: string = '50px') => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  
  const elementRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref);
    
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);
  
  return [elementRef, isVisible] as const;
};

// Bundle size analysis (development only)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('📦 Bundle Analysis');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    
    scripts.forEach((script: any) => {
      console.log(`Script: ${script.src}`);
    });
    
    styles.forEach((style: any) => {
      console.log(`Stylesheet: ${style.href}`);
    });
    console.groupEnd();
  }
};

// Critical resource loading strategy
export const loadCriticalResources = () => {
  // Preload critical fonts
  preloadCriticalFonts();
  
  // Prefetch DNS for external resources
  addDNSPrefetch([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]);
  
  // Preconnect to critical origins
  addPreconnect([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]);
};

// Image optimization utilities
export const optimizeImageLoading = () => {
  // Add loading="lazy" to all images below the fold
  const images = document.querySelectorAll('img:not([loading])');
  
  images.forEach((img, index) => {
    // First 3 images load eagerly (above the fold)
    if (index < 3) {
      img.setAttribute('loading', 'eager');
    } else {
      img.setAttribute('loading', 'lazy');
    }
  });
};

// Service Worker registration with caching strategy
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | undefined> => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Update on new content
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              console.log('New content available');
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return undefined;
    }
  }
  return undefined;
};

export default {
  useProgressiveLoading,
  preloadResource,
  preloadCriticalFonts,
  addDNSPrefetch,
  addPreconnect,
  measureWebVitals,
  usePerformanceMonitoring,
  useLazySection,
  analyzeBundleSize,
  loadCriticalResources,
  optimizeImageLoading,
  registerServiceWorker
};
