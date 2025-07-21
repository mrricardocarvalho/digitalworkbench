import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { LazyHomePage, LazyResumePage, LazyNotFoundPage } from './pages/LazyPages';
import ProjectsPage from './pages/ProjectsPage';
import CaseStudyPage from './pages/CaseStudyPage';
import InsightPostPage from './pages/InsightPostPage';
import InsightsPage from './pages/InsightsPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* These routes will render inside the Layout's <Outlet> */}
            <Route index element={<LazyHomePage />} />
            <Route path="resume" element={<LazyResumePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<CaseStudyPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="insights/:slug" element={<InsightPostPage />} />            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<LazyNotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;