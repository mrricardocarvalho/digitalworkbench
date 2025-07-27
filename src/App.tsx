import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LazyLoader from './components/LazyLoader';
import LoadingSpinner from './components/LoadingSpinner'; // Import a spinner
import { CodeSplitStrategies, BundleUtils } from './utils/codeSplitting';

// Destructure the lazy components
const {
  HomePage,
  ProjectsPage,
  InsightsPage,
  InsightPostPage,
  CaseStudyPage,
  ResumePage,
  ContactPage,
  NotFoundPage
} = CodeSplitStrategies.byRoute;

const App: React.FC = () => {
  // Prefetch critical chunks on app load
  React.useEffect(() => {
    BundleUtils.prefetchCriticalChunks();
  }, []);

  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* These routes will render inside the Layout's <Outlet> */}
              <Route 
                index 
                element={
                  <LazyLoader loadingType="page">
                    <HomePage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="resume" 
                element={
                  <LazyLoader loadingType="page">
                    <ResumePage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="projects" 
                element={
                  <LazyLoader loadingType="page">
                    <ProjectsPage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="projects/:slug" 
                element={
                  <LazyLoader loadingType="page">
                    <CaseStudyPage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="insights" 
                element={
                  <LazyLoader loadingType="page">
                    <InsightsPage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="insights/:slug" 
                element={
                  <LazyLoader loadingType="page">
                    <InsightPostPage />
                  </LazyLoader>
                } 
              />
              <Route 
                path="contact" 
                element={
                  <LazyLoader loadingType="page">
                    <ContactPage />
                  </LazyLoader>
                } 
              />            
              {/* Catch-all route for 404 */}
              <Route 
                path="*" 
                element={
                  <LazyLoader loadingType="minimal">
                    <NotFoundPage />
                  </LazyLoader>
                } 
              />
            </Route>
          </Routes>
        </Suspense>
      </LazyMotion>
    </ErrorBoundary>
  );
}

export default App;