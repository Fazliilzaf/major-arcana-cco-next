import { useEffect, useRef, useCallback } from "react";

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  lastRenderAt: number;
}

// Global metrics storage
const metricsStore = new Map<string, PerformanceMetrics>();

/**
 * Performance monitoring hook
 * Tracks render time and render count for components
 * 
 * @param componentName - Name of the component to monitor
 * @param options - Monitoring options
 * 
 * @example
 * function MyComponent() {
 *   usePerformance('MyComponent');
 *   
 *   return <div>...</div>;
 * }
 */
export function usePerformance(
  componentName: string,
  options: {
    logToConsole?: boolean;
    threshold?: number; // Log warning if render takes longer than threshold (ms)
  } = {}
) {
  const { logToConsole = false, threshold = 16.67 } = options; // 16.67ms = 60fps
  const renderCount = useRef(0);
  const mountTime = useRef(performance.now());
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    const renderStart = lastRenderTime.current;
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart;
    renderCount.current++;

    // Update metrics
    const metrics: PerformanceMetrics = {
      componentName,
      renderTime,
      renderCount: renderCount.current,
      lastRenderAt: renderEnd,
    };
    metricsStore.set(componentName, metrics);

    // Log to console if enabled
    if (logToConsole) {
      const color = renderTime > threshold ? "color: red; font-weight: bold" : "color: green";
      console.log(
        `%c[Performance] ${componentName}: ${renderTime.toFixed(2)}ms (Render #${renderCount.current})`,
        color
      );
    }

    // Warning for slow renders
    if (renderTime > threshold) {
      console.warn(
        `⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }

    // Update last render time for next measurement
    lastRenderTime.current = performance.now();
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const lifetime = performance.now() - mountTime.current;
      if (logToConsole) {
        console.log(
          `[Performance] ${componentName} unmounted after ${lifetime.toFixed(2)}ms (${renderCount.current} renders)`
        );
      }
    };
  }, [componentName, logToConsole]);
}

/**
 * Get performance metrics for all monitored components
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  return Array.from(metricsStore.values());
}

/**
 * Get performance metrics for a specific component
 */
export function getComponentMetrics(componentName: string): PerformanceMetrics | undefined {
  return metricsStore.get(componentName);
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics() {
  metricsStore.clear();
}

/**
 * Hook to measure async operation performance
 * 
 * @example
 * const measureFetch = useMeasureAsync('fetchCustomers');
 * 
 * const fetchCustomers = async () => {
 *   return measureFetch(async () => {
 *     const response = await fetch('/api/customers');
 *     return response.json();
 *   });
 * };
 */
export function useMeasureAsync(operationName: string) {
  return useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      try {
        const result = await fn();
        const duration = performance.now() - start;
        console.log(`[Async Performance] ${operationName}: ${duration.toFixed(2)}ms`);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        console.error(`[Async Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    },
    [operationName]
  );
}

/**
 * Hook to track component re-render reasons
 * Helps identify unnecessary re-renders
 * 
 * @example
 * useWhyDidYouUpdate('MyComponent', { prop1, prop2, state1 });
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>({});

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[Why Update] ${componentName}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Measure FPS (Frames Per Second)
 * Useful for monitoring scroll performance
 */
export function useFPSMonitor(enabled: boolean = false) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const elapsed = now - lastTime.current;

      // Log FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        const color = fps >= 55 ? "color: green" : fps >= 30 ? "color: orange" : "color: red";
        console.log(`%c[FPS] ${fps} fps`, color);

        frameCount.current = 0;
        lastTime.current = now;
      }

      rafId.current = requestAnimationFrame(measureFPS);
    };

    rafId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [enabled]);
}
