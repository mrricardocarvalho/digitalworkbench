/**
 * Design system tokens and UX improvements
 */

export const designTokens = {
  // Typography scale with perfect ratios
  typography: {
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },

  // Spacing system (based on 4px grid)
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },

  // Consistent border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadow system
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    default: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Animation system
  animations: {
    durations: {
      fastest: '150ms',
      fast: '200ms',
      normal: '300ms',
      slow: '400ms',
      slowest: '500ms',
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index system
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    modal: '1000',
    tooltip: '1100',
    notification: '1200',
  }
};

/**
 * Component design patterns
 */
export const componentPatterns = {
  // Card component styles
  card: {
    base: `
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: ${designTokens.borderRadius.lg};
      box-shadow: ${designTokens.shadows.sm};
      transition: box-shadow ${designTokens.animations.durations.fast} ${designTokens.animations.easings.easeOut};
    `,
    hover: `
      box-shadow: ${designTokens.shadows.md};
      transform: translateY(-1px);
    `,
    padding: {
      sm: designTokens.spacing[4],
      md: designTokens.spacing[6],
      lg: designTokens.spacing[8],
    }
  },

  // Button component styles
  button: {
    base: `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: ${designTokens.typography.weights.medium};
      font-size: ${designTokens.typography.scale.sm};
      line-height: ${designTokens.typography.lineHeights.tight};
      border-radius: ${designTokens.borderRadius.md};
      border: 1px solid transparent;
      cursor: pointer;
      transition: all ${designTokens.animations.durations.fast} ${designTokens.animations.easings.easeOut};
      user-select: none;
      min-height: 44px; /* Touch target size */
    `,
    sizes: {
      sm: `
        padding: ${designTokens.spacing[2]} ${designTokens.spacing[3]};
        font-size: ${designTokens.typography.scale.xs};
        min-height: 36px;
      `,
      md: `
        padding: ${designTokens.spacing[3]} ${designTokens.spacing[4]};
        font-size: ${designTokens.typography.scale.sm};
        min-height: 44px;
      `,
      lg: `
        padding: ${designTokens.spacing[4]} ${designTokens.spacing[6]};
        font-size: ${designTokens.typography.scale.base};
        min-height: 48px;
      `
    },
    variants: {
      primary: `
        background-color: var(--primary-color);
        color: white;
        &:hover {
          background-color: color-mix(in srgb, var(--primary-color) 90%, black);
          transform: translateY(-1px);
          box-shadow: ${designTokens.shadows.sm};
        }
        &:active {
          transform: translateY(0);
        }
      `,
      secondary: `
        background-color: var(--surface-color);
        color: var(--text-color);
        border-color: var(--border-color);
        &:hover {
          background-color: var(--border-color);
          border-color: var(--subtle-text-color);
        }
      `,
      outline: `
        background-color: transparent;
        color: var(--primary-color);
        border-color: var(--primary-color);
        &:hover {
          background-color: var(--primary-color);
          color: white;
        }
      `
    }
  },

  // Form input styles
  input: {
    base: `
      width: 100%;
      padding: ${designTokens.spacing[3]} ${designTokens.spacing[4]};
      font-size: ${designTokens.typography.scale.sm};
      line-height: ${designTokens.typography.lineHeights.tight};
      color: var(--text-color);
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: ${designTokens.borderRadius.md};
      transition: border-color ${designTokens.animations.durations.fast} ${designTokens.animations.easings.easeOut};
      min-height: 44px; /* Touch target size */
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      &::placeholder {
        color: var(--subtle-text-color);
      }
    `
  }
};

/**
 * Micro-interactions and animations
 */
export const microInteractions = {
  // Hover effects
  hoverLift: `
    transition: transform ${designTokens.animations.durations.fast} ${designTokens.animations.easings.easeOut};
    &:hover {
      transform: translateY(-2px);
    }
  `,

  // Loading states
  pulse: `
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,

  // Focus indicators
  focusRing: `
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent);
    }
  `,

  // Interactive feedback
  tapFeedback: `
    transition: transform ${designTokens.animations.durations.fastest} ${designTokens.animations.easings.easeOut};
    &:active {
      transform: scale(0.98);
    }
  `
};

/**
 * Accessibility utilities
 */
export const a11yUtils = {
  // Screen reader only text
  srOnly: `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `,

  // Focus management
  focusVisible: `
    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `,

  // High contrast mode support
  highContrast: `
    @media (prefers-contrast: high) {
      border: 2px solid;
    }
  `,

  // Reduced motion support
  reducedMotion: `
    @media (prefers-reduced-motion: reduce) {
      animation: none;
      transition: none;
    }
  `
};

/**
 * CSS custom properties generator
 */
export const generateCSSCustomProperties = () => {
  const properties: string[] = [];

  // Typography
  Object.entries(designTokens.typography.scale).forEach(([key, value]) => {
    properties.push(`--font-size-${key}: ${value};`);
  });

  // Spacing
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    properties.push(`--spacing-${key}: ${value};`);
  });

  // Shadows
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    properties.push(`--shadow-${key}: ${value};`);
  });

  // Border radius
  Object.entries(designTokens.borderRadius).forEach(([key, value]) => {
    properties.push(`--radius-${key}: ${value};`);
  });

  return `:root {\n  ${properties.join('\n  ')}\n}`;
};

export default {
  designTokens,
  componentPatterns,
  microInteractions,
  a11yUtils,
  generateCSSCustomProperties
};
