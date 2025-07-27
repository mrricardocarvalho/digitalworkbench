import { lazy } from 'react';
import type { ComponentType } from 'react';

// Dynamic import wrapper with retry logic
const createRetryableImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
) => {
  return async (): Promise<{ default: T }> => {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  };
};

// Code splitting strategies
export const CodeSplitStrategies = {
  // Split by route/page
  byRoute: {
    HomePage: lazy(createRetryableImport(() => import('../pages/HomePage'))),
    ProjectsPage: lazy(createRetryableImport(() => import('../pages/ProjectsPage'))),
    InsightsPage: lazy(createRetryableImport(() => import('../pages/InsightsPage'))),
    InsightPostPage: lazy(createRetryableImport(() => import('../pages/InsightPostPage'))),
    CaseStudyPage: lazy(createRetryableImport(() => import('../pages/CaseStudyPage'))),
    ResumePage: lazy(createRetryableImport(() => import('../pages/ResumePage'))),
    ContactPage: lazy(createRetryableImport(() => import('../pages/ContactPage'))),
    NotFoundPage: lazy(createRetryableImport(() => import('../pages/NotFoundPage'))),
  },

  // Split by heavy features (only components not used in critical path)
  byFeature: {
    Interactive3D: lazy(createRetryableImport(() => import('../components/Interactive3D'))),
    SplineScene: lazy(createRetryableImport(() => import('../components/SplineScene'))),
    AnimationDemo: lazy(createRetryableImport(() => import('../components/AnimationDemo'))),
    // PerformanceMonitor removed - statically imported in Layout
  },

  // Split by interaction-based components (only non-critical components)
  byInteraction: {
    // CommandPalette removed - statically imported in Layout
    // ThemeToggle removed - statically imported in Header
    ProjectGallery: lazy(createRetryableImport(() => import('../components/ProjectGallery'))),
    InteractiveProjectCard: lazy(createRetryableImport(() => import('../components/InteractiveProjectCard'))),
  },

  // Split by content type
  byContent: {
    // Blog content chunks would be loaded dynamically based on route params
  }
};

// Preloading strategies
export const PreloadStrategies = {
  // Preload components on hover
  onHover: (componentImport: () => Promise<any>) => {
    let preloadPromise: Promise<any> | null = null;
    
    return {
      onMouseEnter: () => {
        if (!preloadPromise) {
          preloadPromise = componentImport();
        }
      },
      preload: () => {
        if (!preloadPromise) {
          preloadPromise = componentImport();
        }
        return preloadPromise;
      }
    };
  },

  // Preload components on intersection
  onIntersection: (componentImport: () => Promise<any>, threshold = 0.1) => {
    let preloadPromise: Promise<any> | null = null;
    let observer: IntersectionObserver | null = null;

    return {
      observeElement: (element: Element) => {
        if (!('IntersectionObserver' in window)) return;

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !preloadPromise) {
                preloadPromise = componentImport();
                observer?.disconnect();
              }
            });
          },
          { threshold }
        );

        observer.observe(element);
      },
      cleanup: () => {
        observer?.disconnect();
      }
    };
  },

  // Preload on idle
  onIdle: (componentImport: () => Promise<any>) => {
    let preloadPromise: Promise<any> | null = null;

    const preload = () => {
      if (!preloadPromise) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            preloadPromise = componentImport();
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            preloadPromise = componentImport();
          }, 100);
        }
      }
    };

    return { preload };
  },

  // Preload based on user intent
  onIntent: (componentImport: () => Promise<any>) => {
    let preloadPromise: Promise<any> | null = null;
    
    return {
      onFocus: () => {
        if (!preloadPromise) {
          preloadPromise = componentImport();
        }
      },
      onTouchStart: () => {
        if (!preloadPromise) {
          preloadPromise = componentImport();
        }
      },
      onMouseDown: () => {
        if (!preloadPromise) {
          preloadPromise = componentImport();
        }
      }
    };
  }
};

// Dynamic chunk loading for blog content
export const BlogContentChunks = {
  // Content loading utilities (disabled - content directories don't exist)
  loadPostContent: async (slug: string) => {
    console.warn(`Content loading not implemented for slug: ${slug}`);
    return null;
  },

  loadCategoryContent: async (category: string) => {
    console.warn(`Category loading not implemented for: ${category}`);
    return null;
  }
};

// Bundle analysis utilities
export const BundleUtils = {
  // Log chunk loading times for analysis
  trackChunkLoad: (chunkName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;
    console.log(`Chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
    
    // Track in analytics if available
    if ('gtag' in window) {
      (window as any).gtag('event', 'chunk_loaded', {
        chunk_name: chunkName,
        load_time: loadTime,
        custom_map: { metric1: loadTime }
      });
    }
  },

  // Check if a chunk is already loaded
  isChunkLoaded: (chunkName: string): boolean => {
    // Check if module is in the module cache
    return document.querySelector(`script[src*="${chunkName}"]`) !== null;
  },

  // Prefetch critical chunks
  prefetchCriticalChunks: () => {
    const criticalChunks = [
      'router',
      'motion',
      'ui-components'
    ];

    criticalChunks.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/assets/${chunk}.js`;
      document.head.appendChild(link);
    });
  }
};

// Progressive enhancement for code splitting
export const ProgressiveEnhancement = {
  // Load enhanced features only if supported
  loadIfSupported: async (feature: string, importFn: () => Promise<any>) => {
    const support = {
      webgl: () => !!window.WebGLRenderingContext,
      intersectionObserver: () => 'IntersectionObserver' in window,
      serviceWorker: () => 'serviceWorker' in navigator,
      webWorkers: () => 'Worker' in window,
      webGL2: () => !!(window as any).WebGL2RenderingContext,
      webAssembly: () => 'WebAssembly' in window
    };

    const isSupported = support[feature as keyof typeof support]?.() ?? true;
    
    if (isSupported) {
      return await importFn();
    } else {
      console.log(`Feature "${feature}" not supported, skipping enhanced loading`);
      return null;
    }
  },

  // Load with fallback
  loadWithFallback: async (
    primaryImport: () => Promise<any>,
    fallbackImport: () => Promise<any>
  ) => {
    try {
      return await primaryImport();
    } catch (error) {
      console.warn('Primary import failed, loading fallback', error);
      return await fallbackImport();
    }
  }
};

export default CodeSplitStrategies;
