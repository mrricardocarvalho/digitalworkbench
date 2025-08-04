import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LazyLoader from './components/LazyLoader';
import LoadingSpinner from './components/LoadingSpinner';

// Direct imports since we're using nuclear bundling (no code splitting)
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import InsightsPage from './pages/InsightsPage';
import InsightPostPage from './pages/InsightPostPage';
import CaseStudyPage from './pages/CaseStudyPage';
import ResumePage from './pages/ResumePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  // No need for chunk prefetching with nuclear bundling
  
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