'use client';

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';

interface HeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function Header({ dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLng = (params.lng as string) || 'sv';

  const [activeHash, setActiveHash] = useState('');

  // IntersectionObserver для скролла к секциям
  useEffect(() => {
    setTimeout(() => setActiveHash(window.location.hash), 0);

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          setActiveHash(`#${id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [pathname]);

  const languages = [
    { code: 'sv', label: 'Svenska' },
    { code: 'en', label: 'English' },
    { code: 'no', label: 'Norsk' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-drawer-open');
    } else {
      document.body.classList.remove('mobile-drawer-open');
    }
    return () => {
      document.body.classList.remove('mobile-drawer-open');
    };
  }, [mobileMenuOpen]);

  const changeLanguage = (newLng: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLng;
    const newPath = segments.join('/');
    startTransition(() => {
      router.push(newPath);
    });
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: `/${currentLng}`, label: dict.nav.about },
    { href: `/${currentLng}#services`, label: dict.nav.services },
    { href: `/${currentLng}/gallery`, label: dict.nav.gallery },
    { href: `/${currentLng}/contacts`, label: dict.nav.contacts },
  ];

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLng}`, '') || '/';
    const linkPath = href.replace(`/${currentLng}`, '');

    if (linkPath.includes('#')) {
      const [path, hash] = linkPath.split('#');
      const isPathMatch = pathWithoutLocale === '/' || pathWithoutLocale === path;
      return isPathMatch && activeHash === `#${hash}`;
    }

    if (linkPath === '/') {
      return pathWithoutLocale === '/' && !activeHash;
    }

    return pathWithoutLocale === linkPath;
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link href={`/${currentLng}`} className="logo" onClick={closeMenu} aria-label="RyggHjälp — Home">
          RYGG<span className="gold-accent">HJÄLP</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">

          <div className="custom-lang-selector" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`lang-trigger-btn ${langDropdownOpen ? 'active' : ''}`}
              aria-expanded={langDropdownOpen}
              aria-label={`Select language. Current: ${languages.find((l) => l.code === currentLng)?.label || currentLng}`}
            >
              <span>{currentLng.toUpperCase()}</span>
              {isPending && <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
              <svg
                className="lang-arrow"
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu" role="listbox" aria-label="Language selection">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`lang-dropdown-item ${currentLng === lang.code ? 'active' : ''}`}
                    role="option"
                    aria-selected={currentLng === lang.code}
                  >
                    <span>{lang.label}</span>
                    {currentLng === lang.code && <span className="lang-active-dot" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${currentLng}/contacts?book=true`}
            className="btn btn-primary header-book-btn"
            aria-label={dict.nav.book}
          >
            {dict.nav.book}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`burger-btn ${mobileMenuOpen ? 'open' : ''}`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMenu} aria-hidden="true" />
      )}

      <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="mobile-nav-link" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${currentLng}/contacts?book=true`}
            className="btn btn-primary mobile-book-btn"
            onClick={closeMenu}
          >
            {dict.nav.book}
          </Link>

          <div className="mobile-lang-wrapper">
            <span className="mobile-lang-label">{dict.hero.languagesLabel || 'Language'}:</span>
            <div className="mobile-lang-control">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`mobile-lang-btn ${currentLng === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(lang.code);
                    closeMenu();
                  }}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
