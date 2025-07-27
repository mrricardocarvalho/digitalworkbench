import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
  isTransitioning: boolean;
  canTransition: boolean;
}

/**
 * Enhanced theme hook with smooth transitions, system preference detection and auto mode
 */
export const useTheme = (): ThemeContextType => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canTransition, setCanTransition] = useState(true);

  // Check if user prefers reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setCanTransition(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setCanTransition(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // System theme detection with improved accuracy
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    
    // Check multiple indicators for better system theme detection
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Fallback to time-based detection if no preference
    if (!prefersDark && !prefersLight) {
      const hour = new Date().getHours();
      return hour >= 18 || hour <= 6 ? 'dark' : 'light';
    }
    
    return prefersDark ? 'dark' : 'light';
  });

  // User's theme preference with validation
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto';
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const validThemes: Theme[] = ['light', 'dark', 'auto'];
      return savedTheme && validThemes.includes(savedTheme) ? savedTheme : 'auto';
    } catch {
      return 'auto';
    }
  });

  // Resolved theme (what's actually being displayed)
  const resolvedTheme: ResolvedTheme = theme === 'auto' ? systemTheme : theme as ResolvedTheme;

  // Listen to system theme changes with improved detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document with smooth transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const body = window.document.body;

    let transitionTimeout: number | null = null;

    // Start transition if transitions are enabled
    if (canTransition) {
      setIsTransitioning(true);
      
      // Add transition class for smooth color changes
      root.classList.add('theme-transitioning');
      
      // Remove transition class after animation completes
      transitionTimeout = setTimeout(() => {
        root.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 300);
    }

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'auto');
    body.classList.remove('theme-light', 'theme-dark');

    // Add current theme classes
    root.classList.add(theme);
    body.classList.add(`theme-${resolvedTheme}`);

    // Set CSS custom property for theme
    root.style.setProperty('--current-theme', resolvedTheme);
    root.style.setProperty('--theme-transition-duration', canTransition ? '0.3s' : '0s');

    // Save to localStorage with error handling
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#0a0a0a'
      };
      metaThemeColor.setAttribute('content', colors[resolvedTheme]);
    }

    // Cleanup function
    return () => {
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        root.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }
    };

  }, [theme, resolvedTheme, canTransition]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Analytics tracking for theme changes
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'theme_change', {
        event_category: 'user_preference',
        event_label: newTheme,
        value: newTheme === 'auto' ? 0 : newTheme === 'light' ? 1 : 2
      });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      switch (prevTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'auto';
        case 'auto':
        default:
          return 'light';
      }
    });
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
    isTransitioning,
    canTransition
  };
};