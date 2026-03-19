# ⚡ PERFORMANCE OPTIMIZATION CHECKLIST

**Quick reference guide for implementing performance optimizations**

---

## 🎯 WHEN TO USE EACH OPTIMIZATION

### React.memo
**Use when:**
- ✅ Component renders frequently
- ✅ Props rarely change
- ✅ Component is in a list
- ✅ Expensive render logic

**Example:**
```tsx
export const MessageItem = memo(function MessageItem({ message }) {
  return <div>{message.text}</div>;
});
```

---

### useMemo
**Use when:**
- ✅ Expensive computations (filtering, sorting, mapping)
- ✅ Object/array creation that's passed as props
- ✅ Computed values used multiple times

**Example:**
```tsx
const filteredMessages = useMemo(
  () => messages.filter(m => m.unread),
  [messages]
);
```

**DON'T use for:**
- ❌ Simple calculations (a + b)
- ❌ Already fast operations
- ❌ Values only used once

---

### useCallback
**Use when:**
- ✅ Passing callbacks to memoized children
- ✅ Callbacks in dependency arrays
- ✅ Event handlers in lists

**Example:**
```tsx
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

**DON'T use for:**
- ❌ Callbacks not passed to children
- ❌ Simple inline handlers
- ❌ Callbacks that change frequently

---

### Debouncing
**Use for:**
- ✅ Search input (300ms)
- ✅ Form validation (200ms)
- ✅ Auto-save (1000ms)
- ✅ API calls triggered by input

**Example:**
```tsx
const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

---

### Throttling
**Use for:**
- ✅ Scroll handlers (16ms = 60fps)
- ✅ Resize handlers (100ms)
- ✅ Mouse move tracking (50ms)
- ✅ Window events

**Example:**
```tsx
const handleScroll = useThrottle(() => {
  updateScrollPosition();
}, 16);
```

---

### Lazy Loading
**Use for:**
- ✅ Modals (rarely used)
- ✅ Route components (code splitting)
- ✅ Heavy libraries (charts, editors)
- ✅ Below-the-fold content

**Example:**
```tsx
const SettingsModal = lazy(() => import('./SettingsModal'));

<Suspense fallback={<LoadingSpinner />}>
  {showSettings && <SettingsModal />}
</Suspense>
```

---

### Virtualization
**Use when:**
- ✅ Lists with 50+ items
- ✅ Infinite scroll
- ✅ Tables with many rows
- ✅ Any scrollable content >100 items

**Example:**
```tsx
<VirtualizedMessageList
  messages={messages}
  height={600}
  estimateSize={72}
/>
```

**Impact:**
- 1000 DOM nodes → 20 nodes
- 60 FPS smooth scrolling
- 85% less memory

---

### Caching
**Use for:**
- ✅ API responses (5min TTL)
- ✅ Computed values (1min TTL)
- ✅ User preferences (persistent)
- ✅ Static data (24hr TTL)

**Example:**
```tsx
const cache = useCache({ ttl: 300000 }); // 5min

const data = cache.get('key') || await fetchData();
cache.set('key', data);
```

---

### Image Lazy Loading
**Use for:**
- ✅ Images below the fold
- ✅ Avatar lists
- ✅ Gallery images
- ✅ Background images

**Example:**
```tsx
<LazyImage 
  src={imageUrl}
  alt="Description"
  placeholder={blurDataUrl}
/>
```

---

## 🚨 PERFORMANCE RED FLAGS

Watch out for these common issues:

### 1. Expensive Renders
```tsx
// ❌ BAD: Recreates array every render
function Component() {
  const items = messages.filter(m => m.unread); // Runs every render!
  return <List items={items} />;
}

// ✅ GOOD: Memoized
function Component() {
  const items = useMemo(
    () => messages.filter(m => m.unread),
    [messages]
  );
  return <List items={items} />;
}
```

---

### 2. Inline Object/Array Creation
```tsx
// ❌ BAD: New object every render
<Component style={{ color: 'red' }} />

// ✅ GOOD: Extract to constant
const style = { color: 'red' };
<Component style={style} />
```

