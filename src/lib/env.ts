/**
 * Environment Configuration Helper
 * 
 * Provides type-safe access to environment variables
 * and configuration based on current environment.
 */

// Environment type
export type Environment = 'development' | 'production' | 'test';

/**
 * Get current environment
 */
export const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;
  
  if (env === 'production') return 'production';
  if (env === 'test') return 'test';
  return 'development';
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * Check if running in test
 */
export const isTest = (): boolean => {
  return getEnvironment() === 'test';
};

/**
 * Get environment variable with fallback
 */
const getEnv = (key: string, fallback?: string): string => {
  const value = import.meta.env[key];
  
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  
  return value;
};

/**
 * Get boolean environment variable
 */
const getBoolEnv = (key: string, fallback = false): boolean => {
  const value = getEnv(key, String(fallback));
  return value === 'true' || value === '1';
};

/**
 * Get number environment variable
 */
const getNumberEnv = (key: string, fallback: number): number => {
  const value = getEnv(key, String(fallback));
  const num = parseInt(value, 10);
  return isNaN(num) ? fallback : num;
};

/**
 * Application Configuration
 */
export const config = {
  // Application
  app: {
    env: getEnvironment(),
    name: getEnv('VITE_APP_NAME', 'HairTP Clinic CCO'),
    version: getEnv('VITE_APP_VERSION', '1.0.0'),
    url: getEnv('VITE_APP_URL', 'http://localhost:5173'),
  },

  // API
  api: {
    url: getEnv('VITE_API_URL', 'http://localhost:3000/api'),
    key: getEnv('VITE_API_KEY', ''),
    timeout: getNumberEnv('VITE_API_TIMEOUT', 30000),
  },

  // Features
  features: {
    ai: getBoolEnv('VITE_FEATURE_AI_ENABLED', true),
    advancedSearch: getBoolEnv('VITE_FEATURE_ADVANCED_SEARCH', true),
    multiMailbox: getBoolEnv('VITE_FEATURE_MULTI_MAILBOX', true),
    analytics: getBoolEnv('VITE_FEATURE_ANALYTICS', false),
    errorTracking: getBoolEnv('VITE_FEATURE_ERROR_TRACKING', false),
    performanceMonitoring: getBoolEnv('VITE_FEATURE_PERFORMANCE_MONITORING', true),
    offlineMode: getBoolEnv('VITE_FEATURE_OFFLINE_MODE', false),
    beta: getBoolEnv('VITE_FEATURE_BETA', false),
  },

  // Monitoring
  monitoring: {
    sentryDsn: getEnv('VITE_SENTRY_DSN', ''),
    sentryEnvironment: getEnv('VITE_SENTRY_ENVIRONMENT', getEnvironment()),
    sentryRelease: getEnv('VITE_SENTRY_RELEASE', getEnv('VITE_APP_VERSION', '1.0.0')),
    gaId: getEnv('VITE_GA_ID', ''),
  },

  // Performance
  performance: {
    tracking: getBoolEnv('VITE_PERFORMANCE_TRACKING', true),
    sampleRate: parseFloat(getEnv('VITE_PERFORMANCE_SAMPLE_RATE', '0.1')),
    cacheTTL: getNumberEnv('VITE_CACHE_TTL', 300000),
    virtualScrollThreshold: getNumberEnv('VITE_VIRTUAL_SCROLL_THRESHOLD', 50),
  },

  // Limits
  limits: {
    maxMessages: getNumberEnv('VITE_MAX_MESSAGES', 1000),
    messagesPerPage: getNumberEnv('VITE_MESSAGES_PER_PAGE', 50),
    searchDebounce: getNumberEnv('VITE_SEARCH_DEBOUNCE', 300),
    draftAutoSaveDelay: getNumberEnv('VITE_DRAFT_AUTOSAVE_DELAY', 2000),
    slaWarningThreshold: getNumberEnv('VITE_SLA_WARNING_THRESHOLD', 15),
  },

  // UI
  ui: {
    defaultTheme: getEnv('VITE_DEFAULT_THEME', 'system') as 'light' | 'dark' | 'system',
    defaultDensity: getEnv('VITE_DEFAULT_DENSITY', 'standard') as 'minimal' | 'standard' | 'detailed',
    enableAnimations: getBoolEnv('VITE_ENABLE_ANIMATIONS', true),
    enableSounds: getBoolEnv('VITE_ENABLE_SOUNDS', false),
  },

  // Security
  security: {
    cspEnabled: getBoolEnv('VITE_CSP_ENABLED', true),
    corsOrigins: getEnv('VITE_CORS_ORIGINS', '').split(',').filter(Boolean),
    rateLimit: getNumberEnv('VITE_RATE_LIMIT', 100),
  },

  // Development
  dev: {
    debug: getBoolEnv('VITE_DEBUG', false),
    useMockData: getBoolEnv('VITE_USE_MOCK_DATA', false),
    showPerformanceOverlay: getBoolEnv('VITE_SHOW_PERFORMANCE_OVERLAY', false),
  },
} as const;

/**
 * Feature flag checker
 */
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

/**
 * Log configuration (development only)
 */
if (isDevelopment()) {
  console.group('🔧 Application Configuration');
  console.log('Environment:', config.app.env);
  console.log('Version:', config.app.version);
  console.log('Features:', config.features);
  console.log('Debug mode:', config.dev.debug);
  console.groupEnd();
}

/**
 * Validate required environment variables
 */
export const validateEnvironment = (): void => {
  const required: string[] = [];

  // Add required env vars for production
  if (isProduction()) {
    if (!config.app.url) required.push('VITE_APP_URL');
    
    if (config.features.errorTracking && !config.monitoring.sentryDsn) {
      console.warn('Error tracking enabled but VITE_SENTRY_DSN not set');
    }
    
    if (config.features.analytics && !config.monitoring.gaId) {
      console.warn('Analytics enabled but VITE_GA_ID not set');
    }
  }

  if (required.length > 0) {
    throw new Error(
      `Missing required environment variables: ${required.join(', ')}\n` +
      'Please check your .env file or Vercel environment variables.'
    );
  }
};

// Validate on import
validateEnvironment();

export default config;
