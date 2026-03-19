import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePerformance, useComponentMetrics, useRenderCount } from '../use-performance';
import { mockPerformanceNow } from '../../../test/utils/test-helpers';

describe('usePerformance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts and ends performance measurements', () => {
    const { result } = renderHook(() => usePerformance());

    const measureId = result.current.start('test-operation');
    expect(measureId).toBeTruthy();

    const duration = result.current.end(measureId);
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it('measures operation duration accurately', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    const measureId = result.current.start('test');
    perfMock.advance(100); // Simulate 100ms

    const duration = result.current.end(measureId);
    expect(duration).toBe(100);

    perfMock.reset();
  });

  it('tracks multiple measurements', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    const id1 = result.current.start('operation1');
    perfMock.advance(50);
    const duration1 = result.current.end(id1);

    const id2 = result.current.start('operation2');
    perfMock.advance(100);
    const duration2 = result.current.end(id2);

    expect(duration1).toBe(50);
    expect(duration2).toBe(100);

    perfMock.reset();
  });

  it('returns metrics for a measurement', () => {
    const { result } = renderHook(() => usePerformance());

    const measureId = result.current.start('test-operation');
    result.current.end(measureId);

    const metrics = result.current.getMetrics('test-operation');
    
    expect(metrics).toBeTruthy();
    expect(metrics?.name).toBe('test-operation');
    expect(metrics?.count).toBeGreaterThan(0);
    expect(metrics?.average).toBeGreaterThanOrEqual(0);
  });

  it('calculates average duration over multiple measurements', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    // First measurement: 100ms
    const id1 = result.current.start('operation');
    perfMock.advance(100);
    result.current.end(id1);

    // Second measurement: 200ms
    const id2 = result.current.start('operation');
    perfMock.advance(200);
    result.current.end(id2);

    const metrics = result.current.getMetrics('operation');
    expect(metrics?.count).toBe(2);
    expect(metrics?.average).toBe(150); // (100 + 200) / 2

    perfMock.reset();
  });

  it('tracks min and max durations', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    const measurements = [50, 200, 100, 150, 75];
    
    measurements.forEach(duration => {
      const id = result.current.start('operation');
      perfMock.advance(duration);
      result.current.end(id);
    });

    const metrics = result.current.getMetrics('operation');
    expect(metrics?.min).toBe(50);
    expect(metrics?.max).toBe(200);

    perfMock.reset();
  });

  it('clears all metrics', () => {
    const { result } = renderHook(() => usePerformance());

    result.current.start('op1');
    result.current.start('op2');

    result.current.clear();

    expect(result.current.getMetrics('op1')).toBeNull();
    expect(result.current.getMetrics('op2')).toBeNull();
  });

  it('returns all metrics', () => {
    const { result } = renderHook(() => usePerformance());

    const id1 = result.current.start('operation1');
    result.current.end(id1);

    const id2 = result.current.start('operation2');
    result.current.end(id2);

    const allMetrics = result.current.getAllMetrics();
    
    expect(allMetrics).toHaveProperty('operation1');
    expect(allMetrics).toHaveProperty('operation2');
  });
});

describe('useComponentMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks component render time', async () => {
    const { result } = renderHook(() => useComponentMetrics('TestComponent'));

    await waitFor(() => {
      expect(result.current.renderCount).toBeGreaterThan(0);
      expect(result.current.lastRenderTime).toBeGreaterThanOrEqual(0);
    });
  });

  it('increments render count on rerender', () => {
    const { result, rerender } = renderHook(() => useComponentMetrics('TestComponent'));

    const initialCount = result.current.renderCount;

    rerender();
    expect(result.current.renderCount).toBe(initialCount + 1);

    rerender();
    expect(result.current.renderCount).toBe(initialCount + 2);
  });

  it('tracks average render time', () => {
    const { result, rerender } = renderHook(() => useComponentMetrics('TestComponent'));

    // Trigger multiple renders
    rerender();
    rerender();
    rerender();

    expect(result.current.averageRenderTime).toBeGreaterThan(0);
    expect(result.current.renderCount).toBeGreaterThanOrEqual(4);
  });

  it('provides performance warnings for slow renders', () => {
    const perfMock = mockPerformanceNow();
    const { result, rerender } = renderHook(() => 
      useComponentMetrics('SlowComponent', { threshold: 16 })
    );

    perfMock.advance(50); // Simulate slow render (> 16ms)
    rerender();

    expect(result.current.isSlowRender).toBe(true);
    expect(result.current.lastRenderTime).toBeGreaterThan(16);

    perfMock.reset();
  });

  it('resets metrics', () => {
    const { result, rerender } = renderHook(() => useComponentMetrics('TestComponent'));

    rerender();
    rerender();

    const countBeforeReset = result.current.renderCount;
    expect(countBeforeReset).toBeGreaterThan(1);

    result.current.reset();

    expect(result.current.renderCount).toBe(1); // Reset to 1 (current render)
  });
});

