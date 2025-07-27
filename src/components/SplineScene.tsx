import React from 'react';
import Spline from '@splinetool/react-spline';
import { getSplineUrl } from '../utils/env';
import { errorTracker } from '../utils/errorTracking';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import './SplineScene.css';

const isDevelopment = import.meta.env.DEV;

interface SplineSceneProps {
  sceneUrl?: string;
  fallback?: React.ReactNode;
  enableMobileOptimization?: boolean;
}

const SplineScene: React.FC<SplineSceneProps> = ({ 
  sceneUrl = getSplineUrl() || "https://prod.spline.design/your-unique-code/scene.splinecode",
  fallback = <div className="spline-fallback">3D Scene Loading...</div>,
  enableMobileOptimization = true
}) => {
  const deviceInfo = useDeviceDetection();
  
  // Don't render if no valid scene URL is provided
  if (!sceneUrl || sceneUrl.includes('your-unique-code')) {
    return <>{fallback}</>;
  }

  // On low-performance devices, show fallback instead of Spline scene
  if (enableMobileOptimization && deviceInfo.performanceLevel === 'low') {
    return (
      <div className="spline-fallback spline-fallback--performance">
        <div className="fallback-content">
          <div className="fallback-icon">🎮</div>
          <h3>3D Experience</h3>
          <p>Enhanced for your device</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`spline-container ${deviceInfo.isMobile ? 'spline-mobile' : ''} ${deviceInfo.performanceLevel}`}>
      <Spline 
        scene={sceneUrl}
        onLoad={() => {
          if (isDevelopment) {
            console.log('Spline scene loaded');
          }
        }}
        onError={(error) => {
          errorTracker.logError(new Error(`Spline scene error: ${error}`), {
            type: 'spline-scene-error',
            sceneUrl,
            deviceInfo: {
              isMobile: deviceInfo.isMobile,
              performanceLevel: deviceInfo.performanceLevel,
              screenSize: deviceInfo.screenSize
            }
          });
        }}
        style={{
          width: '100%',
          height: '100%',
          touchAction: deviceInfo.isMobile ? 'pan-x pan-y' : 'auto'
        }}
      />
      {deviceInfo.isMobile && (
        <div className="spline-mobile-hint">
          <span>Drag to interact • Pinch to zoom</span>
        </div>
      )}
    </div>
  );
};

export default SplineScene;