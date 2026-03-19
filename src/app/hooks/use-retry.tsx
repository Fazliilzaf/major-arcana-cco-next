import { useState, useCallback } from "react";
import { toast } from "sonner";

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  onError?: (error: Error, attempt: number) => void;
  onSuccess?: () => void;
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    onError,
    onSuccess,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    let lastError: Error | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      setAttempt(i + 1);
      
      try {
        const result = await asyncFunction();
        setIsLoading(false);
        setAttempt(0);
        onSuccess?.();
        return result;
      } catch (err) {
        lastError = err as Error;
        onError?.(lastError, i + 1);

        if (i < maxAttempts - 1) {
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    // All attempts failed
    setError(lastError);
    setIsLoading(false);
    setAttempt(0);
    
    toast.error(`Misslyckades efter ${maxAttempts} försök`);
    return null;
  }, [asyncFunction, maxAttempts, delay, onError, onSuccess]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAttempt(0);
  }, []);

  return {
    execute,
    isLoading,
    error,
    attempt,
    reset,
  };
}

// Example: Auto-retry hook with exponential backoff
export function useAutoRetry<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: RetryOptions = {}
) {
  const { execute, isLoading, error } = useRetry(asyncFunction, options);

  // Auto-execute when dependencies change
  useState(() => {
    execute();
  });

  return { isLoading, error, retry: execute };
}
