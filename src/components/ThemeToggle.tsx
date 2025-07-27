import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import ThemePreview from './ThemePreview';
import './ThemeToggle.css';

/**
 * Enhanced theme toggle with support for light, dark, and auto modes
 * Includes theme preview functionality for better user experience
 */
const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme, isTransitioning } = useTheme();
  const [showPreview, setShowPreview] = useState(false);

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        );
      case 'dark':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        );
      case 'auto':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light': return 'dark';
      case 'dark': return 'auto';
      case 'auto': return 'light';
      default: return 'light';
    }
  };

  const getAriaLabel = () => {
    const nextTheme = getNextTheme();
    const current = theme === 'auto' ? `auto (${resolvedTheme})` : theme;
    return `Current theme: ${current}. Click to switch to ${nextTheme} mode, or right-click for theme preview`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleTheme();
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.shiftKey || e.ctrlKey) {
        setShowPreview(true);
      } else {
        toggleTheme();
      }
    }
  };

  return (
    <>
      <button
        className={`theme-toggle theme-toggle--${theme} ${isTransitioning ? 'theme-toggle--transitioning' : ''}`}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel()}
        title={`Theme: ${theme === 'auto' ? `Auto (${resolvedTheme})` : theme}\nClick to cycle themes\nRight-click for theme preview`}
      >
        <span className="theme-toggle__icon" aria-hidden="true">
          {getIcon()}
        </span>
        <span className="theme-toggle__text sr-only">
          {theme === 'auto' ? `Auto (${resolvedTheme})` : theme}
        </span>
        {isTransitioning && (
          <span className="theme-toggle__transition-indicator" aria-hidden="true" />
        )}
      </button>

      <ThemePreview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </>
  );
};

export default ThemeToggle;