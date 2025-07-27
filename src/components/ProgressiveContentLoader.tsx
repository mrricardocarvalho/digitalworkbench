/**
 * Progressive Content Loader
 * Implements progressive enhancement for blog content
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLazySection } from '../utils/performance';

interface ProgressiveContentProps {
  children: React.ReactNode;
  delay?: number;
  placeholder?: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale';
  priority?: 'high' | 'medium' | 'low';
}

// Default skeleton placeholder
const SkeletonPlaceholder: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`skeleton-container ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div 
        key={i}
        className="skeleton-line"
        style={{
          height: '1rem',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          width: i === lines - 1 ? '70%' : '100%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite'
        }}
      />
    ))}
    <style>{`
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

// Animation variants for different loading types
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
};

// Priority-based delays
const priorityDelays = {
  high: 0,
  medium: 150,
  low: 300
};

export const ProgressiveContentLoader: React.FC<ProgressiveContentProps> = ({
  children,
  delay,
  placeholder,
  className = '',
  animationType = 'fade',
  priority = 'medium'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [elementRef, isInView] = useLazySection(0.1, '100px');
  
  // Calculate delay based on priority if not explicitly provided
  const loadDelay = delay !== undefined ? delay : priorityDelays[priority];
  
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, loadDelay);
    
    return () => clearTimeout(timer);
  }, [isInView, loadDelay]);
  
  const variants = animationVariants[animationType];
  
  return (
    <div ref={elementRef} className={className}>
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="placeholder"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.3 }}
          >
            {placeholder || <SkeletonPlaceholder />}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={variants.initial}
            animate={variants.animate}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for progressive content sections
export const useProgressiveContent = (priority: 'high' | 'medium' | 'low' = 'medium') => {
  const [sectionsLoaded, setSectionsLoaded] = useState<Record<string, boolean>>({});
  
  const loadSection = (sectionId: string, delay?: number) => {
    const loadDelay = delay !== undefined ? delay : priorityDelays[priority];
    
    setTimeout(() => {
      setSectionsLoaded(prev => ({
        ...prev,
        [sectionId]: true
      }));
    }, loadDelay);
  };
  
  const isSectionLoaded = (sectionId: string) => sectionsLoaded[sectionId] || false;
  
  return { loadSection, isSectionLoaded };
};

// Progressive image loading with blur-up effect
interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className = '',
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [elementRef, isInView] = useLazySection();
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!isInView) return;
    
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src]);
  
  return (
    <div ref={elementRef} className={`progressive-image ${className}`} style={{ position: 'relative' }}>
      {/* Placeholder (low-res or skeleton) */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isLoaded ? 'blur(0px)' : 'blur(5px)',
          transition: 'filter 0.3s ease',
          opacity: isLoaded ? 0 : 1
        }}
      />
      
      {/* High-res image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Progressive text content with typewriter effect
interface ProgressiveTextProps {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
}

export const ProgressiveText: React.FC<ProgressiveTextProps> = ({
  text,
  speed = 50,
  className = '',
  startDelay = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [elementRef, isInView] = useLazySection();
  
  useEffect(() => {
    if (!isInView) return;
    
    const startTimer = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);
      
      return () => clearInterval(timer);
    }, startDelay);
    
    return () => clearTimeout(startTimer);
  }, [isInView, text, speed, startDelay]);
  
  return (
    <span ref={elementRef} className={className}>
      {displayedText}
      {!isComplete && <span className="cursor">|</span>}
      <style>{`
        .cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

// Content priority manager
export class ContentPriorityManager {
  private static instance: ContentPriorityManager;
  private priorities: Map<string, number> = new Map();
  private loadedSections: Set<string> = new Set();
  
  static getInstance(): ContentPriorityManager {
    if (!ContentPriorityManager.instance) {
      ContentPriorityManager.instance = new ContentPriorityManager();
    }
    return ContentPriorityManager.instance;
  }
  
  setPriority(sectionId: string, priority: number): void {
    this.priorities.set(sectionId, priority);
  }
  
  getSortedSections(): string[] {
    return Array.from(this.priorities.entries())
      .sort(([, a], [, b]) => a - b)
      .map(([sectionId]) => sectionId);
  }
  
  markAsLoaded(sectionId: string): void {
    this.loadedSections.add(sectionId);
  }
  
  isLoaded(sectionId: string): boolean {
    return this.loadedSections.has(sectionId);
  }
  
  getLoadProgress(): number {
    const total = this.priorities.size;
    const loaded = this.loadedSections.size;
    return total > 0 ? (loaded / total) * 100 : 0;
  }
}

export default ProgressiveContentLoader;
