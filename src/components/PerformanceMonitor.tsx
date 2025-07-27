/**
 * Performance Monitor Component
 * Tracks and displays real-time performance metrics
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitoring, loadCriticalResources, optimizeImageLoading } from '../utils/performance';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  navigationStart?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

interface PerformanceMonitorProps {
  isVisible?: boolean;
  onClose?: () => void;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible = false,
  onClose,
  position = 'bottom-right'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { metrics: webVitals, isSupported } = usePerformanceMonitoring();

  useEffect(() => {
    // Get navigation timing metrics
    const updateMetrics = () => {
      if (performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          setMetrics({
            navigationStart: navigation.startTime || performance.timeOrigin,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
            loadComplete: navigation.loadEventEnd - navigation.startTime,
            ttfb: navigation.responseStart - navigation.requestStart
          });
        }
      }
    };

    // Get connection info
    const updateConnection = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || 'unknown');
      }
    };

    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    updateMetrics();
    updateConnection();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    loadCriticalResources();
    optimizeImageLoading();
  }, []);

  const formatTime = (time?: number) => {
    if (time === undefined) return 'N/A';
    return `${Math.round(time)}ms`;
  };

  const getScoreColor = (metric: string, value?: number) => {
    if (value === undefined) return '#999';
    
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return '#999';

    if (value <= threshold.good) return '#0f766e';
    if (value <= threshold.poor) return '#ea580c';
    return '#dc2626';
  };

  const getConnectionIcon = () => {
    switch (connectionType) {
      case '4g': return '📶';
      case '3g': return '📵';
      case '2g': return '📱';
      case 'slow-2g': return '🐌';
      default: return '🌐';
    }
  };

  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          style={{
            position: 'fixed',
            ...positionStyles[position],
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontFamily: 'monospace',
            fontSize: '12px',
            minWidth: '280px',
            maxWidth: '400px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
              ⚡ Performance Monitor
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Connection Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span>{getConnectionIcon()}</span>
            <span style={{ color: isOnline ? '#10b981' : '#ef4444' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span style={{ color: '#9ca3af' }}>
              ({connectionType})
            </span>
          </div>

          {/* Web Vitals */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#fbbf24' }}>Core Web Vitals</h4>
            <div style={{ display: 'grid', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>FCP (First Contentful Paint):</span>
                <span style={{ color: getScoreColor('fcp', webVitals.fcp) }}>
                  {formatTime(webVitals.fcp)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>LCP (Largest Contentful Paint):</span>
                <span style={{ color: getScoreColor('lcp', webVitals.lcp) }}>
                  {formatTime(webVitals.lcp)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>FID (First Input Delay):</span>
                <span style={{ color: getScoreColor('fid', webVitals.fid) }}>
                  {formatTime(webVitals.fid)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CLS (Cumulative Layout Shift):</span>
                <span style={{ color: getScoreColor('cls', webVitals.cls) }}>
                  {webVitals.cls ? webVitals.cls.toFixed(3) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Timing */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#8b5cf6' }}>Navigation Timing</h4>
            <div style={{ display: 'grid', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>TTFB (Time to First Byte):</span>
                <span style={{ color: getScoreColor('ttfb', metrics.ttfb) }}>
                  {formatTime(metrics.ttfb)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>DOM Content Loaded:</span>
                <span>{formatTime(metrics.domContentLoaded)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Load Complete:</span>
                <span>{formatTime(metrics.loadComplete)}</span>
              </div>
            </div>
          </div>

          {/* Performance Score */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#06b6d4' }}>Performance Score</h4>
            <PerformanceScore metrics={webVitals} />
          </div>

          {/* Optimization Tips */}
          <OptimizationTips metrics={webVitals} connectionType={connectionType} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Performance Score Component
const PerformanceScore: React.FC<{ metrics: any }> = ({ metrics }) => {
  const calculateScore = () => {
    const scores = [];
    
    if (metrics.fcp) {
      scores.push(metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0);
    }
    if (metrics.lcp) {
      scores.push(metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0);
    }
    if (metrics.fid) {
      scores.push(metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0);
    }
    if (metrics.cls) {
      scores.push(metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0);
    }
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  };

  const score = calculateScore();
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {score}
      </div>
      <div>
        <div style={{ fontWeight: 'bold', color: getScoreColor(score) }}>
          {score >= 90 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Improvement'}
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af' }}>
          Overall Performance
        </div>
      </div>
    </div>
  );
};

// Optimization Tips Component
const OptimizationTips: React.FC<{ metrics: any; connectionType: string }> = ({ 
  metrics, 
  connectionType 
}) => {
  const getTips = () => {
    const tips = [];
    
    if (metrics.fcp && metrics.fcp > 1800) {
      tips.push('💡 Optimize critical render path');
    }
    if (metrics.lcp && metrics.lcp > 2500) {
      tips.push('🖼️ Optimize largest content element');
    }
    if (metrics.fid && metrics.fid > 100) {
      tips.push('⚡ Reduce JavaScript execution time');
    }
    if (metrics.cls && metrics.cls > 0.1) {
      tips.push('📐 Reserve space for dynamic content');
    }
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      tips.push('📱 Consider offline-first approach');
    }
    
    return tips;
  };

  const tips = getTips();

  if (tips.length === 0) {
    return (
      <div style={{ fontSize: '10px', color: '#10b981' }}>
        ✅ Performance looks great!
      </div>
    );
  }

  return (
    <div>
      <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b', fontSize: '12px' }}>
        Optimization Tips
      </h4>
      <div style={{ fontSize: '10px', color: '#d1d5db' }}>
        {tips.map((tip, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
