import { lazy } from 'react';

// Lazy load pages for better performance
export const LazyHomePage = lazy(() => import('./HomePage'));
export const LazyResumePage = lazy(() => import('./ResumePage'));
export const LazyNotFoundPage = lazy(() => import('./NotFoundPage'));
