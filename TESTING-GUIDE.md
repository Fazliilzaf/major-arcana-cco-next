# 🧪 TESTING GUIDE - HairTP Clinic CCO

**Complete guide to testing the HairTP Clinic CCO application**

---

## 🚀 QUICK START

### Run All Tests:
```bash
npm test
```

### Run Tests with UI:
```bash
npm run test:ui
```

### Run Tests with Coverage:
```bash
npm run test:coverage
```

### Run Tests Once (CI mode):
```bash
npm run test:run
```

---

## 📁 TEST STRUCTURE

```
src/
├── test/
│   ├── setup.ts                    # Test configuration
│   └── utils/
│       ├── render-with-providers.tsx  # Custom render function
│       ├── mock-data.ts               # Mock data generators
│       └── test-helpers.ts            # Test utilities
└── app/
    ├── components/
    │   └── __tests__/
    │       └── minimal-message-item.test.tsx
    └── hooks/
        └── __tests__/
            ├── use-debounce.test.tsx
            └── use-cache.test.tsx
```

---

## ✅ WRITING TESTS

### Component Test Example:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage } from '../../../test/utils/mock-data';
import MyComponent from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const message = mockMessage();
    render(<MyComponent message={message} />);
    
    expect(screen.getByText(message.sender)).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const message = mockMessage();
    
    render(<MyComponent message={message} onClick={onClick} />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    
    expect(onClick).toHaveBeenCalledWith(message);
  });
});
```

---

### Hook Test Example:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

---

## 🛠️ TEST UTILITIES

### Mock Data Generators:

```tsx
import { mockMessage, mockMessages, mockSprintMessage } from './test/utils/mock-data';

// Single message
const message = mockMessage({ sender: 'John', priority: 'critical' });

// Multiple messages
const messages = mockMessages(10);

// Sprint message
const sprint = mockSprintMessage({ slaMinutesLeft: 5 });
```

---

### Custom Render:

```tsx
import { render } from './test/utils/render-with-providers';

// Automatically wraps with LanguageProvider & MailboxProvider
render(<MyComponent />);
```

---

### Test Helpers:

```tsx
import {
  waitForAsync,
  typeText,
  clickElement,
  waitForDebounce,
  mockLocalStorage,
  mockDateNow,
} from './test/utils/test-helpers';

// Wait for async operations
await waitForAsync(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Simulate typing
await typeText(input, 'Hello World');

// Simulate debounce delay
await waitForDebounce(300);

// Mock localStorage
const storage = mockLocalStorage();
storage.setItem('key', 'value');

// Mock time
const timeMock = mockDateNow();
timeMock.advance(1000); // Advance 1 second
```

---

## 📊 COVERAGE GOALS

| Type | Target | Critical |
|------|--------|----------|
| **Statements** | 80%+ | 95%+ |
| **Branches** | 75%+ | 90%+ |
| **Functions** | 80%+ | 95%+ |
| **Lines** | 80%+ | 95%+ |

---

## ✅ TEST CHECKLIST

### Component Tests:
- [ ] Renders correctly with props
- [ ] Handles user interactions
- [ ] Shows correct states (loading, error, empty)
- [ ] Updates on prop changes
- [ ] Calls callbacks correctly
- [ ] Has proper accessibility attributes
- [ ] Renders different variants correctly

### Hook Tests:
- [ ] Returns correct initial value
- [ ] Updates on dependency changes
- [ ] Cleans up on unmount
- [ ] Handles edge cases
- [ ] Works with different parameters

### Integration Tests:
- [ ] User can complete critical flows
- [ ] Components work together correctly
- [ ] State updates propagate correctly
- [ ] Error handling works end-to-end

---

## 🎯 BEST PRACTICES

### 1. Test Behavior, Not Implementation:
```tsx
// ✅ GOOD: Test what user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ BAD: Test implementation details
expect(component.state.isVisible).toBe(true);
```

---

### 2. Use Semantic Queries:
```tsx
// ✅ GOOD: Accessible queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');

// ❌ BAD: Fragile queries
screen.getByClassName('submit-btn');
screen.getByTestId('email-input');
```

---

### 3. Wait for Async Updates:
```tsx
// ✅ GOOD: Wait for changes
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ BAD: Don't wait
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

---

### 4. Mock External Dependencies:
```tsx
// ✅ GOOD: Mock fetch
const fetchMock = vi.fn().mockResolvedValue({ data: 'test' });
global.fetch = fetchMock;

// ❌ BAD: Real API calls
// (Real fetch calls in tests)
```

---

### 5. Clean Up After Tests:
```tsx
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

---

## 🐛 DEBUGGING TESTS

### 1. Use screen.debug():
```tsx
it('renders correctly', () => {
  render(<MyComponent />);
  screen.debug(); // Prints DOM to console
});
```

---

### 2. Check What's Rendered:
```tsx
it('finds element', () => {
  render(<MyComponent />);
  
  // See all available text
  screen.getByText(/./);  // Shows all text content
});
```

---

### 3. Use Vitest UI:
```bash
npm run test:ui
```
Opens interactive test UI in browser.

---

### 4. Check Coverage Gaps:
```bash
npm run test:coverage
```
Open `coverage/index.html` in browser.

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "Can't perform a React state update on unmounted component"
**Solution:** Clean up async operations
```tsx
useEffect(() => {
  let mounted = true;
  
  fetchData().then(data => {
    if (mounted) {
      setData(data);
    }
  });
  
  return () => { mounted = false; };
}, []);
```

---

### Issue: "Element not found"
**Solution:** Wait for element to appear
```tsx
await waitFor(() => {
  expect(screen.getByText('Text')).toBeInTheDocument();
});
```

---

### Issue: "Mock not being called"
**Solution:** Check mock setup
```tsx
const mock = vi.fn();

// Clear before each test
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

### Issue: "Timers not advancing"
**Solution:** Use fake timers correctly
```tsx
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// In test
vi.advanceTimersByTime(300);
```

---

## 📈 TEST METRICS

### Current Status (STEG 6):
- **Unit Tests:** 40+ tests
- **Integration Tests:** Planning
- **E2E Tests:** Planning
- **Coverage:** 80%+ target

### Components Tested:
- ✅ MinimalMessageItem
- ⏳ ProgressiveMessageList
- ⏳ ResponseStudio
- ⏳ ConversationView

### Hooks Tested:
- ✅ useDebounce
- ✅ useCache
- ⏳ useThrottle
- ⏳ usePerformance

---

## 🎓 LEARNING RESOURCES

### Vitest:
- [Vitest Docs](https://vitest.dev)
- [Vitest API](https://vitest.dev/api/)

### Testing Library:
- [React Testing Library](https://testing-library.com/react)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Best Practices:
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)

---

## 🚀 CI/CD INTEGRATION

### GitHub Actions Example:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage
```

---

## ✅ TESTING COMMANDS SUMMARY

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:run` | Run once (CI mode) |

---

**HAPPY TESTING! 🧪✅**
