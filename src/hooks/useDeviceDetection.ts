import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  supportsMotion: boolean;
  performanceLevel: 'high' | 'medium' | 'low';
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  orientation: 'portrait' | 'landscape';
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initial detection based on window dimensions and user agent
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Basic mobile/tablet detection
    const isMobile = width <= 768 || /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = !isMobile && (width <= 1024 || /ipad|tablet|kindle|silk|gt-p1000/i.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    
    // Performance level estimation
    const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
      // Check for low-end devices
      if (isMobile && (width <= 480 || /android.*4\.|iphone.*ios [6-9]/i.test(userAgent))) {
        return 'low';
      }
      
      // Check for high-end devices
      if (isDesktop || (width >= 1024 && !isMobile)) {
        return 'high';
      }
      
      return 'medium';
    };
    
    // Screen size classification
    const getScreenSize = (): 'small' | 'medium' | 'large' | 'xlarge' => {
      if (width <= 480) return 'small';
      if (width <= 768) return 'medium';
      if (width <= 1024) return 'large';
      return 'xlarge';
    };
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      supportsMotion: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      performanceLevel: getPerformanceLevel(),
      screenSize: getScreenSize(),
      orientation: height > width ? 'portrait' : 'landscape'
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo(prev => ({
        ...prev,
        screenSize: width <= 480 ? 'small' : width <= 768 ? 'medium' : width <= 1024 ? 'large' : 'xlarge',
        orientation: height > width ? 'portrait' : 'landscape'
      }));
    };

    const handleResize = () => {
      // Debounce resize events
      clearTimeout((window as any).resizeTimeout);
      (window as any).resizeTimeout = setTimeout(updateDeviceInfo, 150);
    };

    const handleOrientationChange = () => {
      // Delay to ensure new dimensions are available
      setTimeout(updateDeviceInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout((window as any).resizeTimeout);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
