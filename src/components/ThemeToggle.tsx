'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'obsidian' | 'zen'>('obsidian');

  useEffect(() => {
    const savedTheme = localStorage.getItem('oleg-theme') as 'obsidian' | 'zen';
    if (savedTheme && (savedTheme === 'obsidian' || savedTheme === 'zen')) {
      setTheme(savedTheme);
      document.documentElement.className = `theme-${savedTheme}`;
      updateThemeColorMeta(savedTheme);
    }
  }, []);

  const updateThemeColorMeta = (currentTheme: 'obsidian' | 'zen') => {
    const color = currentTheme === 'obsidian' ? '#080908' : '#060907';
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'obsidian' ? 'zen' : 'obsidian';
    setTheme(nextTheme);
    document.documentElement.className = `theme-${nextTheme}`;
    localStorage.setItem('oleg-theme', nextTheme);
    updateThemeColorMeta(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Toggle Spa Theme"
      title="Toggle Spa Theme"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {theme === 'obsidian' ? (
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        ) : (
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        )}
      </svg>
      <span className="theme-toggle-label">
        {theme === 'obsidian' ? 'Obsidian' : 'Emerald'}
      </span>
    </button>
  );
}
