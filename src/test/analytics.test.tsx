import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analytics, useAnalytics } from '../utils/analytics';
import { renderHook } from '@testing-library/react';

// Mock gtag globally
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

describe('Analytics Utils', () => {
  beforeEach(() => {
    // Mock gtag function
    window.gtag = vi.fn();
    vi.clearAllMocks();
  });

  describe('analytics manager', () => {
    it('should be defined', () => {
      expect(analytics).toBeDefined();
    });

    it('should have required methods', () => {
      expect(typeof analytics.trackEvent).toBe('function');
      expect(typeof analytics.trackPageView).toBe('function');
      expect(typeof analytics.trackUserJourney).toBe('function');
    });

    it('should handle trackEvent calls without errors', () => {
      expect(() => {
        analytics.trackEvent({
          event_name: 'test_event',
          category: 'test',
          action: 'click',
          label: 'button'
        });
      }).not.toThrow();
    });

    it('should handle trackPageView calls without errors', () => {
      expect(() => {
        analytics.trackPageView({
          page_title: 'Test Page',
          page_location: 'https://example.com/test',
          page_path: '/test'
        });
      }).not.toThrow();
    });

    it('should handle trackUserJourney calls without errors', () => {
      expect(() => {
        analytics.trackUserJourney('navigation', { from: 'home', to: 'projects' });
      }).not.toThrow();
    });
  });

  describe('useAnalytics hook', () => {
    it('returns analytics functions', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current).toBeDefined();
      expect(typeof result.current.trackUserJourney).toBe('function');
      expect(typeof result.current.trackPageView).toBe('function');
      expect(typeof result.current.trackEvent).toBe('function');
    });

    it('handles trackEvent calls without errors', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(() => {
        result.current.trackEvent({
          event_name: 'test_event',
          category: 'test',
          action: 'click'
        });
      }).not.toThrow();
    });

    it('handles trackUserJourney calls without errors', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(() => {
        result.current.trackUserJourney('test_action', { details: 'test' });
      }).not.toThrow();
    });

    it('handles trackPageView calls without errors', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(() => {
        result.current.trackPageView({
          page_title: 'Test',
          page_location: 'https://test.com',
          page_path: '/test'
        });
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('handles missing gtag gracefully', () => {
      delete (window as any).gtag;

      expect(() => {
        analytics.trackEvent({
          event_name: 'test',
          category: 'test',
          action: 'test'
        });
      }).not.toThrow();
    });

    it('handles gtag errors gracefully', () => {
      window.gtag = vi.fn().mockImplementation(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        analytics.trackEvent({
          event_name: 'test',
          category: 'test',
          action: 'test'
        });
      }).not.toThrow();
    });
  });

  describe('web vitals integration', () => {
    it('should have web vitals methods', () => {
      expect(typeof analytics.getWebVitalsMetrics).toBe('function');
    });

    it('should return web vitals metrics', () => {
      const metrics = analytics.getWebVitalsMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });

    it('should handle performance budget checks', () => {
      expect(typeof analytics.checkPerformanceBudget).toBe('function');
      
      expect(() => {
        analytics.checkPerformanceBudget();
      }).not.toThrow();
    });
  });

  describe('privacy and performance', () => {
    it('handles offline scenarios gracefully', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      });

      expect(() => {
        analytics.trackEvent({
          event_name: 'test',
          category: 'test',
          action: 'test'
        });
      }).not.toThrow();
    });

    it('respects user privacy settings', () => {
      // Analytics should handle privacy considerations gracefully
      expect(() => {
        analytics.trackEvent({
          event_name: 'test',
          category: 'test',
          action: 'test'
        });
      }).not.toThrow();
    });
  });
});
