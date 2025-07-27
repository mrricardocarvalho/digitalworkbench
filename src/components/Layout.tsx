import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
import PerformanceMonitor from './PerformanceMonitor';
import AuditDashboard from './AuditDashboard';
import ErrorMonitoringDashboard from './ErrorMonitoringDashboard';
// import CustomCursor from './CustomCursor';
import ScrollToTop from './ScrollToTop';
import { usePageTracking } from '../utils/analytics';
import './Layout.css';

const Layout: React.FC = () => {
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [showAuditDashboard, setShowAuditDashboard] = useState(false);
  const [showErrorMonitoring, setShowErrorMonitoring] = useState(false);
  
  // Enable automatic page tracking
  usePageTracking();

  // Global keyboard shortcut for performance dashboard
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + P for performance dashboard
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setShowPerformanceDashboard(true);
      }
      // Ctrl/Cmd + Shift + A for audit dashboard
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAuditDashboard(true);
      }
      // Ctrl/Cmd + Shift + E for error monitoring
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setShowErrorMonitoring(true);
      }
      // Ctrl/Cmd + Shift + M for performance monitor
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'M') {
        event.preventDefault();
        setShowPerformanceDashboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* <CustomCursor /> */}
      <Header />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      {/* Render the Command Palette */}
      <CommandPalette 
        onShowPerformanceDashboard={() => setShowPerformanceDashboard(true)}
        onShowAuditDashboard={() => setShowAuditDashboard(true)}
        onShowErrorMonitoring={() => setShowErrorMonitoring(true)}
      />
      {/* Performance Dashboard */}
      <PerformanceMonitor 
        isVisible={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />
      {/* Audit Dashboard */}
      <AuditDashboard 
        isOpen={showAuditDashboard}
        onClose={() => setShowAuditDashboard(false)}
      />
      {/* Error Monitoring Dashboard */}
      <ErrorMonitoringDashboard 
        isOpen={showErrorMonitoring}
        onClose={() => setShowErrorMonitoring(false)}
      />
    </div>
  );
};

export default Layout;