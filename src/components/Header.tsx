'use client';

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  dict: any;
}

export default function Header({ dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLng = e.target.value;
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
          <ThemeToggle />

          {/* Language Selector */}
          <div className="lang-selector-wrapper">
            <select
              value={currentLng}
              onChange={handleLanguageChange}
              className="lang-select"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.code.toUpperCase()}
                </option>
              ))}
            </select>
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
            <select
              value={currentLng}
              onChange={(e) => {
                handleLanguageChange(e);
                closeMenu();
              }}
              className="mobile-lang-select"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
