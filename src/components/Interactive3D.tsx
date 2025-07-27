import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useTouchGestures } from '../hooks/useTouchGestures';
import './Interactive3D.css';

interface Interactive3DProps {
  className?: string;
}

const Interactive3D: React.FC<Interactive3DProps> = ({ className = '' }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  
  // Device detection for mobile optimizations
  const deviceInfo = useDeviceDetection();
  
  // Configure touch gesture sensitivity based on device
  const touchSensitivity = deviceInfo.isMobile ? 0.3 : 0.5;
  const animationSpeed = deviceInfo.performanceLevel === 'low' ? 0.2 : 
                         deviceInfo.performanceLevel === 'medium' ? 0.3 : 0.5;
  
  // Touch gesture handlers
  const { touchHandlers } = useTouchGestures({
    onPan: (gesture) => {
      setRotation(prev => ({
        x: prev.x - gesture.deltaY * touchSensitivity,
        y: prev.y + gesture.deltaX * touchSensitivity
      }));
    },
    onPinch: (gesture) => {
      if (deviceInfo.isMobile) {
        setScale(Math.max(0.5, Math.min(2, gesture.scale)));
      }
    },
    onDoubleTap: () => {
      // Reset rotation and scale on double tap
      setRotation({ x: 0, y: 0 });
      setScale(1);
    }
  }, {
    preventScroll: true,
    minPanDistance: deviceInfo.isMobile ? 5 : 10
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (deviceInfo.isTouchDevice) return; // Prevent on touch devices
    
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, [deviceInfo.isTouchDevice]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || deviceInfo.isTouchDevice) return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;

    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePosition, deviceInfo.isTouchDevice]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for mouse (desktop only)
  useEffect(() => {
    if (deviceInfo.isTouchDevice) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, deviceInfo.isTouchDevice]);

  // Auto-rotation when not being interacted with (disabled on low-performance devices)
  useEffect(() => {
    if (isDragging || deviceInfo.performanceLevel === 'low' || !deviceInfo.supportsMotion) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + animationSpeed
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isDragging, deviceInfo.performanceLevel, deviceInfo.supportsMotion, animationSpeed]);

  return (
    <div className={`interactive-3d-container ${className} ${deviceInfo.isMobile ? 'mobile' : ''} ${deviceInfo.performanceLevel}`}>
      <div className="interactive-3d-scene">
        <div
          ref={cubeRef}
          className={`interactive-cube ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`
          }}
          onMouseDown={!deviceInfo.isTouchDevice ? handleMouseDown : undefined}
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
            ? deviceInfo.isMobile 
              ? "Swipe to rotate • Pinch to scale • Double-tap to reset"
              : "Touch to rotate • Pinch to scale • Double-tap to reset"
            : "Drag to rotate • Auto-spins when idle"
          }
        </span>
      </div>
    </div>
  );
};

export default Interactive3D;
