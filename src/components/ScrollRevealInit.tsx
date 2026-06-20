'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Небольшая задержка, чтобы дать React завершить рендеринг DOM
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              // Прекращаем наблюдение после активации (эффект однократного появления)
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealElements.forEach((el) => observer.observe(el));

      return () => {
        revealElements.forEach((el) => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
