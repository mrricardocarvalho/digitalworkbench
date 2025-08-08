/**
 * Route-based code splitting with optimized loading states
 */

import React, { Suspense, type ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazyRouteProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
}

/**
 * Enhanced lazy route wrapper with performance optimizations
 */
export const LazyRoute: React.FC<LazyRouteProps> = ({ 
  component: Component, 
  fallback
}) => {
  // Default optimized loading fallback
  const defaultFallback = (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <LoadingSpinner />
    </div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || defaultFallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Preload utility for critical routes
 */
export const preloadRoute = (importFn: () => Promise<any>) => {
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.as = 'script';
  
  // Trigger the import to start loading
  importFn().catch(() => {
    // Silent fail for preloading
  });
};

/**
 * HOC for route-based code splitting
 */
export const withLazyLoading = (importFn: () => Promise<any>, options?: Partial<LazyRouteProps>) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => (
    <LazyRoute 
      component={() => <LazyComponent {...props} />} 
      {...options}
    />
  );
};

export default LazyRoute;
