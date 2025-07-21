/**
 * Advanced animation utilities and micro-interactions
 * Provides sophisticated animation patterns with performance optimization
 */

import { useEffect, useState } from 'react';

// Check if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animation presets for consistent motion design
 */
export const animationPresets = {
  // CSS transition classes
  fadeIn: 'transition-opacity duration-300 ease-out',
  slideUp: 'transition-all duration-400 ease-out transform',
  slideInLeft: 'transition-all duration-400 ease-out transform',
  scale: 'transition-all duration-300 ease-out transform',
  hover: 'transition-all duration-200 ease-out transform hover:scale-105 hover:-translate-y-0.5',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-lg',
  tap: 'transition-transform duration-100 active:scale-98',
  
  // Advanced animations for framer-motion
  framerFadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  framerSlideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },

  framerSlideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },

  framerScale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  // Stagger animations
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};

/**
 * Responsive animation that adapts to reduced motion preferences
 */
export const getResponsiveAnimation = (animation: string, fallback: string = ''): string => {
  return prefersReducedMotion() ? fallback : animation;
};

/**
 * Scroll-triggered animation hook
 */
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold]);

  return { isInView, setElement };
};

/**
 * Parallax scroll effect hook
 */
export const useParallax = (offset: number = 50) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY * offset / 1000;
};

/**
 * Mouse tracking for interactive animations
 */
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

/**
 * Button micro-interactions (CSS classes)
 */
export const buttonInteractions = {
  primary: 'transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-lg active:scale-95',
  secondary: 'transition-all duration-200 ease-out transform hover:scale-102 hover:shadow-md active:scale-98',
  ghost: 'transition-all duration-200 ease-out hover:bg-opacity-10 active:bg-opacity-20',
  loading: 'animate-pulse cursor-not-allowed opacity-70'
};

/**
 * Card hover animations (CSS classes)
 */
export const cardAnimations = {
  subtle: 'transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-lg',
  pronounced: 'transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl',
  glow: 'transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-blue-500/10'
};

/**
 * Text animation effects
 */
export const textAnimations = {
  fadeInUp: 'animate-fade-in-up',
  typewriter: 'animate-typewriter',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x'
};

/**
 * Loading animations
 */
export const loadingAnimations = {
  spinner: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping'
};

/**
 * Page transition utilities
 */
export const pageTransitions = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideInRight: 'animate-slide-in-right'
};

/**
 * Utility to add animation delay
 */
export const withDelay = (animation: string, delay: number): string => {
  return `${animation} animation-delay-${delay}`;
};

/**
 * Intersection Observer hook for triggering animations
 */
export const useInViewAnimation = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, callback, options]);

  return setElement;
};

/**
 * Stagger animation utility for multiple elements
 */
export const createStaggerEffect = (
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  delay: number = 100
) => {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
};

/**
 * Performance-optimized animation classes
 */
export const performanceAnimations = {
  // Use transform and opacity for best performance
  slideUpOptimized: 'transform transition-transform transition-opacity duration-400 ease-out',
  scaleOptimized: 'transform transition-transform transition-opacity duration-300 ease-out',
  fadeOptimized: 'transition-opacity duration-300 ease-out'
};

export default {
  animationPresets,
  getResponsiveAnimation,
  useScrollAnimation,
  useParallax,
  useMousePosition,
  buttonInteractions,
  cardAnimations,
  textAnimations,
  loadingAnimations,
  pageTransitions,
  withDelay,
  useInViewAnimation,
  createStaggerEffect,
  performanceAnimations
};
