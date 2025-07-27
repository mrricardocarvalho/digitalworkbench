import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    triggerOnce = false
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = (node: Element | null) => {
    if (elementRef.current) {
      observerRef.current?.unobserve(elementRef.current);
    }

    elementRef.current = node;

    if (node) {
      observerRef.current?.observe(node);
    }
  };

  useEffect(() => {
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsIntersecting(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        
        const isElementIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isElementIntersecting);
        setEntry(entry);

        if (triggerOnce && isElementIntersecting && observerRef.current && elementRef.current) {
          observerRef.current.unobserve(elementRef.current);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  return {
    ref,
    isIntersecting,
    entry
  };
};

export default useIntersectionObserver;
