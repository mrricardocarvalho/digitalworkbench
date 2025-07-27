/**
 * Error tracking and logging utilities
 * Provides centralized error handling and logging capabilities
 */

import { analytics } from './analytics';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
  stack?: string;
  componentStack?: string;
  type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  [key: string]: any;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  context?: ErrorContext;
  count?: number;
  firstSeen?: number;
  lastSeen?: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  errorRate: number;
  uptime: number;
}

class ErrorTracker {
  private isProduction = import.meta.env.PROD;
  private sessionId = this.generateSessionId();

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private getErrorContext(): ErrorContext {
    return {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };
  }

  /**
   * Log error to console in development, send to tracking service in production
   */
  public logError(error: Error, context?: Partial<ErrorContext>): void {
    const errorId = this.generateErrorId(error.message, error.stack);
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      level: 'error',
      context: {
        ...this.getErrorContext(),
        ...context,
      },
    };

    if (error.stack) {
      errorReport.stack = error.stack;
    }

    // Track with analytics
    analytics.trackEvent({
      event_name: 'error_logged',
      category: 'error_tracking',
      action: 'log_error',
      label: error.name,
      custom_parameters: {
        error_message: error.message,
        error_type: context?.type || 'unknown'
      }
    });

    if (this.isProduction) {
      this.sendToTrackingService(errorReport);
    } else {
      console.error('Error tracked:', errorReport);
    }
  }

  private generateErrorId(message: string, stack?: string): string {
    const hash = this.hashString(message + (stack || ''));
    return `error_${hash}_${Date.now()}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Log warning message
   */
  public logWarning(message: string, context?: Partial<ErrorContext>): void {
    const warningId = this.generateErrorId(message);
    
    const errorReport: ErrorReport = {
      id: warningId,
      message,
      level: 'warning',
      context: {
        ...this.getErrorContext(),
        ...context,
      },
    };

    if (this.isProduction) {
      this.sendToTrackingService(errorReport);
    } else {
      console.warn('Warning tracked:', errorReport);
    }
  }

  /**
   * Log React component errors
   */
  public logComponentError(
    error: Error,
    errorInfo: { componentStack: string | null }
  ): void {
    this.logError(error, {
      componentStack: errorInfo.componentStack || 'Unknown component stack',
      type: 'react-error-boundary',
    });
  }

  /**
   * Send error to external tracking service
   * In the future, this can be replaced with Sentry, LogRocket, or similar
   */
  private sendToTrackingService(errorReport: ErrorReport): void {
    // For now, we'll just log to console in production
    // In the future, replace this with actual service integration
    console.error('Production error:', errorReport);
    
    // Example implementation for Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorReport.message), {
    //     level: errorReport.level,
    //     contexts: { custom: errorReport.context },
    //   });
    // }
    
    // Example implementation for custom API:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // }).catch(() => {
    //   // Silently fail to avoid infinite error loops
    // });
  }

  /**
   * Initialize global error handlers
   */
  public initializeGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        type: 'unhandled-promise-rejection',
      });
    });

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(event.error || new Error(event.message), {
        type: 'global-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Initialize global error handlers
if (typeof window !== 'undefined') {
  errorTracker.initializeGlobalHandlers();
}

export { errorTracker };
export default errorTracker;
