import React from 'react';
import Spline from '@splinetool/react-spline';
import { getSplineUrl } from '../utils/env';
import { errorTracker } from '../utils/errorTracking';

const isDevelopment = import.meta.env.DEV;

interface SplineSceneProps {
  sceneUrl?: string;
  fallback?: React.ReactNode;
}

const SplineScene: React.FC<SplineSceneProps> = ({ 
  sceneUrl = getSplineUrl() || "https://prod.spline.design/your-unique-code/scene.splinecode",
  fallback = <div className="spline-fallback">3D Scene Loading...</div>
}) => {
  // Don't render if no valid scene URL is provided
  if (!sceneUrl || sceneUrl.includes('your-unique-code')) {
    return <>{fallback}</>;
  }

  return (
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
        });
      }}
    />
  );
};

export default SplineScene;