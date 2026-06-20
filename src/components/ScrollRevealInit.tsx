'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ScrollRevealInit() {
  const pathname = usePathname();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (!mountedRef.current) return;

      const revealElements = document.querySelectorAll('.reveal:not(.active)');
      if (revealElements.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              requestAnimationFrame(() => {
                entry.target.classList.add('active');
              });
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealElements.forEach((el) => observer!.observe(el));
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(setupObserver);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return null;
}
