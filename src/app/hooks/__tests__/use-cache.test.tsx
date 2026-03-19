import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCache, useCachedFetch } from '../use-cache';
import { mockDateNow } from '../../../test/utils/test-helpers';

describe('useCache', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Basic Operations', () => {
    it('sets and gets values', () => {
      const { result } = renderHook(() => useCache<string>());

      result.current.set('key1', 'value1');
      const value = result.current.get('key1');

      expect(value).toBe('value1');
    });

    it('returns null for non-existent keys', () => {
      const { result } = renderHook(() => useCache<string>());

      const value = result.current.get('non-existent');
      expect(value).toBeNull();
    });

    it('checks if key exists', () => {
      const { result } = renderHook(() => useCache<string>());

      result.current.set('key1', 'value1');

      expect(result.current.has('key1')).toBe(true);
      expect(result.current.has('key2')).toBe(false);
    });

    it('deletes specific keys', () => {
      const { result } = renderHook(() => useCache<string>());

      result.current.set('key1', 'value1');
      result.current.set('key2', 'value2');

      result.current.delete('key1');

      expect(result.current.has('key1')).toBe(false);
      expect(result.current.has('key2')).toBe(true);
    });

    it('clears all entries', () => {
      const { result } = renderHook(() => useCache<string>());

      result.current.set('key1', 'value1');
      result.current.set('key2', 'value2');
      result.current.set('key3', 'value3');

      result.current.clear();

      expect(result.current.size()).toBe(0);
    });

    it('returns cache size', () => {
      const { result } = renderHook(() => useCache<string>());

      expect(result.current.size()).toBe(0);

      result.current.set('key1', 'value1');
      expect(result.current.size()).toBe(1);

      result.current.set('key2', 'value2');
      expect(result.current.size()).toBe(2);
    });

    it('returns all keys', () => {
      const { result } = renderHook(() => useCache<string>());

      result.current.set('key1', 'value1');
      result.current.set('key2', 'value2');

      const keys = result.current.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('TTL (Time To Live)', () => {
    it('expires entries after TTL', () => {
      const timeMock = mockDateNow();
      const { result } = renderHook(() => useCache<string>({ ttl: 1000 }));

      result.current.set('key1', 'value1');
      
      // Immediately available
      expect(result.current.get('key1')).toBe('value1');

      // After 999ms still available
      timeMock.advance(999);
      expect(result.current.get('key1')).toBe('value1');

      // After 1001ms expired
      timeMock.advance(2);
      expect(result.current.get('key1')).toBeNull();

      timeMock.reset();
    });

    it('supports custom TTL per entry', () => {
      const timeMock = mockDateNow();
      const { result } = renderHook(() => useCache<string>({ ttl: 5000 }));

      result.current.set('key1', 'value1', 1000); // 1 second TTL
      result.current.set('key2', 'value2'); // Uses default 5 second TTL

      timeMock.advance(1500);

      expect(result.current.get('key1')).toBeNull(); // Expired
      expect(result.current.get('key2')).toBe('value2'); // Still valid

      timeMock.reset();
    });
  });

  describe('LRU Eviction', () => {
    it('evicts least recently used items when cache is full', () => {
      const { result } = renderHook(() => useCache<string>({ maxSize: 3 }));

      result.current.set('key1', 'value1');
      result.current.set('key2', 'value2');
      result.current.set('key3', 'value3');

      // Cache is now full
      expect(result.current.size()).toBe(3);

      // Adding a 4th item should evict key1 (least recently used)
      result.current.set('key4', 'value4');

      expect(result.current.size()).toBe(3);
      expect(result.current.has('key1')).toBe(false); // Evicted
      expect(result.current.has('key2')).toBe(true);
      expect(result.current.has('key3')).toBe(true);
      expect(result.current.has('key4')).toBe(true);
    });

    it('updates access order on get', () => {
      const { result } = renderHook(() => useCache<string>({ maxSize: 3 }));

      result.current.set('key1', 'value1');
      result.current.set('key2', 'value2');
      result.current.set('key3', 'value3');

      // Access key1, making it most recently used
      result.current.get('key1');

      // Add key4, should evict key2 (now LRU)
      result.current.set('key4', 'value4');

      expect(result.current.has('key1')).toBe(true); // Not evicted (recently accessed)
      expect(result.current.has('key2')).toBe(false); // Evicted
      expect(result.current.has('key3')).toBe(true);
      expect(result.current.has('key4')).toBe(true);
    });
  });

  describe('localStorage Persistence', () => {
    it('persists cache to localStorage', () => {
      const { result } = renderHook(() => 
        useCache<string>({ 
          persistToLocalStorage: true,
          storageKey: 'test-cache'
        })
      );

      result.current.set('key1', 'value1');

      const stored = localStorage.getItem('test-cache');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.key1.data).toBe('value1');
      }
    });

    it('loads cache from localStorage on mount', () => {
      // Pre-populate localStorage
      const cacheData = {
        key1: {
          data: 'value1',
          timestamp: Date.now(),
          expiresAt: Date.now() + 60000, // 1 minute from now
        },
      };
      localStorage.setItem('test-cache', JSON.stringify(cacheData));

      const { result } = renderHook(() => 
        useCache<string>({ 
          persistToLocalStorage: true,
          storageKey: 'test-cache'
        })
      );

      expect(result.current.get('key1')).toBe('value1');
    });

    it('filters out expired entries when loading from localStorage', () => {
      const cacheData = {
        expired: {
          data: 'old-value',
          timestamp: Date.now() - 10000,
          expiresAt: Date.now() - 5000, // Expired 5 seconds ago
        },
        valid: {
          data: 'new-value',
          timestamp: Date.now(),
          expiresAt: Date.now() + 60000, // Expires in 1 minute
        },
      };
      localStorage.setItem('test-cache', JSON.stringify(cacheData));

      const { result } = renderHook(() => 
        useCache<string>({ 
          persistToLocalStorage: true,
          storageKey: 'test-cache'
        })
      );

      expect(result.current.get('expired')).toBeNull();
      expect(result.current.get('valid')).toBe('new-value');
    });
  });

  describe('Complex Data Types', () => {
    it('caches objects', () => {
      const { result } = renderHook(() => useCache<{ name: string; age: number }>());

      const data = { name: 'John', age: 30 };
      result.current.set('user', data);

      const cached = result.current.get('user');
      expect(cached).toEqual(data);
    });

    it('caches arrays', () => {
      const { result } = renderHook(() => useCache<string[]>());

      const data = ['apple', 'banana', 'cherry'];
      result.current.set('fruits', data);

      const cached = result.current.get('fruits');
      expect(cached).toEqual(data);
    });
  });
});

