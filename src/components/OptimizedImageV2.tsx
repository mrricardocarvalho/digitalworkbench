/**
 * Advanced image optimization with WebP support and responsive loading
 */

import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  webpSrc?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

/**
 * WebP format checker utility
 */
const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Generate responsive srcSet for different screen densities
 */
const generateSrcSet = (baseSrc: string, webpSrc?: string): string => {
  const useWebP = supportsWebP() && webpSrc;
  const src = useWebP ? webpSrc : baseSrc;
  
  const baseUrl = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const extension = useWebP ? '.webp' : src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
  
  return [
    `${src} 1x`,
    `${baseUrl}@2x${extension} 2x`
  ].join(', ');
};

/**
 * Optimized Image Component with lazy loading and modern formats
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  webpSrc,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  onLoad,
  onError,
  style
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Intersection observer for lazy loading
  const { ref: setInViewRef, isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Load the actual image when in view or priority
  useEffect(() => {
    if (priority || isInView) {
      setCurrentSrc(src);
    }
  }, [isInView, priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
    // Fallback to original src if WebP fails
    if (webpSrc && currentSrc.includes('.webp')) {
      setCurrentSrc(src);
    }
  };

  const imageStyles: React.CSSProperties = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.7,
    ...style
  };

  if (hasError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#999',
          fontSize: '14px',
          width: width || 'auto',
          height: height || 'auto',
          ...style
        }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {webpSrc && (
        <source
          srcSet={generateSrcSet(src, webpSrc)}
          sizes={sizes}
          type="image/webp"
        />
      )}
      
      {/* Fallback image */}
      <img
        ref={(node) => {
          imgRef.current = node;
          setInViewRef(node);
        }}
        src={currentSrc}
        srcSet={!priority && !isInView ? undefined : generateSrcSet(src, webpSrc)}
        sizes={!priority && !isInView ? undefined : sizes}
        alt={alt}
        width={width}
        height={height}
        className={`optimized-image ${className} ${isLoaded ? 'loaded' : 'loading'}`}
        style={imageStyles}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
};

/**
 * Image preloader utility for critical images
 */
export const preloadImages = (images: string[]) => {
  images.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Convert image to WebP format (utility for build process)
 */
export const getWebPSource = (originalSrc: string): string => {
  if (originalSrc.includes('.webp')) return originalSrc;
  return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

export default OptimizedImage;
