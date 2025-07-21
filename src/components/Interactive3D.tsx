import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Interactive3D.css';

interface Interactive3DProps {
  className?: string;
}

const Interactive3D: React.FC<Interactive3DProps> = ({ className = '' }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;

    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      if (touch) {
        setLastMousePosition({ x: touch.clientX, y: touch.clientY });
      }
      e.preventDefault();
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    const touch = e.touches[0];
    if (touch) {
      const deltaX = touch.clientX - lastMousePosition.x;
      const deltaY = touch.clientY - lastMousePosition.y;

      setRotation(prev => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));

      setLastMousePosition({ x: touch.clientX, y: touch.clientY });
    }
    e.preventDefault();
  }, [isDragging, lastMousePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto-rotation when not being interacted with
  useEffect(() => {
    if (isDragging) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.5
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isDragging]);

  // Global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`interactive-3d-container ${className}`}>
      <div className="interactive-3d-scene">
        <div
          ref={cubeRef}
          className={`interactive-cube ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
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
        <span>Drag to rotate • Auto-spins when idle</span>
      </div>
    </div>
  );
};

export default Interactive3D;
