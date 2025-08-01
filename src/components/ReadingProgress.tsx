import React, { useState, useEffect } from 'react';
import './ReadingProgress.css';

interface ReadingProgressProps {
  target?: string; // CSS selector for the content to track
  className?: string;
  showPercentage?: boolean;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  target = '.insight-body',
  className = '',
  showPercentage = false
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target) as HTMLElement;
      
      if (!targetElement) {
        return;
      }

      const targetTop = targetElement.offsetTop;
      const targetHeight = targetElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;

      // Calculate when content starts and ends relative to viewport
      const startReading = targetTop - windowHeight + 100; // Start tracking 100px before content enters viewport
      const finishReading = targetTop + targetHeight - 100; // Finish tracking 100px before content leaves viewport

      if (scrollTop < startReading) {
        setProgress(0);
        setIsVisible(false);
      } else if (scrollTop > finishReading) {
        setProgress(100);
        setIsVisible(true);
      } else {
        const readingProgress = ((scrollTop - startReading) / (finishReading - startReading)) * 100;
        setProgress(Math.max(0, Math.min(100, readingProgress)));
        setIsVisible(true);
      }
    };

    // Initial calculation
    updateProgress();

    // Update on scroll
    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return (
    <div className={`reading-progress ${className} ${isVisible ? 'reading-progress--visible' : ''}`}>
      <div 
        className="reading-progress__bar"
        style={{ width: `${progress}%` }}
      />
      {showPercentage && isVisible && (
        <div className="reading-progress__percentage">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ReadingProgress;
