/**
 * Monitoring & Error Tracking
 * 
 * Setup for Sentry error tracking and performance monitoring
 * Optional: Only initializes if feature flags are enabled
 */

import { config, isProduction } from './env';

/**
 * Initialize Sentry error tracking
 * 
 * Note: Install @sentry/react if you want to use this:
 * npm install @sentry/react
 */
export const initSentry = async (): Promise<void> => {
  if (!config.features.errorTracking || !config.monitoring.sentryDsn) {
    console.log('📊 Sentry error tracking disabled');
    return;
  }

  try {
    // Dynamic import to avoid bundling if not needed
    const Sentry = await import('@sentry/react');

    Sentry.init({
      dsn: config.monitoring.sentryDsn,
      environment: config.monitoring.sentryEnvironment,
      release: config.monitoring.sentryRelease,
      
      // Performance Monitoring
      tracesSampleRate: config.performance.sampleRate,
      
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Ignore specific errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'canvas.contentDocument',
        // Random plugins/extensions
        'atomicFindClose',
        // Network errors that we can't control
        'NetworkError',
        'Network request failed',
        'Failed to fetch',
        // AbortError from cancelled requests
        'AbortError',
        'The operation was aborted',
      ],
      
      // Filter out localhost in production
      beforeSend(event) {
        if (isProduction() && event.request?.url?.includes('localhost')) {
          return null;
        }
        return event;
      },
      
      // Add user context
      beforeBreadcrumb(breadcrumb) {
        // Don't log console in production
        if (isProduction() && breadcrumb.category === 'console') {
          return null;
        }
        return breadcrumb;
      },
    });

    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
};

/**
 * Log error to monitoring service
 */
export const logError = (error: Error, context?: Record<string, unknown>): void => {
  if (config.features.errorTracking) {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, {
          contexts: { additional: context },
        });
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  // Always log to console in development
  if (!isProduction()) {
    console.error('Error:', error, context);
  }
};

/**
 * Log message to monitoring service
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  if (config.features.errorTracking) {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureMessage(message, level);
      });
    } catch (e) {
      console.error('Failed to log message:', e);
    }
  }

  if (!isProduction()) {
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](message);
  }
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (user: {
  id?: string;
  email?: string;
  username?: string;
}): void => {
  if (config.features.errorTracking) {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.setUser(user);
      });
    } catch (e) {
      console.error('Failed to set user context:', e);
    }
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (
  message: string,
  data?: Record<string, unknown>
): void => {
  if (config.features.errorTracking) {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.addBreadcrumb({
          message,
          data,
          level: 'info',
        });
      });
    } catch (e) {
      console.error('Failed to add breadcrumb:', e);
    }
  }
};

/**
 * Start performance transaction
 */
export const startTransaction = (name: string, op: string) => {
  if (config.features.performanceMonitoring) {
    try {
      import('@sentry/react').then((Sentry) => {
        return Sentry.startTransaction({ name, op });
      });
    } catch (e) {
      console.error('Failed to start transaction:', e);
    }
  }
  return null;
};

/**
 * Initialize Google Analytics
 */
export const initAnalytics = (): void => {
  if (!config.features.analytics || !config.monitoring.gaId) {
    console.log('📊 Analytics disabled');
    return;
  }

  try {
    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.monitoring.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', config.monitoring.gaId, {
      send_page_view: false, // We'll send manually
      anonymize_ip: true,
    });

    console.log('✅ Google Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize Analytics:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (path: string): void => {
  if (config.features.analytics && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (config.features.analytics && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Initialize all monitoring services
 */
export const initMonitoring = async (): Promise<void> => {
  console.log('📊 Initializing monitoring services...');

  // Initialize Sentry (error tracking)
  await initSentry();

  // Initialize Analytics
  if (isProduction()) {
    initAnalytics();
  }

  console.log('✅ Monitoring initialized');
};

// Type augmentation for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default {
  initMonitoring,
  logError,
  logMessage,
  setUserContext,
  addBreadcrumb,
  trackPageView,
  trackEvent,
};
