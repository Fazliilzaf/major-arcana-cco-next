import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Test utilities and helpers
 */

/**
 * Wait for async updates with custom timeout
 */
export async function waitForAsync(callback: () => void, timeout = 3000) {
  await waitFor(callback, { timeout });
}

/**
 * Simulate user typing with realistic delay
 */
export async function typeText(element: Element, text: string) {
  const user = userEvent.setup();
  await user.type(element, text);
}

/**
 * Simulate user clicking with realistic delay
 */
export async function clickElement(element: Element) {
  const user = userEvent.setup();
  await user.click(element);
}

/**
 * Wait for element to appear
 */
export async function waitForElement(
  getElement: () => Element | null,
  timeout = 3000
): Promise<Element> {
  let element: Element | null = null;
  
  await waitFor(() => {
    element = getElement();
    expect(element).toBeInTheDocument();
  }, { timeout });
  
  return element!;
}

/**
 * Wait for element to disappear
 */
export async function waitForElementToBeRemoved(
  getElement: () => Element | null,
  timeout = 3000
) {
  await waitFor(() => {
    const element = getElement();
    expect(element).not.toBeInTheDocument();
  }, { timeout });
}

/**
 * Simulate debounce delay
 */
export async function waitForDebounce(ms = 300) {
  await new Promise(resolve => setTimeout(resolve, ms + 50)); // Add buffer
}

/**
 * Mock performance.now() for testing
 */
export function mockPerformanceNow() {
  let currentTime = 0;
  
  vi.spyOn(performance, 'now').mockImplementation(() => {
    return currentTime;
  });
  
  return {
    advance: (ms: number) => {
      currentTime += ms;
    },
    reset: () => {
      currentTime = 0;
    },
  };
}

/**
 * Mock Date.now() for testing
 */
export function mockDateNow(initialTime?: number) {
  const now = initialTime || Date.now();
  let currentTime = now;
  
  vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
  
  return {
    advance: (ms: number) => {
      currentTime += ms;
    },
    set: (time: number) => {
      currentTime = time;
    },
    reset: () => {
      currentTime = now;
    },
  };
}

/**
 * Create a promise that resolves after a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Suppress console errors/warnings during test
 */
export function suppressConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeEach(() => {
    console.error = vi.fn();
    console.warn = vi.fn();
  });
  
  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}

/**
 * Create a spy on console methods
 */
export function spyOnConsole() {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  
  return {
    error: errorSpy,
    warn: warnSpy,
    log: logSpy,
    restore: () => {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
      logSpy.mockRestore();
    },
  };
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  
  return localStorageMock;
}

/**
 * Assert accessibility (basic check)
 */
export function expectAccessible(container: HTMLElement) {
  // Check for basic a11y attributes
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    expect(button).toHaveAttribute('type');
  });
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img).toHaveAttribute('alt');
  });
}

/**
 * Get by test ID
 */
export function getByTestId(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`);
}

/**
 * Simulate window resize
 */
export function resizeWindow(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
}

/**
 * Create mock fetch response
 */
export function mockFetchResponse<T>(data: T, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response);
}

/**
 * Mock fetch API
 */
export function mockFetch() {
  const fetchMock = vi.fn();
  global.fetch = fetchMock;
  return fetchMock;
}
