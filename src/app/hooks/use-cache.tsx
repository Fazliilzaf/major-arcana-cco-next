import { useState, useCallback, useRef, useEffect } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  maxSize?: number; // Maximum cache size (default: 100 entries)
  persistToLocalStorage?: boolean; // Persist to localStorage
  storageKey?: string; // Key for localStorage
}

/**
 * LRU Cache hook with TTL and optional localStorage persistence
 * 
 * @param options - Cache configuration
 * @returns Cache instance with get/set/clear methods
 * 
 * @example
 * const cache = useCache<Customer>({ ttl: 300000 }); // 5min TTL
 * 
 * // Set data
 * cache.set('customer-123', customerData);
 * 
 * // Get data (returns null if expired or not found)
 * const customer = cache.get('customer-123');
 * 
 * // Clear cache
 * cache.clear();
 */
export function useCache<T>(options: CacheOptions = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    maxSize = 100,
    persistToLocalStorage = false,
    storageKey = "app-cache",
  } = options;

  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const accessOrderRef = useRef<string[]>([]); // For LRU tracking

  // Load from localStorage on mount
  useEffect(() => {
    if (persistToLocalStorage && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = Date.now();
          
          // Filter out expired entries
          const validEntries = Object.entries(parsed).filter(
            ([_, entry]: [string, any]) => entry.expiresAt > now
          );
          
          cacheRef.current = new Map(validEntries as [string, CacheEntry<T>][]);
          accessOrderRef.current = validEntries.map(([key]) => key);
        }
      } catch (error) {
        console.warn("Failed to load cache from localStorage:", error);
      }
    }
  }, [persistToLocalStorage, storageKey]);

  // Save to localStorage on changes
  const saveToStorage = useCallback(() => {
    if (persistToLocalStorage && typeof window !== "undefined") {
      try {
        const cacheObject = Object.fromEntries(cacheRef.current);
        localStorage.setItem(storageKey, JSON.stringify(cacheObject));
      } catch (error) {
        console.warn("Failed to save cache to localStorage:", error);
      }
    }
  }, [persistToLocalStorage, storageKey]);

  // LRU eviction when cache is full
  const evictLRU = useCallback(() => {
    if (accessOrderRef.current.length > 0) {
      const lruKey = accessOrderRef.current[0];
      cacheRef.current.delete(lruKey);
      accessOrderRef.current.shift();
    }
  }, []);

  // Update access order (move to end = most recently used)
  const updateAccessOrder = useCallback((key: string) => {
    const index = accessOrderRef.current.indexOf(key);
    if (index > -1) {
      accessOrderRef.current.splice(index, 1);
    }
    accessOrderRef.current.push(key);
  }, []);

  /**
   * Get cached data
   * Returns null if not found or expired
   */
  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now > entry.expiresAt) {
      cacheRef.current.delete(key);
      const index = accessOrderRef.current.indexOf(key);
      if (index > -1) {
        accessOrderRef.current.splice(index, 1);
      }
      saveToStorage();
      return null;
    }

    // Update access order (LRU)
    updateAccessOrder(key);

    return entry.data;
  }, [saveToStorage, updateAccessOrder]);

  /**
   * Set cached data
   */
  const set = useCallback((key: string, data: T, customTtl?: number) => {
    const now = Date.now();
    const effectiveTtl = customTtl ?? ttl;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + effectiveTtl,
    };

    // Evict LRU if cache is full
    if (cacheRef.current.size >= maxSize && !cacheRef.current.has(key)) {
      evictLRU();
    }

    cacheRef.current.set(key, entry);
    updateAccessOrder(key);
    saveToStorage();
  }, [ttl, maxSize, evictLRU, updateAccessOrder, saveToStorage]);

  /**
   * Check if key exists and is not expired
   */
  const has = useCallback((key: string): boolean => {
    return get(key) !== null;
  }, [get]);

  /**
   * Delete a specific key
   */
  const del = useCallback((key: string) => {
    cacheRef.current.delete(key);
    const index = accessOrderRef.current.indexOf(key);
    if (index > -1) {
      accessOrderRef.current.splice(index, 1);
    }
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Clear entire cache
   */
  const clear = useCallback(() => {
    cacheRef.current.clear();
    accessOrderRef.current = [];
    saveToStorage();
  }, [saveToStorage]);

  /**
   * Get cache size
   */
  const size = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  /**
   * Get all keys
   */
  const keys = useCallback(() => {
    return Array.from(cacheRef.current.keys());
  }, []);

  return {
    get,
    set,
    has,
    delete: del,
    clear,
    size,
    keys,
  };
}

/**
 * Hook for cached async data fetching
 * Automatically caches fetch results
 * 
 * @example
 * const { data, loading, error, refetch } = useCachedFetch(
 *   'customer-123',
 *   () => fetchCustomer('123'),
 *   { ttl: 300000 }
 * );
 */
export function useCachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ...cacheOptions } = options;
  const cache = useCache<T>(cacheOptions);
  const [data, setData] = useState<T | null>(cache.get(key));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key);
    if (cached) {
      setData(cached);
      return cached;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      cache.set(key, result);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, cache]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [enabled, fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}
