import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean; // Stop observing once element is visible
}

/**
 * Intersection Observer hook for lazy loading and visibility detection
 * 
 * @param options - Intersection observer options
 * @returns [ref, isVisible, entry] - Ref to attach to element, visibility state, and full entry
 * 
 * @example
 * function LazyImage({ src }: { src: string }) {
 *   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 *   
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? <img src={src} /> : <div>Loading...</div>}
 *     </div>
 *   );
 * }
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefCallback<Element>, boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frozenRef = useRef(false);

  // Callback ref to attach observer
  const setRef = (element: Element | null) => {
    elementRef.current = element;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Don't re-observe if frozen
    if (frozenRef.current) return;

    // Create observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        // Freeze if option enabled and element is visible
        if (freezeOnceVisible && visible) {
          frozenRef.current = true;
          observerRef.current?.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    // Start observing
    observerRef.current.observe(element);

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [setRef, isVisible, entry];
}

/**
 * Lazy loading component wrapper
 * Renders children only when visible in viewport
 * 
 * @example
 * <LazyLoad>
 *   <HeavyComponent />
 * </LazyLoad>
 */
export function LazyLoad({
  children,
  placeholder = null,
  threshold = 0.1,
  rootMargin = "50px", // Load slightly before entering viewport
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  );
}

/**
 * Lazy image component with blur placeholder
 * 
 * @example
 * <LazyImage 
 *   src="https://example.com/image.jpg" 
 *   alt="Description"
 *   className="w-full h-64 object-cover"
 * />
 */
export function LazyImage({
  src,
  alt,
  className = "",
  placeholder,
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    freezeOnceVisible: true,
  });
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Blur placeholder */}
      {!loaded && placeholder && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-sm ${className}`}
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton */}
      {!loaded && !placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual image - only load when visible */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
