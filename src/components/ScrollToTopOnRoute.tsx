import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top when route changes
 * This ensures articles always start at the top regardless of previous scroll position
 */
const ScrollToTopOnRoute: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    // Skip in test environment where window.scrollTo throws "Not implemented"
    try {
      if (typeof window !== 'undefined' && 
          typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      // Silently ignore errors in test environment
      // JSDOM throws "Not implemented: window.scrollTo"
    }
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRoute;