describe('useCachedFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data on mount', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ id: 1, name: 'Test' });

    const { result } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: true })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    });

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('returns cached data without refetching', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ id: 1, name: 'Test' });

    // First render - fetches data
    const { result: result1, unmount } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: true })
    );

    await waitFor(() => {
      expect(result1.current.data).toEqual({ id: 1, name: 'Test' });
    });

    unmount();

    // Second render - should use cache
    const { result: result2 } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: true })
    );

    // Data should be available immediately from cache
    expect(result2.current.data).toEqual({ id: 1, name: 'Test' });
    
    // fetchFn should only be called once (from first render)
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: true })
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Fetch failed');
    });
  });

  it('supports manual refetch', async () => {
    const fetchFn = vi.fn()
      .mockResolvedValueOnce({ id: 1, name: 'First' })
      .mockResolvedValueOnce({ id: 1, name: 'Second' });

    const { result } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: true })
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1, name: 'First' });
    });

    // Refetch
    await result.current.refetch();

    expect(result.current.data).toEqual({ id: 1, name: 'Second' });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('skips fetching when enabled is false', async () => {
    const fetchFn = vi.fn();

    const { result } = renderHook(() => 
      useCachedFetch('test-key', fetchFn, { enabled: false })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 100 });

    expect(fetchFn).not.toHaveBeenCalled();
  });
});
