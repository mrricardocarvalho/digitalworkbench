/**
 * Advanced Lazy Loading Strategies
 * Handles preloading and progressive enhancement for optimal performance
 */

import { lazy, type ComponentType } from 'react';

// Enhanced retry logic for imports
export const createAdvancedRetryableImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  maxRetries = 3,
  delay = 1000
) => {
  return async (): Promise<{ default: T }> => {
    let lastError: Error | undefined;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await importFn();
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Import failed (attempt ${i + 1}/${maxRetries}):`, error);
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    if (lastError) {
      throw lastError;
    }
    throw new Error('Import failed after all retries');
  };
};

// Preload strategies for different scenarios
export const PreloadStrategies = {
  // Preload on hover with debouncing
  onHover: (importFn: () => Promise<any>, debounceMs = 200) => {
    let timeoutId: number;
    let hasPreloaded = false;
    
    return () => {
      if (hasPreloaded) return;
      
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        hasPreloaded = true;
        importFn().catch(err => console.warn('Preload failed:', err));
      }, debounceMs);
    };
  },

  // Preload on intersection (when component becomes visible)
  onIntersection: (importFn: () => Promise<any>, rootMargin = '50px') => {
    let hasPreloaded = false;
    
    return (element: Element) => {
      if (hasPreloaded) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            hasPreloaded = true;
            importFn().catch(err => console.warn('Preload failed:', err));
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      
      observer.observe(element);
      return () => observer.disconnect();
    };
  },

  // Preload on idle using requestIdleCallback
  onIdle: (importFn: () => Promise<any>) => {
    let hasPreloaded = false;
    
    return () => {
      if (hasPreloaded) return;
      
      const preload = () => {
        hasPreloaded = true;
        importFn().catch(err => console.warn('Preload failed:', err));
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preload, { timeout: 5000 });
      } else {
        setTimeout(preload, 100);
      }
    };
  }
};

// Optimized lazy loading for different component types
export const OptimizedLazyLoading = {
  // For critical above-the-fold components
  critical: <T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>) => 
    lazy(createAdvancedRetryableImport(importFn, 2, 500)),

  // For interactive components that benefit from preloading
  interactive: <T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>) => 
    lazy(createAdvancedRetryableImport(importFn, 3, 1000)),

  // For heavy components that should be loaded only when needed
  heavy: <T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>) => 
    lazy(createAdvancedRetryableImport(importFn, 5, 2000)),

  // For rarely used components
  rare: <T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>) => 
    lazy(createAdvancedRetryableImport(importFn, 2, 3000))
};

// Bundle analysis helper
export const BundleAnalysis = {
  // Track component load times
  trackLoadTime: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'component_load_time', {
          component_name: componentName,
          load_time: Math.round(loadTime),
          custom_parameter: 'code_splitting'
        });
      }
    };
  },

  // Monitor chunk sizes
  getChunkInfo: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsChunks = entries.filter(entry => 
        entry.name.includes('.js') && 
        entry.name.includes('/assets/')
      );
      
      return jsChunks.map(chunk => ({
        name: chunk.name.split('/').pop(),
        size: chunk.transferSize,
        loadTime: chunk.responseEnd - chunk.requestStart
      }));
    }
    return [];
  }
};

export default OptimizedLazyLoading;