---

### 3. Anonymous Functions in Props
```tsx
// ❌ BAD: New function every render
{items.map(item => (
  <Item key={item.id} onClick={() => handleClick(item.id)} />
))}

// ✅ GOOD: Stable callback
const handleClick = useCallback((id) => {
  // ...
}, []);

{items.map(item => (
  <Item key={item.id} onClick={handleClick} id={item.id} />
))}
```

---

### 4. Large Lists Without Virtualization
```tsx
// ❌ BAD: Renders 1000+ DOM nodes
{messages.map(msg => <MessageItem key={msg.id} message={msg} />)}

// ✅ GOOD: Virtualized (renders ~20)
<VirtualizedMessageList messages={messages} />
```

---

### 5. Unbounded State Updates
```tsx
// ❌ BAD: Updates on every keystroke
<input onChange={(e) => fetchResults(e.target.value)} />

// ✅ GOOD: Debounced
const debouncedFetch = useDebouncedCallback(fetchResults, 300);
<input onChange={(e) => debouncedFetch(e.target.value)} />
```

---

## 📊 PERFORMANCE METRICS TO TRACK

### Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Custom Metrics:
- **Initial Bundle**: < 500KB
- **Time to Interactive**: < 3s
- **Scroll FPS**: 60
- **Search Response**: < 50ms

### Tools:
```bash
# Lighthouse
lighthouse https://your-app.com

# Bundle analyzer
npm run build -- --analyze

# Chrome DevTools Performance tab
# React DevTools Profiler
```

---

## ✅ OPTIMIZATION WORKFLOW

### 1. Measure First
```tsx
// Enable performance monitoring
usePerformance('ComponentName', { logToConsole: true });
```

### 2. Identify Bottleneck
- Chrome DevTools Performance
- React DevTools Profiler
- Console.time/timeEnd

### 3. Apply Fix
- React.memo for unnecessary re-renders
- useMemo for expensive computations
- useCallback for stable callbacks
- Virtualization for long lists

### 4. Measure Again
```tsx
// Compare before/after metrics
console.table(getPerformanceMetrics());
```

---

## 🎯 QUICK WINS (15 MINUTES)

1. **Add React.memo to list items** (5min)
   ```tsx
   export default memo(MessageItem);
   ```

2. **Debounce search input** (3min)
   ```tsx
   const debouncedQuery = useDebounce(query, 300);
   ```

3. **Lazy load modals** (5min)
   ```tsx
   const Modal = lazy(() => import('./Modal'));
   ```

4. **Memoize filtered lists** (2min)
   ```tsx
   const filtered = useMemo(() => items.filter(...), [items]);
   ```

**Expected gain:** 30-40% performance improvement

---

## 📚 REFERENCE

### Performance Hooks:
- `usePerformance()` - Track render time
- `useDebounce()` - Delay value updates
- `useThrottle()` - Limit callback frequency
- `useCache()` - Cache computed values
- `useMemo()` - Memoize expensive computations
- `useCallback()` - Memoize callbacks
- `useIntersectionObserver()` - Lazy load on scroll

### Components:
- `VirtualizedMessageList` - Virtual scrolling
- `LazyLoad` - Lazy load wrapper
- `LazyImage` - Lazy load images
- `memo()` - Prevent re-renders

### Utilities:
- `lazyLoad()` - Lazy load with fallback
- `highlightMatches()` - Search highlighting
- `getPerformanceMetrics()` - Get all metrics

---

## 🚀 PRODUCTION CHECKLIST

- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] All lists virtualized (>50 items)
- [ ] All modals lazy loaded
- [ ] All routes code-split
- [ ] Search inputs debounced
- [ ] Images lazy loaded
- [ ] Caching implemented
- [ ] Performance monitoring enabled
- [ ] Error boundaries in place

---

**QUICK TIP:** Start with lazy loading and React.memo - they give the biggest gains with minimal effort! ⚡
