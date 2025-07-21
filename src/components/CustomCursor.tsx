import React, { useRef, useEffect, useCallback } from 'react';
import './CustomCursor.css';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  // Move useCallback hooks to component body level
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    });
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('clickable'))) {
      cursor.classList.add('custom-cursor--hovering');
    } else {
      cursor.classList.remove('custom-cursor--hovering');
    }
  }, []);

  useEffect(() => {
    // Use passive listeners for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleMouseMove, handleMouseOver]);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
    />
  );
};

export default CustomCursor;