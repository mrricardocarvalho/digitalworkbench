import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import './LazyLoader.css';

// Enhanced loading states for different component types
interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  loadingType?: 'default' | 'skeleton' | 'minimal' | 'page';
  delay?: number;
}

// Default loading states
const DefaultFallback = () => (
  <div className="lazy-loader-fallback">
    <LoadingSpinner />
  </div>
);

const SkeletonFallback = () => (
  <div className="skeleton-container">
    <div className="skeleton-header" />
    <div className="skeleton-content">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

const MinimalFallback = () => (
  <div className="minimal-loading">
    <span>Loading...</span>
  </div>
);

const PageFallback = () => (
  <motion.div 
    className="page-loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="page-loading-content">
      <LoadingSpinner />
      <p>Loading page...</p>
    </div>
  </motion.div>
);

// Error boundary component
class LazyErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Default error fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="lazy-error-fallback">
    <h3>Failed to load component</h3>
    <p>Something went wrong while loading this component.</p>
    <details>
      <summary>Error details</summary>
      <pre>{error.message}</pre>
    </details>
    <button onClick={retry} className="retry-button">
      Try Again
    </button>
  </div>
);

// Main LazyLoader component
export const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback: CustomFallback,
  errorFallback,
  loadingType = 'default',
  delay = 0
}) => {
  // Choose appropriate fallback based on loading type
  const getFallbackComponent = () => {
    if (CustomFallback) return CustomFallback;
    
    switch (loadingType) {
      case 'skeleton': return SkeletonFallback;
      case 'minimal': return MinimalFallback;
      case 'page': return PageFallback;
      default: return DefaultFallback;
    }
  };

  const FallbackComponent = getFallbackComponent();

  return (
    <LazyErrorBoundary {...(errorFallback && { fallback: errorFallback })}>
      <Suspense fallback={<FallbackComponent />}>
        {delay > 0 ? (
          <DelayedRenderer delay={delay}>
            {children}
          </DelayedRenderer>
        ) : (
          children
        )}
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Delayed renderer for progressive enhancement
const DelayedRenderer: React.FC<{ children: React.ReactNode; delay: number }> = ({ 
  children, 
  delay 
}) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <MinimalFallback />;
  }

  return <>{children}</>;
};

// Higher-order component for easy lazy loading
export const withLazyLoader = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<LazyLoaderProps, 'children'>
) => {
  return (props: P) => (
    <LazyLoader {...options}>
      <Component {...props} />
    </LazyLoader>
  );
};

// Hook for progressive enhancement
export const useProgressiveEnhancement = (feature: string) => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);

  React.useEffect(() => {
    // Check for feature support
    const checkSupport = () => {
      switch (feature) {
        case 'webgl':
          return !!window.WebGLRenderingContext;
        case 'intersectionObserver':
          return 'IntersectionObserver' in window;
        case 'webWorkers':
          return 'Worker' in window;
        case 'serviceWorker':
          return 'serviceWorker' in navigator;
        default:
          return true;
      }
    };

    const supported = checkSupport();
    setIsSupported(supported);
    
    // Enable with slight delay for progressive enhancement
    if (supported) {
      const timer = setTimeout(() => setIsEnabled(true), 100);
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [feature]);

  return { isSupported, isEnabled };
};

export default LazyLoader;
