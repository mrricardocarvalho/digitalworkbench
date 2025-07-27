import React from 'react';
import { useTheme } from '../hooks/useTheme';
import './ThemePreview.css';

interface ThemePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Theme Preview Component - Shows how different themes will look
 */
const ThemePreview: React.FC<ThemePreviewProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, systemTheme } = useTheme();

  if (!isOpen) return null;

  const themes = [
    {
      name: 'Light',
      value: 'light' as const,
      description: 'Clean and bright interface',
      colors: {
        bg: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#1A1A1A',
        subtle: '#525252',
        accent: '#007CF0',
        border: '#E5E5E5'
      }
    },
    {
      name: 'Dark',
      value: 'dark' as const,
      description: 'Easy on the eyes, perfect for night',
      colors: {
        bg: '#0a0a0a',
        surface: '#121212',
        text: '#ffffff',
        subtle: '#b3b3b3',
        accent: '#1e90ff',
        border: '#333333'
      }
    },
    {
      name: 'Auto',
      value: 'auto' as const,
      description: `Follows system preference (${systemTheme})`,
      colors: systemTheme === 'dark' ? {
        bg: '#0a0a0a',
        surface: '#121212',
        text: '#ffffff',
        subtle: '#b3b3b3',
        accent: '#1e90ff',
        border: '#333333'
      } : {
        bg: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#1A1A1A',
        subtle: '#525252',
        accent: '#007CF0',
        border: '#E5E5E5'
      }
    }
  ];

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'auto') => {
    setTheme(selectedTheme);
    // Close preview after a short delay to show the transition
    setTimeout(onClose, 500);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="theme-preview-overlay" onClick={handleBackdropClick}>
      <div className="theme-preview-modal">
        <div className="theme-preview-header">
          <h3>Choose Your Theme</h3>
          <button 
            className="theme-preview-close"
            onClick={onClose}
            aria-label="Close theme preview"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="theme-preview-content">
          {themes.map((themeOption) => (
            <div
              key={themeOption.value}
              className={`theme-preview-option ${theme === themeOption.value ? 'active' : ''}`}
              onClick={() => handleThemeSelect(themeOption.value)}
            >
              <div className="theme-preview-sample" style={{
                backgroundColor: themeOption.colors.bg,
                borderColor: themeOption.colors.border
              }}>
                <div 
                  className="theme-preview-surface"
                  style={{
                    backgroundColor: themeOption.colors.surface,
                    borderColor: themeOption.colors.border
                  }}
                >
                  <div style={{ color: themeOption.colors.text }}>
                    Sample Text
                  </div>
                  <div style={{ color: themeOption.colors.subtle }}>
                    Subtle text
                  </div>
                  <div 
                    className="theme-preview-accent"
                    style={{ backgroundColor: themeOption.colors.accent }}
                  />
                </div>
              </div>

              <div className="theme-preview-info">
                <h4>{themeOption.name}</h4>
                <p>{themeOption.description}</p>
                {theme === themeOption.value && (
                  <span className="theme-preview-current">Current</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="theme-preview-footer">
          <p>Changes apply instantly. Your preference is saved automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
