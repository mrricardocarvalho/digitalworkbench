import React from 'react';
import type { Variants } from 'framer-motion';

// Animation chunk loader with progressive enhancement
export class AnimationChunkLoader {
  private static loadedChunks = new Set<string>();
  private static chunkPromises = new Map<string, Promise<any>>();

  // Load animation variants dynamically
  static async loadAnimationChunk(chunkName: string): Promise<Record<string, Variants>> {
    if (this.loadedChunks.has(chunkName)) {
      return this.getChunkFromCache();
    }

    if (this.chunkPromises.has(chunkName)) {
      return await this.chunkPromises.get(chunkName)!;
    }

    const promise = this.importAnimationChunk(chunkName);
    this.chunkPromises.set(chunkName, promise);

    try {
      const chunk = await promise;
      this.loadedChunks.add(chunkName);
      return chunk;
    } catch (error) {
      this.chunkPromises.delete(chunkName);
      console.warn(`Failed to load animation chunk: ${chunkName}`, error);
      return this.getFallbackAnimations();
    }
  }

  private static async importAnimationChunk(chunkName: string) {
    // For now, return fallback animations since the animation files don't exist yet
    // In a real implementation, these would load from actual animation files
    console.log(`Loading animation chunk: ${chunkName}`);
    return this.getFallbackAnimations();
  }

  private static getChunkFromCache() {
    // In a real implementation, this would retrieve from cache
    return this.getFallbackAnimations();
  }

  private static getFallbackAnimations(): Record<string, Variants> {
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      },
      slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      },
      scaleIn: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      },
      slideInFromLeft: {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
      }
    };
  }

  // Preload animation chunks based on route
  static preloadForRoute(route: string) {
    const routeAnimations = {
      '/': ['hero-animations', 'scroll-animations'],
      '/projects': ['card-animations', 'scroll-animations'],
      '/insights': ['card-animations', 'page-transitions'],
      '/resume': ['page-transitions', 'scroll-animations']
    };

    const chunks = routeAnimations[route as keyof typeof routeAnimations] || [];
    chunks.forEach(chunk => this.loadAnimationChunk(chunk));
  }
}

// Progressive animation enhancement hook
export const useProgressiveAnimations = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [animationLevel, setAnimationLevel] = React.useState<'none' | 'reduced' | 'full'>('full');

  React.useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      setAnimationLevel('reduced');
    }

    // Check device capabilities
    const checkCapabilities = () => {
      const { hardwareConcurrency, deviceMemory } = navigator as any;
      const isLowEnd = (
        hardwareConcurrency && hardwareConcurrency <= 2
      ) || (
        deviceMemory && deviceMemory <= 2
      );

      if (isLowEnd) {
        setAnimationLevel('reduced');
      } else {
        setIsEnabled(true);
      }
    };

    checkCapabilities();

    // Listen for preference changes
    prefersReducedMotion.addEventListener('change', (e) => {
      setAnimationLevel(e.matches ? 'reduced' : 'full');
    });

    return () => {
      prefersReducedMotion.removeEventListener('change', () => {});
    };
  }, []);

  return { isEnabled, animationLevel };
};

// Animation performance monitor
export const AnimationPerformanceMonitor = {
  frameDrops: 0,
  lastFrameTime: 0,
  isMonitoring: false,

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.checkFrameRate();
  },

  checkFrameRate() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const delta = now - this.lastFrameTime;
    
    // Target 60fps (16.67ms per frame)
    if (delta > 33) { // More than 2 frames dropped
      this.frameDrops++;
      
      // If too many frame drops, suggest reducing animations
      if (this.frameDrops > 10) {
        console.warn('Poor animation performance detected, consider reducing motion');
        this.stopMonitoring();
        return;
      }
    }

    this.lastFrameTime = now;
    requestAnimationFrame(() => this.checkFrameRate());
  },

  stopMonitoring() {
    this.isMonitoring = false;
    this.frameDrops = 0;
  },

  getRecommendation(): 'full' | 'reduced' | 'none' {
    if (this.frameDrops > 10) return 'none';
    if (this.frameDrops > 5) return 'reduced';
    return 'full';
  }
};

export default AnimationChunkLoader;