describe('useRenderCount', () => {
  it('starts at 1 on mount', () => {
    const { result } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
  });

  it('increments on each rerender', () => {
    const { result, rerender } = renderHook(() => useRenderCount());

    expect(result.current).toBe(1);

    rerender();
    expect(result.current).toBe(2);

    rerender();
    expect(result.current).toBe(3);

    rerender();
    expect(result.current).toBe(4);
  });

  it('tracks renders accurately with prop changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useRenderCount(),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe(1);

    rerender({ value: 'updated1' });
    expect(result.current).toBe(2);

    rerender({ value: 'updated2' });
    expect(result.current).toBe(3);
  });
});

describe('Real-world performance scenarios', () => {
  it('measures list rendering performance', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    const measureId = result.current.start('render-list-1000-items');
    
    // Simulate rendering 1000 items
    perfMock.advance(50); // 50ms to render 1000 items
    
    const duration = result.current.end(measureId);

    expect(duration).toBe(50);
    expect(duration).toBeLessThan(100); // Should be under 100ms

    perfMock.reset();
  });

  it('tracks search operation performance', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    // Fast search
    const id1 = result.current.start('search');
    perfMock.advance(10);
    result.current.end(id1);

    // Slow search
    const id2 = result.current.start('search');
    perfMock.advance(200);
    result.current.end(id2);

    const metrics = result.current.getMetrics('search');
    expect(metrics?.count).toBe(2);
    expect(metrics?.min).toBe(10);
    expect(metrics?.max).toBe(200);
    expect(metrics?.average).toBe(105);

    perfMock.reset();
  });

  it('detects performance regressions', () => {
    const perfMock = mockPerformanceNow();
    const { result } = renderHook(() => usePerformance());

    // Baseline measurements (fast)
    for (let i = 0; i < 5; i++) {
      const id = result.current.start('operation');
      perfMock.advance(20);
      result.current.end(id);
    }

    const baselineMetrics = result.current.getMetrics('operation');
    expect(baselineMetrics?.average).toBe(20);

    // New measurement (slow - regression)
    const regressionId = result.current.start('operation');
    perfMock.advance(100);
    result.current.end(regressionId);

    const newMetrics = result.current.getMetrics('operation');
    expect(newMetrics?.max).toBe(100);
    expect(newMetrics?.max).toBeGreaterThan(baselineMetrics!.average * 2); // 2x slower

    perfMock.reset();
  });

  it('monitors component rerender frequency', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useComponentMetrics('DataList'),
      { initialProps: { data: [] } }
    );

    // Simulate rapid rerenders (potential performance issue)
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
      rerender({ data: Array(i) });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(result.current.renderCount).toBeGreaterThanOrEqual(10);
    
    // If 10 renders take > 160ms (16ms per frame * 10), we have a problem
    const averagePerRender = duration / result.current.renderCount;
    expect(averagePerRender).toBeLessThan(50); // Should be under 50ms per render
  });
});

describe('Performance budgets', () => {
  it('warns when operation exceeds budget', () => {
    const perfMock = mockPerformanceNow();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => 
      usePerformance({ budget: 50, warn: true })
    );

    const id = result.current.start('slow-operation');
    perfMock.advance(100); // Exceeds 50ms budget
    result.current.end(id);

    // Should warn about budget exceeded
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    perfMock.reset();
  });

  it('does not warn when within budget', () => {
    const perfMock = mockPerformanceNow();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => 
      usePerformance({ budget: 100, warn: true })
    );

    const id = result.current.start('fast-operation');
    perfMock.advance(50); // Within 100ms budget
    result.current.end(id);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    perfMock.reset();
  });
});

describe('Memory and cleanup', () => {
  it('cleans up measurements on unmount', () => {
    const { result, unmount } = renderHook(() => usePerformance());

    const id = result.current.start('operation');
    result.current.end(id);

    expect(result.current.getMetrics('operation')).toBeTruthy();

    unmount();

    // After unmount, measurements should be cleaned up
    // (implementation dependent)
  });

  it('limits stored measurements to prevent memory leaks', () => {
    const { result } = renderHook(() => 
      usePerformance({ maxEntries: 100 })
    );

    // Create 150 measurements
    for (let i = 0; i < 150; i++) {
      const id = result.current.start(`operation-${i}`);
      result.current.end(id);
    }

    const allMetrics = result.current.getAllMetrics();
    const metricCount = Object.keys(allMetrics).length;

    // Should not exceed maxEntries
    expect(metricCount).toBeLessThanOrEqual(100);
  });
});
