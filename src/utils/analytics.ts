import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getGAId } from './env';

// Type definitions for Web Vitals
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

// Analytics and performance tracking utilities
export const analytics = {
  // Track page views
  trackPageView: (path: string) => {
    const gaId = getGAId();
    if (typeof window !== 'undefined' && window.gtag && gaId) {
      window.gtag('config', gaId, {
        page_path: path,
      });
    }
  },

  // Track custom events
  trackEvent: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track user interactions
  trackInteraction: (element: string, action: string) => {
    analytics.trackEvent(action, 'User Interaction', element);
  },

  // Track performance metrics
  trackPerformance: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Track Core Web Vitals
      const cls = getCLS();
      const fid = getFID();
      const lcp = getLCP();

      analytics.trackEvent('Core Web Vitals', 'Performance', 'CLS', cls);
      analytics.trackEvent('Core Web Vitals', 'Performance', 'FID', fid);
      analytics.trackEvent('Core Web Vitals', 'Performance', 'LCP', lcp);

      // Track basic metrics
      analytics.trackEvent('Page Load Time', 'Performance', 'Load', Math.round(perfData.loadEventEnd - perfData.fetchStart));
      analytics.trackEvent('DOM Content Loaded', 'Performance', 'DCL', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart));
    }
  }
};

// Web Vitals measurement functions with proper implementation
function getCLS(): number {
  // Cumulative Layout Shift measurement
  let clsValue = 0;
  let clsEntries: LayoutShiftEntry[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsEntries.push(layoutShiftEntry);
        }
      }
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ type: 'layout-shift', buffered: true });
      
      // Calculate CLS from existing entries
      clsValue = clsEntries.reduce((sum, entry) => sum + entry.value, 0);
    }
  } catch (error) {
    console.warn('CLS measurement failed:', error);
  }

  return clsValue;
}

function getFID(): number {
  // First Input Delay measurement
  let fidValue = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-input') {
          const fidEntry = entry as FirstInputEntry;
          fidValue = fidEntry.processingStart - fidEntry.startTime;
        }
      }
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ type: 'first-input', buffered: true });
    }
  } catch (error) {
    console.warn('FID measurement failed:', error);
  }

  return fidValue;
}

function getLCP(): number {
  // Largest Contentful Paint measurement
  let lcpValue = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
      }
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  } catch (error) {
    console.warn('LCP measurement failed:', error);
  }

  return lcpValue;
}

// Hook for tracking page views with React Router
export const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
  }
}
