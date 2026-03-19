import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThrottle, useThrottledCallback } from '../use-throttle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('throttles rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // First update should apply immediately
    rerender({ value: 'update1' });
    expect(result.current).toBe('update1');

    // Rapid updates within throttle window should be ignored
    rerender({ value: 'update2' });
    expect(result.current).toBe('update1'); // Still first update

    rerender({ value: 'update3' });
    expect(result.current).toBe('update1'); // Still first update

    // After throttle period, next update should apply
    vi.advanceTimersByTime(300);
    rerender({ value: 'update4' });
    expect(result.current).toBe('update4');
  });

  it('applies update after throttle period', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'update1' });
    expect(result.current).toBe('update1');

    // Try to update within throttle window
    vi.advanceTimersByTime(100);
    rerender({ value: 'update2' });
    expect(result.current).toBe('update1'); // Throttled

    // Complete throttle period
    vi.advanceTimersByTime(200);
    rerender({ value: 'update3' });
    expect(result.current).toBe('update3'); // Applied
  });

  it('handles different throttle delays', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'update1' });
    expect(result.current).toBe('update1');

    // Still within 500ms window
    vi.advanceTimersByTime(400);
    rerender({ value: 'update2' });
    expect(result.current).toBe('update1');

    // After 500ms
    vi.advanceTimersByTime(100);
    rerender({ value: 'update3' });
    expect(result.current).toBe('update3');
  });

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useThrottle('test', 300));
    
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

describe('useThrottledCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('executes callback immediately on first call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 300));

    result.current('arg1');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1');
  });

  it('throttles subsequent calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 300));

    // First call - executes immediately
    result.current('call1');
    expect(callback).toHaveBeenCalledTimes(1);

    // Second call - throttled
    result.current('call2');
    expect(callback).toHaveBeenCalledTimes(1); // Still 1

    // Third call - throttled
    result.current('call3');
    expect(callback).toHaveBeenCalledTimes(1); // Still 1

    // After throttle period
    vi.advanceTimersByTime(300);
    result.current('call4');
    expect(callback).toHaveBeenCalledTimes(2); // Now 2
    expect(callback).toHaveBeenLastCalledWith('call4');
  });

  it('allows calls after throttle period expires', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 300));

    result.current('call1');
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    result.current('call2');
    expect(callback).toHaveBeenCalledTimes(1); // Throttled

    vi.advanceTimersByTime(200); // Total 300ms
    result.current('call3');
    expect(callback).toHaveBeenCalledTimes(2); // Allowed
  });

  it('preserves callback with dependencies', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ dep }) => useThrottledCallback(() => callback(dep), 300, [dep]),
      { initialProps: { dep: 'initial' } }
    );

    const firstCallback = result.current;

    // Rerender with same dependency
    rerender({ dep: 'initial' });
    expect(result.current).toBe(firstCallback);

    // Rerender with different dependency
    rerender({ dep: 'updated' });
    expect(result.current).not.toBe(firstCallback);
  });

  it('cancels pending execution on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => 
      useThrottledCallback(callback, 300)
    );

    result.current('test');
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
    vi.advanceTimersByTime(300);

    // Should not call again after unmount
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('Real-world scenarios', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('simulates scroll event throttling', () => {
    const handleScroll = vi.fn();
    const { result } = renderHook(() => 
      useThrottledCallback(handleScroll, 100)
    );

    // Simulate rapid scroll events (60fps = ~16ms per frame)
    for (let i = 0; i < 10; i++) {
      result.current({ scrollTop: i * 10 });
      vi.advanceTimersByTime(16);
    }

    // Should only call twice (once immediately, once after 100ms)
    expect(handleScroll).toHaveBeenCalledTimes(2);
  });

  it('simulates window resize throttling', () => {
    const handleResize = vi.fn();
    const { result } = renderHook(() => 
      useThrottledCallback(handleResize, 200)
    );

    // Simulate rapid resize events
    result.current({ width: 1000 }); // Immediate
    expect(handleResize).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    result.current({ width: 1100 }); // Throttled

    vi.advanceTimersByTime(50);
    result.current({ width: 1200 }); // Throttled

    expect(handleResize).toHaveBeenCalledTimes(1);

    // After throttle period
    vi.advanceTimersByTime(100); // Total 200ms
    result.current({ width: 1300 }); // Allowed

    expect(handleResize).toHaveBeenCalledTimes(2);
  });

  it('simulates mouse move throttling', () => {
    const trackMousePosition = vi.fn();
    const { result } = renderHook(() => 
      useThrottledCallback(trackMousePosition, 50)
    );

    // Simulate rapid mouse movements
    const positions = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
      { x: 40, y: 40 },
    ];

    positions.forEach((pos, i) => {
      result.current(pos);
      if (i < positions.length - 1) {
        vi.advanceTimersByTime(10); // 10ms between moves
      }
    });

    // Should throttle to ~1 call per 50ms
    expect(trackMousePosition.mock.calls.length).toBeLessThan(positions.length);
  });

  it('throttles API calls on user input', () => {
    const searchAPI = vi.fn();
    const { result } = renderHook(() => 
      useThrottledCallback(searchAPI, 300)
    );

    // User types quickly
    'hello'.split('').forEach((char, i) => {
      result.current(char);
      vi.advanceTimersByTime(50);
    });

    // Should only call API twice (first immediately, then after throttle)
    expect(searchAPI).toHaveBeenCalledTimes(2);
  });
});

describe('Throttle vs Debounce comparison', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throttle executes immediately, debounce waits', () => {
    const throttledFn = vi.fn();
    const { result: throttled } = renderHook(() => 
      useThrottledCallback(throttledFn, 300)
    );

    // Throttle executes immediately
    throttled.current('test');
    expect(throttledFn).toHaveBeenCalledTimes(1);

    // Debounce would wait 300ms before first execution
  });

  it('throttle allows periodic execution during continuous input', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => 
      useThrottledCallback(callback, 100)
    );

    // Continuous input for 500ms
    for (let i = 0; i < 50; i++) {
      result.current(i);
      vi.advanceTimersByTime(10);
    }

    // Throttle executes multiple times (every 100ms)
    expect(callback.mock.calls.length).toBeGreaterThan(3);
    
    // Debounce would only execute once at the end
  });
});
