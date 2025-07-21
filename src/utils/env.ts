// Environment configuration with validation

interface EnvironmentConfig {
  SPLINE_SCENE_URL?: string;
  GA_TRACKING_ID?: string;
  NODE_ENV: string;
  DEV: boolean;
  PROD: boolean;
}

class ConfigError extends Error {
  constructor(message: string) {
    super(`Environment Configuration Error: ${message}`);
    this.name = 'ConfigError';
  }
}

const validateConfig = (): EnvironmentConfig => {
  const env = import.meta.env;
  
  const config: EnvironmentConfig = {
    SPLINE_SCENE_URL: env['VITE_SPLINE_SCENE_URL'],
    GA_TRACKING_ID: env['VITE_GA_TRACKING_ID'],
    NODE_ENV: env['NODE_ENV'] || 'development',
    DEV: env['DEV'] || false,
    PROD: env['PROD'] || false,
  };

  // Validate required environment variables
  const requiredInProduction = ['GA_TRACKING_ID'];
  
  if (config.PROD) {
    for (const key of requiredInProduction) {
      if (!config[key as keyof EnvironmentConfig]) {
        console.warn(`Missing required environment variable: VITE_${key}`);
      }
    }
  }

  // Validate URL formats
  if (config.SPLINE_SCENE_URL && !isValidUrl(config.SPLINE_SCENE_URL)) {
    throw new ConfigError('VITE_SPLINE_SCENE_URL must be a valid URL');
  }

  return config;
};

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// Export validated configuration
export const config = validateConfig();

// Helper functions
export const isDev = () => config.DEV;
export const isProd = () => config.PROD;
export const getSplineUrl = () => config.SPLINE_SCENE_URL;
export const getGAId = () => config.GA_TRACKING_ID;
