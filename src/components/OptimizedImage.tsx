/**
 * Image optimization utilities for performance enhancement
 * Handles lazy loading, responsive images, and modern formats
 */

import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image component with lazy loading and modern format support
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate WebP version if available
  const getOptimizedSrc = (originalSrc: string): string => {
    // For now, return original src
    // In production, this could generate WebP/AVIF versions
    return originalSrc;
  };

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ 
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
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
            filter: 'blur(2px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px'
          }}
        >
          Image failed to load
        </div>
      )}
    </div>
  );
};

/**
 * Hook for preloading critical images
 */
export const useImagePreload = (imageUrls: string[]) => {
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      preloadedImages.push(img);
    });

    return () => {
      // Cleanup
      preloadedImages.forEach(img => {
        img.src = '';
      });
    };
  }, [imageUrls]);
};

/**
 * Generate responsive image sizes for different viewports
 */
export const generateResponsiveSizes = (
  baseSrc: string,
  sizes: { width: number; suffix: string }[]
): string => {
  return sizes
    .map(({ width, suffix }) => {
      const responsiveSrc = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `${suffix}.$1`);
      return `${responsiveSrc} ${width}w`;
    })
    .join(', ');
};

/**
 * Check if WebP is supported by the browser
 */
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob((blob) => {
      resolve(blob !== null);
    }, 'image/webp');
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (
  originalSrc: string
): Promise<string> => {
  const supportsWebP = await isWebPSupported();
  
  if (supportsWebP && originalSrc.includes('.jpg')) {
    return originalSrc.replace('.jpg', '.webp');
  }
  
  return originalSrc;
};

export default OptimizedImage;
