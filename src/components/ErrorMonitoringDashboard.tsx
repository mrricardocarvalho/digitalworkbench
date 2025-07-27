import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { errorTracker } from '../utils/errorTracking';
import './ErrorMonitoringDashboard.css';

interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  context?: {
    url?: string;
    userAgent?: string;
    sessionId?: string;
    componentStack?: string;
    [key: string]: any;
  };
}

interface MonitoringMetrics {
  totalErrors: number;
  errorRate: number;
  topErrors: { message: string; count: number }[];
  recentErrors: ErrorData[];
  uptime: number;
  performanceIssues: number;
}

interface ErrorMonitoringDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorMonitoringDashboard: React.FC<ErrorMonitoringDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    totalErrors: 0,
    errorRate: 0,
    topErrors: [],
    recentErrors: [],
    uptime: 0,
    performanceIssues: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'errors' | 'performance' | 'settings'>('overview');
  const [errorFilter, setErrorFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  // Simulate error data collection (in production this would come from a real monitoring service)
  const generateMockErrorData = (): MonitoringMetrics => {
    const mockErrors: ErrorData[] = [
      {
        id: '1',
        message: 'Failed to load user data',
        timestamp: Date.now() - 120000,
        level: 'error',
        context: {
          url: window.location.href,
          sessionId: 'sess_123'
        }
      },
      {
        id: '2',
        message: 'Network request timeout',
        timestamp: Date.now() - 300000,
        level: 'warning',
        context: {
          url: window.location.href
        }
      },
      {
        id: '3',
        message: 'Component render optimization needed',
        timestamp: Date.now() - 600000,
        level: 'info',
        context: {
          url: window.location.href,
          componentStack: 'ProjectGallery > InteractiveProjectCard'
        }
      }
    ];

    return {
      totalErrors: mockErrors.length,
      errorRate: 0.1, // 0.1%
      topErrors: [
        { message: 'Network request timeout', count: 5 },
        { message: 'Failed to load user data', count: 3 },
        { message: 'Component render issue', count: 2 }
      ],
      recentErrors: mockErrors,
      uptime: 99.9,
      performanceIssues: 2
    };
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Simulate loading time
      setTimeout(() => {
        setMetrics(generateMockErrorData());
        setIsLoading(false);
      }, 1000);

      // Track dashboard open
      analytics.trackEvent({
        event_name: 'error_monitoring_opened',
        category: 'monitoring',
        action: 'dashboard_opened'
      });
    }
  }, [isOpen]);

  const handleClearErrors = () => {
    analytics.trackEvent({
      event_name: 'errors_cleared',
      category: 'monitoring',
      action: 'clear_errors'
    });

    setMetrics(prev => ({
      ...prev,
      recentErrors: [],
      totalErrors: 0
    }));
  };

  const handleTestError = () => {
    analytics.trackEvent({
      event_name: 'test_error_triggered',
      category: 'monitoring',
      action: 'test_error'
    });

    // Trigger a test error
    try {
      throw new Error('Test error for monitoring dashboard');
    } catch (error) {
      errorTracker.logError(error as Error, {
        type: 'manual-test-error',
        source: 'monitoring-dashboard'
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getErrorLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'error-level-error';
      case 'warning': return 'error-level-warning';
      case 'info': return 'error-level-info';
      default: return '';
    }
  };

  const filteredErrors = errorFilter === 'all' 
    ? metrics.recentErrors 
    : metrics.recentErrors.filter(error => error.level === errorFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Error Monitoring Dashboard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time error tracking and performance monitoring</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['overview', 'errors', 'performance', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Errors</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalErrors}</p>
                        </div>
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.errorRate}%</p>
                        </div>
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.uptime}%</p>
                        </div>
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Performance Issues</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.performanceIssues}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Errors */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Errors</h3>
                    <div className="space-y-2">
                      {metrics.topErrors.map((error, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded">
                          <span className="text-sm text-gray-900 dark:text-white">{error.message}</span>
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                            {error.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Errors</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={errorFilter}
                        onChange={(e) => setErrorFilter(e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Levels</option>
                        <option value="error">Errors</option>
                        <option value="warning">Warnings</option>
                        <option value="info">Info</option>
                      </select>
                      <button
                        onClick={handleClearErrors}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredErrors.map((error) => (
                      <div key={error.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded ${getErrorLevelColor(error.level)}`}>
                                {error.level.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(error.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {error.message}
                            </p>
                            {error.context?.url && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                URL: {error.context.url}
                              </p>
                            )}
                            {error.context?.componentStack && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Component: {error.context.componentStack}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Monitoring</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Performance monitoring helps identify bottlenecks and optimize user experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-600 rounded p-3">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Core Web Vitals</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monitor LCP, FID, and CLS metrics for optimal user experience.
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded p-3">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bundle Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Track bundle size and identify optimization opportunities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monitoring Settings</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Test Error Tracking</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Trigger a test error to verify monitoring is working
                        </p>
                      </div>
                      <button
                        onClick={handleTestError}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                      >
                        Test Error
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Integration Options</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Connect with external monitoring services for enhanced tracking.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" disabled className="rounded" />
                          <label className="text-sm text-gray-600 dark:text-gray-400">Sentry Integration</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" disabled className="rounded" />
                          <label className="text-sm text-gray-600 dark:text-gray-400">LogRocket Integration</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" disabled className="rounded" />
                          <label className="text-sm text-gray-600 dark:text-gray-400">Custom API Endpoint</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMonitoringDashboard;
