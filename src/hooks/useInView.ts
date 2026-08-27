import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
  /** Margin around the root, e.g. "0px 0px -10% 0px" to trigger a little early. */
  rootMargin?: string;
  /** Stop observing after the first time it becomes visible. */
  once?: boolean;
}

/**
 * Returns a ref to attach to an element and a boolean that becomes true when the
 * element scrolls into view. If IntersectionObserver is unavailable, the element
 * is treated as visible immediately so content is never hidden.
 */
export function useInView<T extends HTMLElement>(
  options: Options = {},
): [React.RefObject<T>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
