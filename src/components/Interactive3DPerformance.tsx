/**
 * Performance-optimized 3D component with intelligent rendering
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import './Interactive3D.css';

interface Interactive3DPerformanceProps {
  className?: string;
  autoRotate?: boolean;
  performanceMode?: 'auto' | 'high' | 'medium' | 'low';
}

/**
 * Performance levels configuration
 */
const PERFORMANCE_CONFIG = {
  high: {
    animationSpeed: 0.5,
    frameRate: 60,
    enableAutoRotation: true,
    enableShadows: true,
    enableReflections: true,
    textureQuality: 'high'
  },
  medium: {
    animationSpeed: 0.3,
    frameRate: 30,
    enableAutoRotation: true,
    enableShadows: false,
    enableReflections: false,
    textureQuality: 'medium'
  },
  low: {
    animationSpeed: 0.2,
    frameRate: 15,
    enableAutoRotation: false,
    enableShadows: false,
    enableReflections: false,
    textureQuality: 'low'
  }
} as const;

/**
 * Performance-aware 3D Interactive Component
 */
const Interactive3DPerformance: React.FC<Interactive3DPerformanceProps> = ({ 
  className = '',
  autoRotate = true,
  performanceMode = 'auto'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  
  // State management
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  // Device and performance detection
  const deviceInfo = useDeviceDetection();
  
  // Intersection observer for performance optimization
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Determine performance level
  const performanceLevel = useMemo(() => {
    if (performanceMode !== 'auto') return performanceMode;
    
    // Auto-detect based on device capabilities
    if (deviceInfo.performanceLevel === 'low' || deviceInfo.isMobile) return 'low';
    if (deviceInfo.performanceLevel === 'medium') return 'medium';
    return 'high';
  }, [performanceMode, deviceInfo]);

  const config = PERFORMANCE_CONFIG[performanceLevel];

  // Optimized animation loop with frame rate limiting
  const animate = useCallback((timestamp: number) => {
    if (!isVisible || !isIntersecting || isDragging) return;

    const targetFrameRate = config.frameRate;
    const frameInterval = 1000 / targetFrameRate;
    
    if (timestamp - lastFrameTimeRef.current >= frameInterval) {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + config.animationSpeed
      }));
      lastFrameTimeRef.current = timestamp;
    }

    if (config.enableAutoRotation && autoRotate) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isVisible, isIntersecting, isDragging, config, autoRotate]);

  // Start/stop animation based on visibility and performance
  useEffect(() => {
    if (isIntersecting && config.enableAutoRotation && autoRotate && !isDragging) {
      setIsVisible(true);
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsVisible(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isIntersecting, animate, config.enableAutoRotation, autoRotate, isDragging]);

  // Mouse interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (deviceInfo.isTouchDevice) return;
    
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    setIsVisible(false); // Stop auto-rotation during interaction
  }, [deviceInfo.isTouchDevice]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;
    
    const sensitivity = performanceLevel === 'low' ? 0.3 : 0.5;
    
    setRotation(prev => ({
      x: prev.x - deltaY * sensitivity,
      y: prev.y + deltaX * sensitivity
    }));
    
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePosition, performanceLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Resume auto-rotation after a delay
    setTimeout(() => setIsVisible(true), 1000);
  }, []);

  // Touch gesture handlers for mobile
  const { touchHandlers } = useTouchGestures({
    onPan: (gesture) => {
      const sensitivity = performanceLevel === 'low' ? 0.2 : 0.3;
      setRotation(prev => ({
        x: prev.x - gesture.deltaY * sensitivity,
        y: prev.y + gesture.deltaX * sensitivity
      }));
    },
    onDoubleTap: () => {
      setRotation({ x: 0, y: 0 });
    }
  }, {
    preventScroll: true,
    minPanDistance: 5
  });

  // Mouse event listeners
  useEffect(() => {
    if (deviceInfo.isTouchDevice) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, deviceInfo.isTouchDevice]);

  // Performance monitoring (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`3D Component Performance: ${performanceLevel}`, {
        frameRate: config.frameRate,
        animationSpeed: config.animationSpeed,
        autoRotation: config.enableAutoRotation,
        isVisible: isVisible,
        isIntersecting: isIntersecting
      });
    }
  }, [performanceLevel, config, isVisible, isIntersecting]);

  // Combine refs for intersection observer
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    intersectionRef(node);
  }, [intersectionRef]);

  return (
    <div 
      ref={setRefs}
      className={`
        interactive-3d-container 
        ${className} 
        ${deviceInfo.isMobile ? 'mobile' : ''} 
        ${performanceLevel}
        ${isVisible ? 'active' : 'inactive'}
      `}
    >
      <div className="interactive-3d-scene">
        <div
          ref={cubeRef}
          className={`interactive-cube ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            willChange: isVisible ? 'transform' : 'auto'
          }}
          onMouseDown={handleMouseDown}
          {...(deviceInfo.isTouchDevice ? touchHandlers : {})}
        >
          {/* Cube faces */}
          <div className="cube-face front">
            <div className="face-content">
              <div className="face-icon">💼</div>
              <div className="face-text">D365BC</div>
            </div>
          </div>
          <div className="cube-face back">
            <div className="face-content">
              <div className="face-icon">🚀</div>
              <div className="face-text">Vite</div>
            </div>
          </div>
          <div className="cube-face right">
            <div className="face-content">
              <div className="face-icon">💙</div>
              <div className="face-text">TypeScript</div>
            </div>
          </div>
          <div className="cube-face left">
            <div className="face-content">
              <div className="face-icon">🎨</div>
              <div className="face-text">CSS3</div>
            </div>
          </div>
          <div className="cube-face top">
            <div className="face-content">
              <div className="face-icon">⚡</div>
              <div className="face-text">React</div>
            </div>
          </div>
          <div className="cube-face bottom">
            <div className="face-content">
              <div className="face-icon">☁️</div>
              <div className="face-text">Azure</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="interaction-hint">
        <span>
          {deviceInfo.isTouchDevice 
            ? "Touch to rotate • Double-tap to reset"
            : "Drag to rotate • Auto-spins when visible"
          }
        </span>
        {import.meta.env.DEV && (
          <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px' }}>
            Performance: {performanceLevel} • FPS: {config.frameRate}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interactive3DPerformance;
