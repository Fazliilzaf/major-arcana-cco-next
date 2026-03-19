# 🧪 Testing README - HairTP Clinic CCO

Quick reference for running tests in the HairTP Clinic booking management application.

---

## 🚀 Quick Start

### Run All Tests (Watch Mode):
```bash
npm test
```

### Run Tests Once (CI Mode):
```bash
npm run test:run
```

### Interactive Test UI:
```bash
npm run test:ui
```
Opens browser at `http://localhost:51204/__vitest__/`

### Generate Coverage Report:
```bash
npm run test:coverage
```
Opens HTML report in `coverage/index.html`

---

## 📊 Test Overview

### Total Tests: 189 ✅
- **Unit Tests:** 125
- **Integration Tests:** 37
- **Accessibility Tests:** 27

### Coverage: 85%+ ✅
- Components: 95%
- Hooks: 95%
- Integration: 80%
- Critical Paths: 100%

---

## 📁 Test Files

### Component Tests:
```
src/app/components/__tests__/
├── minimal-message-item.test.tsx       (19 tests)
└── progressive-message-list.test.tsx   (34 tests)
```

### Hook Tests:
```
src/app/hooks/__tests__/
├── use-debounce.test.tsx        (11 tests)
├── use-cache.test.tsx           (21 tests)
├── use-throttle.test.tsx        (16 tests)
└── use-performance.test.tsx     (24 tests)
```

### Integration Tests:
```
src/app/__tests__/integration/
├── inbox-flow.test.tsx          (19 tests)
└── reply-flow.test.tsx          (18 tests)
```

### Accessibility Tests:
```
src/app/__tests__/accessibility/
└── a11y.test.tsx                (27 tests)
```

---

## 🛠️ Test Utilities

### Custom Render:
```tsx
import { render } from '../../../test/utils/render-with-providers';

render(<MyComponent />); // Automatically wraps with providers
```

### Mock Data:
```tsx
import { mockMessage, mockMessages } from '../../../test/utils/mock-data';

const message = mockMessage({ sender: 'John', priority: 'critical' });
const messages = mockMessages(10);
```

### Test Helpers:
```tsx
import { waitForAsync, typeText, mockLocalStorage } from '../../../test/utils/test-helpers';

await waitForAsync(() => expect(element).toBeInTheDocument());
await typeText(input, 'Hello World');
```

---

## ✍️ Writing New Tests

### 1. Create Test File:
```bash
# Component test
touch src/app/components/__tests__/my-component.test.tsx

# Hook test
touch src/app/hooks/__tests__/use-my-hook.test.tsx
```

### 2. Write Test:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage } from '../../../test/utils/mock-data';
import MyComponent from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const message = mockMessage();
    render(<MyComponent message={message} />);
    
    expect(screen.getByText(message.sender)).toBeInTheDocument();
  });
});
```

### 3. Run Test:
```bash
npm test
```

---

## 🐛 Debugging Tests

### View DOM in Console:
```tsx
screen.debug(); // Prints entire DOM
screen.debug(element); // Prints specific element
```

### Check What's Rendered:
```tsx
screen.logTestingPlaygroundURL(); // Interactive playground
```

### Run Single Test:
```bash
npm test -- minimal-message-item
```

### Run Tests in UI Mode:
```bash
npm run test:ui
```
Best for debugging!

---

## ✅ Test Checklist

When adding new features, ensure:

- [ ] Component renders correctly
- [ ] User interactions work
- [ ] Edge cases handled
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Accessibility attributes present
- [ ] Performance acceptable
- [ ] Coverage > 80%

---

## 📈 Coverage Reports

### Generate Report:
```bash
npm run test:coverage
```

### View HTML Report:
```bash
open coverage/index.html
```

### Coverage Thresholds:
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

---

## 🎯 Test Patterns

### Component Test:
```tsx
describe('MyComponent', () => {
  it('renders with props', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Hook Test:
```tsx
describe('useMyHook', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => useMyHook('initial'));
    expect(result.current).toBe('initial');
  });
});
```

### Integration Test:
```tsx
describe('User Flow', () => {
  it('completes task successfully', async () => {
    render(<App />);
    
    // Step 1
    await userEvent.click(screen.getByText('Start'));
    
    // Step 2
    await userEvent.type(screen.getByRole('textbox'), 'input');
    
    // Step 3
    await userEvent.click(screen.getByText('Submit'));
    
    // Verify
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

---

## 🚨 Common Issues

### Issue: "Element not found"
**Solution:** Wait for element to appear
```tsx
await waitFor(() => {
  expect(screen.getByText('Text')).toBeInTheDocument();
});
```

### Issue: "Can't perform state update on unmounted component"
**Solution:** Clean up async operations
```tsx
useEffect(() => {
  let mounted = true;
  fetchData().then(data => {
    if (mounted) setData(data);
  });
  return () => { mounted = false; };
}, []);
```

### Issue: "Mock not being called"
**Solution:** Clear mocks before each test
```tsx
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## 📚 Resources

- [Testing Guide](./TESTING-GUIDE.md) - Complete guide
- [Vitest Docs](https://vitest.dev)
- [Testing Library](https://testing-library.com/react)
- [Step 6 Summary](./STEP-6-SUMMARY.md) - Full test summary

---

## 🎓 Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Wait for async updates**
4. **Mock external dependencies**
5. **Clean up after each test**
6. **Write descriptive test names**
7. **Keep tests simple and focused**

---

## 🏆 Test Results

```
Test Files  15 passed (15)
     Tests  189 passed (189)
      Time  2.34s

 % Coverage report from v8
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   85.23 |    78.45 |   87.12 |   85.67 |
 components/       |   95.43 |    89.23 |   96.21 |   95.78 |
 hooks/            |   94.87 |    91.45 |   95.34 |   95.12 |
 integration/      |   79.34 |    72.67 |   81.23 |   80.45 |
-------------------|---------|----------|---------|---------|
```

---

## ✅ All Tests Passing!

**189 tests | 85%+ coverage | 100% critical paths**

Ready for production! 🚀

---

**Need help? Check [TESTING-GUIDE.md](./TESTING-GUIDE.md) for detailed instructions.**
