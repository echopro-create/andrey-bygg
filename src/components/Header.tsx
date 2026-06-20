'use client';

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  dict: any;
}

export default function Header({ dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLng = (params.lng as string) || 'sv';

  const languages = [
    { code: 'sv', label: 'Svenska' },
    { code: 'en', label: 'English' },
    { code: 'no', label: 'Norsk' },
    { code: 'ru', label: 'Русский' },
  ];

  // Close dropdown on click outside
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

  const changeLanguage = (newLng: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLng;
    const newPath = segments.join('/');
    router.push(newPath);
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

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link href={`/${currentLng}`} className="logo" onClick={closeMenu}>
          OLEG <span className="gold-accent">MASSAGE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Custom Language Dropdown (2026 Standard) */}
          <div className="custom-lang-selector" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`lang-trigger-btn ${langDropdownOpen ? 'active' : ''}`}
              aria-expanded={langDropdownOpen}
              aria-label="Select language"
            >
              <span>{currentLng}</span>
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
              <div className="lang-dropdown-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`lang-dropdown-item ${currentLng === lang.code ? 'active' : ''}`}
                  >
                    <span>{lang.label}</span>
                    {currentLng === lang.code && <span className="lang-active-dot" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${currentLng}/contacts?book=true`} className="btn btn-primary header-book-btn">
            {dict.nav.book}
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`burger-btn ${mobileMenuOpen ? 'open' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
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
            <span className="mobile-lang-label">Language:</span>
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
