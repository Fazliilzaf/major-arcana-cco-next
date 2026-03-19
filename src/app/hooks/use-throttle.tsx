import { useCallback, useRef } from "react";

/**
 * Throttle a callback function - limits how often it can be called
 * Perfect for scroll handlers, resize handlers, etc.
 * 
 * @param callback - The function to throttle
 * @param delay - Minimum time between calls in milliseconds (default: 100ms)
 * @returns Throttled callback
 * 
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolled!');
 * }, 100);
 * 
 * <div onScroll={handleScroll}>...</div>
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  const lastRan = useRef(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRan.current;

      if (timeSinceLastRun >= delay) {
        // Enough time has passed, execute immediately
        callback(...args);
        lastRan.current = now;
      } else {
        // Not enough time - schedule for later
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay]
  );
}

/**
 * Throttle a value - limits how often the value can update
 * 
 * @param value - The value to throttle
 * @param delay - Minimum time between updates in milliseconds (default: 100ms)
 * @returns Throttled value
 * 
 * @example
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottledValue(scrollY, 100);
 * 
 * // throttledScrollY only updates max once every 100ms
 */
export function useThrottledValue<T>(value: T, delay: number = 100): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= delay) {
      // Enough time has passed, update immediately
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // Not enough time - schedule for later
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, delay - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
}

// Import useState and useEffect
import { useState, useEffect } from "react";
