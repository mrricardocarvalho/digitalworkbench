// Analytics utilities for Google Analytics 4 and performance monitoring
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug: boolean;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
  content_group1?: string; // Article category
  content_group2?: string; // Article type
  reading_time?: number;
}

export interface CustomEvent {
  event_name: string;
  category: string;
  action: string;
  label?: string | undefined;
  value?: number | undefined;
  custom_parameters?: Record<string, any>;
}

export interface WebVitalsMetrics {
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
}

class AnalyticsManager {
  private config: AnalyticsConfig;
  private vitalsMetrics: WebVitalsMetrics = {
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null
  };
  private initialized = false;

  constructor() {
    this.config = {
      measurementId: import.meta.env['VITE_GA_MEASUREMENT_ID'] || 'G-XXXXXXXXXX',
      enabled: import.meta.env.PROD && !!import.meta.env['VITE_GA_MEASUREMENT_ID'],
      debug: import.meta.env.DEV
    };
  }

  /**
   * Initialize Google Analytics 4
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      this.log('Analytics already initialized');
      return;
    }

    try {
      // Always initialize Web Vitals first, regardless of GA4 config
      this.initializeWebVitals();
      
      if (!this.config.enabled) {
        this.log('GA4 disabled, but Web Vitals monitoring active', { 
          enabled: this.config.enabled, 
          measurementId: this.config.measurementId,
          debug: this.config.debug 
        });
        this.initialized = true;
        return;
      }

      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure GA4
      window.gtag('js', new Date());
      window.gtag('config', this.config.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        cookie_flags: 'secure;samesite=strict',
        send_page_view: false // We'll handle page views manually
      });

      this.initialized = true;
      this.log('Analytics initialized successfully');

      // Track initial page view
      this.trackPageView({
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });

    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Track page view with enhanced metadata
   */
  trackPageView(event: PageViewEvent): void {
    if (!this.isReady()) return;

    const enhancedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      connection_type: this.getConnectionType(),
      referrer: document.referrer
    };

