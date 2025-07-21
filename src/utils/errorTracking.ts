/**
 * Error tracking and logging utilities
 * Provides centralized error handling and logging capabilities
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
  stack?: string;
  componentStack?: string;
  [key: string]: any;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  context?: ErrorContext;
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
    const errorReport: ErrorReport = {
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

    if (this.isProduction) {
      this.sendToTrackingService(errorReport);
    } else {
      console.error('Error tracked:', errorReport);
    }
  }

  /**
   * Log warning message
   */
  public logWarning(message: string, context?: Partial<ErrorContext>): void {
    const errorReport: ErrorReport = {
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
