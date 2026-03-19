import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated' });
    
    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 300ms
    vi.advanceTimersByTime(300);

    // Now value should be updated
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('resets timer on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Rapid changes
    rerender({ value: 'change1' });
    vi.advanceTimersByTime(100);
    
    rerender({ value: 'change2' });
    vi.advanceTimersByTime(100);
    
    rerender({ value: 'change3' });
    vi.advanceTimersByTime(100);

    // Should still be initial (timer kept resetting)
    expect(result.current).toBe('initial');

    // Now wait full 300ms from last change
    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current).toBe('change3');
    });
  });

  it('handles different delay values', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // After 300ms, should still be old value
    vi.advanceTimersByTime(300);
    expect(result.current).toBe('initial');

    // After 500ms total, should be new value
    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 300));
    
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debounces callback execution', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    // Call multiple times rapidly
    result.current('arg1');
    result.current('arg2');
    result.current('arg3');

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(300);

    // Callback should be called once with last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('resets timer on new calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    result.current('call1');
    vi.advanceTimersByTime(100);

    result.current('call2');
    vi.advanceTimersByTime(100);

    result.current('call3');
    vi.advanceTimersByTime(100);

    // Still within delay, should not be called
    expect(callback).not.toHaveBeenCalled();

    // Now complete the delay
    vi.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call3');
  });

  it('preserves callback identity with dependencies', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ dep }) => useDebouncedCallback(() => callback(dep), 300, [dep]),
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
      useDebouncedCallback(callback, 300)
    );

    result.current('test');
    unmount();

    vi.advanceTimersByTime(300);

    // Callback should not be called after unmount
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('Real-world scenarios', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('simulates search input debouncing', async () => {
    const fetchResults = vi.fn();
    const { result, rerender } = renderHook(
      ({ query }) => useDebounce(query, 300),
      { initialProps: { query: '' } }
    );

    // Simulate user typing "hello"
    'hello'.split('').forEach((char, i) => {
      rerender({ query: 'hello'.substring(0, i + 1) });
      vi.advanceTimersByTime(50); // 50ms between keystrokes
    });

    // Should still be empty (debouncing)
    expect(result.current).toBe('');

    // Wait for debounce to complete
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe('hello');
    });
  });

  it('simulates auto-save with debounced callback', () => {
    const saveDocument = vi.fn();
    const { result } = renderHook(() => 
      useDebouncedCallback(saveDocument, 1000)
    );

    // Simulate rapid edits
    result.current({ content: 'Version 1' });
    vi.advanceTimersByTime(200);
    
    result.current({ content: 'Version 2' });
    vi.advanceTimersByTime(200);
    
    result.current({ content: 'Version 3' });
    vi.advanceTimersByTime(200);

    // Should not have saved yet
    expect(saveDocument).not.toHaveBeenCalled();

    // Wait for debounce
    vi.advanceTimersByTime(1000);

    // Should save only once with latest version
    expect(saveDocument).toHaveBeenCalledTimes(1);
    expect(saveDocument).toHaveBeenCalledWith({ content: 'Version 3' });
  });
});