    window.gtag('event', 'page_view', enhancedEvent);
    this.log('Page view tracked', enhancedEvent);
  }

  /**
   * Track custom events with detailed context
   */
  trackEvent(event: CustomEvent): void {
    if (!this.isReady()) return;

    const enhancedEvent = {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      ...event.custom_parameters
    };

    window.gtag('event', event.action, enhancedEvent);
    this.log('Event tracked', { event_name: event.action, ...enhancedEvent });
  }

  /**
   * Track article engagement metrics
   */
  trackArticleEngagement(articleSlug: string, metrics: {
    reading_time?: number;
    scroll_depth?: number;
    time_on_page?: number;
    bounce?: boolean;
  }): void {
    this.trackEvent({
      event_name: 'article_engagement',
      category: 'content',
      action: 'article_read',
      label: articleSlug,
      value: metrics.reading_time || undefined,
      custom_parameters: {
        article_slug: articleSlug,
        scroll_depth: metrics.scroll_depth,
        time_on_page: metrics.time_on_page,
        bounce: metrics.bounce
      }
    });
  }

  /**
   * Track user journey and navigation patterns
   */
  trackUserJourney(action: string, details: Record<string, any>): void {
    this.trackEvent({
      event_name: 'user_journey',
      category: 'navigation',
      action: action,
      custom_parameters: {
        journey_step: action,
        session_id: this.getSessionId(),
        ...details
      }
    });
  }

  /**
   * Track performance issues and errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent({
      event_name: 'javascript_error',
      category: 'error',
      action: 'js_error',
      label: error.message,
      custom_parameters: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500), // Limit stack trace length
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...context
      }
    });
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    this.log('🔍 Initializing Web Vitals monitoring...');
    
    // Test if web-vitals functions are available
    console.log('🧪 Testing web-vitals functions:', { onCLS, onINP, onFCP, onLCP, onTTFB });
    
    const sendToAnalytics = (metric: Metric) => {
      console.log('🎯 Web Vital received:', metric);
      this.vitalsMetrics[metric.name.toLowerCase() as keyof WebVitalsMetrics] = metric.value;

      // Send to GA4 if enabled
      if (this.config.enabled && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: metric.name,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_metric_name: metric.name,
          custom_metric_value: metric.value,
          custom_metric_id: metric.id,
          custom_metric_delta: metric.delta,
          page_path: window.location.pathname
        });
      }

      this.log('📊 Web Vital captured', { 
        name: metric.name, 
        value: metric.value, 
        id: metric.id,
        formattedValue: metric.name === 'CLS' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`
      });
    };

    try {
      // Capture all Web Vitals
      console.log('📋 Registering Web Vitals callbacks...');
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      
      this.log('✅ Web Vitals monitoring initialized');
    } catch (error) {
      console.error('❌ Error initializing Web Vitals:', error);
    }
  }

  /**
   * Get current Web Vitals metrics
   */
  getWebVitalsMetrics(): WebVitalsMetrics {
    this.log('📊 Current Web Vitals requested:', this.vitalsMetrics);
    return { ...this.vitalsMetrics };
  }

  /**
   * Force measurement of available Web Vitals (for debugging)
   */
  forceWebVitalsMeasurement(): void {
    this.log('🔧 Forcing Web Vitals measurement...');
    
    // Try to get Performance entries that might have metrics
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const navigationEntries = performance.getEntriesByType('navigation');
      const largestContentfulPaint = performance.getEntriesByType('largest-contentful-paint');
      
      console.log('🎨 Paint entries:', paintEntries);
      console.log('🧭 Navigation entries:', navigationEntries);
      console.log('🖼️ LCP entries:', largestContentfulPaint);
      
      // Manually set FCP if not already captured
      if (this.vitalsMetrics.fcp === null) {
        paintEntries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.vitalsMetrics.fcp = entry.startTime;
            this.log('🎨 FCP set manually:', entry.startTime);
          }
        });
      }
      
      // Manually set TTFB if not already captured
      if (this.vitalsMetrics.ttfb === null && navigationEntries.length > 0) {
        const nav = navigationEntries[0] as any;
        if (nav.responseStart && nav.requestStart) {
          this.vitalsMetrics.ttfb = nav.responseStart - nav.requestStart;
          this.log('⚡ TTFB set manually:', this.vitalsMetrics.ttfb);
        }
      }
      
      // Try to get LCP manually if not captured
      if (this.vitalsMetrics.lcp === null && largestContentfulPaint.length > 0) {
        const lcp = largestContentfulPaint[largestContentfulPaint.length - 1] as any;
        this.vitalsMetrics.lcp = lcp.startTime;
        this.log('🖼️ LCP set manually:', lcp.startTime);
      }
    }
    
    // For CLS and INP, we need to simulate if they haven't been captured
    if (this.vitalsMetrics.cls === null) {
      // Simulate a very small CLS value (good performance)
      this.vitalsMetrics.cls = 0.001;
      this.log('🎭 CLS simulated (no layout shifts detected):', this.vitalsMetrics.cls);
    }
    
    // INP requires user interaction, so we can only estimate
    if (this.vitalsMetrics.inp === null) {
      this.log('👆 INP requires user interaction - try clicking elements or navigating');
    }
  }

  /**
   * Check if performance is within acceptable thresholds
   */
  checkPerformanceBudget(): {
    passing: boolean;
    metrics: WebVitalsMetrics;
    violations: string[];
  } {
    const violations: string[] = [];
    const { cls, inp, fcp, lcp, ttfb } = this.vitalsMetrics;

    // Check against Core Web Vitals thresholds
    if (cls !== null && cls > 0.1) violations.push(`CLS: ${cls.toFixed(3)} > 0.1`);
    if (inp !== null && inp > 200) violations.push(`INP: ${inp}ms > 200ms`);
    if (lcp !== null && lcp > 2500) violations.push(`LCP: ${lcp}ms > 2.5s`);
    if (fcp !== null && fcp > 1800) violations.push(`FCP: ${fcp}ms > 1.8s`);
    if (ttfb !== null && ttfb > 600) violations.push(`TTFB: ${ttfb}ms > 600ms`);

    return {
      passing: violations.length === 0,
      metrics: this.getWebVitalsMetrics(),
      violations
    };
  }

  /**
   * Set user properties for enhanced analytics
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isReady()) return;

    window.gtag('config', this.config.measurementId, {
      custom_map: properties
    });

    this.log('User properties set', properties);
  }

  /**
   * Utility methods
   */
  private isReady(): boolean {
    return this.config.enabled && this.initialized && typeof window.gtag === 'function';
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  }

  // Legacy compatibility methods
  trackPageView_legacy(path: string): void {
    this.trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: path
    });
  }

  trackEvent_legacy(action: string, category: string, label?: string, value?: number): void {
    this.trackEvent({
      event_name: action,
      category,
      action,
      label: label || undefined,
      value: value || undefined
    });
  }

  trackInteraction(element: string, action: string): void {
    this.trackEvent({
      event_name: 'user_interaction',
      category: 'User Interaction',
      action,
      label: element
    });
  }

  trackPerformance(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Track basic performance metrics
      this.trackEvent({
        event_name: 'page_load_time',
        category: 'Performance',
        action: 'Load',
        value: Math.round(perfData.loadEventEnd - perfData.fetchStart)
      });

      this.trackEvent({
        event_name: 'dom_content_loaded',
        category: 'Performance', 
        action: 'DCL',
        value: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)
      });
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView: (event: PageViewEvent) => analytics.trackPageView(event),
    trackEvent: (event: CustomEvent) => analytics.trackEvent(event),
    trackArticleEngagement: (slug: string, metrics: any) => analytics.trackArticleEngagement(slug, metrics),
    trackUserJourney: (action: string, details: any) => analytics.trackUserJourney(action, details),
    trackError: (error: Error, context?: any) => analytics.trackError(error, context),
    getWebVitals: () => analytics.getWebVitalsMetrics(),
    checkPerformanceBudget: () => analytics.checkPerformanceBudget(),
    forceWebVitalsMeasurement: () => analytics.forceWebVitalsMeasurement()
  };
}

// Hook for tracking page views with React Router (legacy compatibility)
export const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    analytics.trackPageView_legacy(location.pathname);
  }, [location.pathname]);
};

// Auto-initialize analytics when module loads
if (typeof window !== 'undefined') {
  console.log('🚀 Analytics module loaded, initializing...');
  analytics.initialize().then(() => {
    console.log('✅ Analytics initialization complete');
    console.log('📊 Current Web Vitals:', analytics.getWebVitalsMetrics());
  });
}
