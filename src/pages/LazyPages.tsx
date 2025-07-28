import React, { lazy, Suspense } from 'react';

// Core Pages - Lazy load for better performance
export const LazyHomePage = lazy(() => import('./HomePage'));
export const LazyResumePage = lazy(() => import('./ResumePage'));
export const LazyProjectsPage = lazy(() => import('./ProjectsPage'));
export const LazyInsightsPage = lazy(() => import('./InsightsPage'));
export const LazyInsightPostPage = lazy(() => import('./InsightPostPage'));
export const LazyCaseStudyPage = lazy(() => import('./CaseStudyPage'));
export const LazyContactPage = lazy(() => import('./ContactPage'));
export const LazyNotFoundPage = lazy(() => import('./NotFoundPage'));

// Heavy Components - Lazy load to reduce initial bundle
export const LazyInteractive3D = lazy(() => import('../components/Interactive3D'));
export const LazyAnimationDemo = lazy(() => import('../components/AnimationDemo'));

// Feature-specific Components (only load components with default exports)
export const LazyCommandPalette = lazy(() => import('../components/CommandPalette'));

// Performance and Monitoring (only load when needed)
export const LazyPerformanceMonitor = lazy(() => import('../components/PerformanceMonitor'));

// Utility function for creating lazy components with loading fallback
export const createLazyComponent = (importFn: () => Promise<any>, FallbackComponent?: React.ComponentType) => {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => (
    <Suspense fallback={FallbackComponent ? <FallbackComponent /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
