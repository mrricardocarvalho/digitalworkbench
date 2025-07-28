import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../utils/analytics';
import './PerformanceDashboard.css';

interface PerformanceMetrics {
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
}

interface MetricThresholds {
  good: number;
  needs_improvement: number;
}

const METRIC_THRESHOLDS: Record<string, MetricThresholds> = {
  cls: { good: 0.1, needs_improvement: 0.25 },
  inp: { good: 200, needs_improvement: 500 },
  fcp: { good: 1800, needs_improvement: 3000 },
  lcp: { good: 2500, needs_improvement: 4000 },
  ttfb: { good: 600, needs_improvement: 1500 }
};

const METRIC_LABELS: Record<string, string> = {
  cls: 'Cumulative Layout Shift',
  inp: 'Interaction to Next Paint',
  fcp: 'First Contentful Paint',
  lcp: 'Largest Contentful Paint',
  ttfb: 'Time to First Byte'
};

const METRIC_DESCRIPTIONS: Record<string, string> = {
  cls: 'Measures visual stability by quantifying unexpected layout shifts',
  inp: 'Measures responsiveness during user interactions',
  fcp: 'Measures when the first text or image is painted',
  lcp: 'Measures when the largest content element becomes visible',
  ttfb: 'Measures the responsiveness of your web server'
};

const formatMetricValue = (metric: string, value: number | null): string => {
  if (value === null) return 'N/A';
  
  switch (metric) {
    case 'cls':
      return value.toFixed(3);
    case 'inp':
    case 'fcp':
    case 'lcp':
    case 'ttfb':
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
};

const getMetricStatus = (metric: string, value: number | null): 'good' | 'needs-improvement' | 'poor' | 'loading' => {
  if (value === null) return 'loading';
  
  const thresholds = METRIC_THRESHOLDS[metric];
  if (!thresholds) return 'loading';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needs_improvement) return 'needs-improvement';
  return 'poor';
};

const MetricCard: React.FC<{
  metric: string;
  value: number | null;
  onRefresh: () => void;
}> = ({ metric, value, onRefresh }) => {
  const status = getMetricStatus(metric, value);
  
  const handleRefresh = () => {
    console.log(`🔄 Refreshing ${metric} metric...`);
    onRefresh();
  };
  
  return (
    <div className={`metric-card metric-card--${status}`}>
      <div className="metric-card__header">
        <h3 className="metric-card__title">{METRIC_LABELS[metric]}</h3>
        <button 
          className="metric-card__refresh" 
          onClick={handleRefresh}
          title="Refresh metric"
        >
          ↻
        </button>
      </div>
      
      <div className="metric-card__value">
        {formatMetricValue(metric, value)}
      </div>
      
      <div className={`metric-card__status metric-card__status--${status}`}>
        {status === 'loading' ? 'Measuring...' : status.replace('-', ' ')}
      </div>
      
      <div className="metric-card__description">
        {METRIC_DESCRIPTIONS[metric]}
      </div>
      
      <div className="metric-card__thresholds">
        <div className="threshold threshold--good">
          Good: ≤ {formatMetricValue(metric, METRIC_THRESHOLDS[metric]?.good || 0)}
        </div>
        <div className="threshold threshold--needs-improvement">
          Needs improvement: ≤ {formatMetricValue(metric, METRIC_THRESHOLDS[metric]?.needs_improvement || 0)}
        </div>
      </div>
    </div>
  );
};

export const PerformanceDashboard: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const { getWebVitals, checkPerformanceBudget, forceWebVitalsMeasurement } = useAnalytics();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null
  });
  const [performanceBudget, setPerformanceBudget] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshMetrics = React.useCallback(() => {
    console.log('🔄 Refreshing metrics...');
    // Force measurement of available Web Vitals
    forceWebVitalsMeasurement();
    const vitals = getWebVitals();
    const budget = checkPerformanceBudget();
    console.log('📊 Refreshing Performance Metrics:', {
      vitals,
      budget,
      timestamp: new Date().toISOString()
    });
    setMetrics(vitals);
    setPerformanceBudget(budget);
    setLastUpdated(new Date());
  }, [forceWebVitalsMeasurement, getWebVitals, checkPerformanceBudget]);

  useEffect(() => {
    if (isVisible) {
      refreshMetrics();
      
      // Auto-refresh every 5 seconds when visible
      const interval = setInterval(refreshMetrics, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isVisible, refreshMetrics]);

  if (!isVisible) return null;

  const overallScore = performanceBudget?.passing ? 'good' : 'needs-improvement';
  const metricsWithValues = Object.values(metrics).filter(value => value !== null).length;

  return (
    <div className="performance-dashboard">
      <div className="performance-dashboard__overlay" onClick={onClose} />
      
      <div className="performance-dashboard__content">
        <div className="performance-dashboard__header">
          <h2 className="performance-dashboard__title">
            Performance Monitoring Dashboard
          </h2>
          
          <div className="performance-dashboard__controls">
            <button 
              className="performance-dashboard__refresh"
              onClick={refreshMetrics}
              title="Refresh all metrics"
            >
              Refresh All
            </button>
            
            <button 
              className="performance-dashboard__close"
              onClick={onClose}
              title="Close dashboard"
            >
              ×
            </button>
          </div>
        </div>

        <div className="performance-dashboard__summary">
          <div className={`performance-summary performance-summary--${overallScore}`}>
            <h3>Overall Performance</h3>
            <div className="performance-summary__status">
              {performanceBudget?.passing ? '✅ Passing' : '⚠️ Needs Attention'}
            </div>
            <div className="performance-summary__details">
              {metricsWithValues}/5 metrics captured
              {performanceBudget?.violations.length > 0 && (
                <div className="performance-summary__violations">
                  <strong>Issues:</strong>
                  <ul>
                    {performanceBudget.violations.map((violation: string, index: number) => (
                      <li key={index}>{violation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="performance-dashboard__metrics">
          {Object.entries(metrics).map(([metric, value]) => (
            <MetricCard
              key={metric}
              metric={metric}
              value={value}
              onRefresh={refreshMetrics}
            />
          ))}
        </div>

        <div className="performance-dashboard__footer">
          <div className="performance-dashboard__timestamp">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          <div className="performance-dashboard__info">
            <p>
              <strong>Core Web Vitals</strong> are a set of real-world, user-centered metrics 
              that quantify key aspects of the user experience. They measure three aspects 
              of the user experience: loading, interactivity, and visual stability.
            </p>
            
            <div className="performance-dashboard__legend">
              <div className="legend-item legend-item--good">Good</div>
              <div className="legend-item legend-item--needs-improvement">Needs Improvement</div>
              <div className="legend-item legend-item--poor">Poor</div>
              <div className="legend-item legend-item--loading">Measuring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
