import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

/**
 * Enhanced theme hook with system preference detection and auto mode
 */
export const useTheme = (): ThemeContextType => {
  // System theme detection
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // User's theme preference
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto';
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'auto';
  });

  // Resolved theme (what's actually being displayed)
  const resolvedTheme: ResolvedTheme = theme === 'auto' ? systemTheme : theme as ResolvedTheme;

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'auto');
    body.classList.remove('theme-light', 'theme-dark');

    // Add current theme classes
    root.classList.add(theme);
    body.classList.add(`theme-${resolvedTheme}`);

    // Set CSS custom property for theme
    root.style.setProperty('--current-theme', resolvedTheme);

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // No visual announcements - keep theme changes silent for better UX
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
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
    systemTheme
  };
};