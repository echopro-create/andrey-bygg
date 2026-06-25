import Link from 'next/link';
import type { Dict } from '@/lib/config';
import { serviceSlugs } from '@/lib/config';

interface FooterProps {
  dict: Dict;
  lng: string;
}

export default function Footer({ dict, lng }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Выводим все 6 услуг для максимального СЕО веса внутренних страниц
  const footerServices = serviceSlugs.map((slug) => ({
    slug,
    title: dict.services.items[slug].title,
  }));

  const regionText = dict.contacts.regions_desc as string || 'Laholm, Halmstad, Båstad, Ängelholm, Markaryd — Halland & Skåne, Sweden';
  const socialPhone = (dict.contacts.social_phone as string) || '';
  const messengerDigits = socialPhone.replace(/\D/g, '');

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* 1. Блок бренда */}
        <div className="footer-brand">
          <Link href={`/${lng}`} className="footer-logo">
              BYGG I<span className="gold-accent"> SYD</span>
          </Link>
          <p className="footer-desc">
            {dict.footer?.desc}
          </p>
          {socialPhone && (
            <div className="footer-socials">
              <a href={`https://wa.me/${messengerDigits}`} target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              <a href={`https://t.me/+${messengerDigits}`} target="_blank" rel="noopener noreferrer" className="social-link" title="Telegram" aria-label="Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* 2. Быстрые ссылки для навигации */}
        <nav className="footer-nav-col" aria-label="Quick links">
          <h3 className="footer-title">{dict.footer?.quickLinks || 'Menu'}</h3>
          <ul className="footer-list">
            <li>
              <Link href={`/${lng}`} className="footer-link">
                {lng === 'sv' ? 'Hem' : lng === 'ru' ? 'Главная' : lng === 'uk' ? 'Головна' : 'Home'}
              </Link>
            </li>
            <li>
              <Link href={`/${lng}/services`} className="footer-link">
                {dict.nav.services}
              </Link>
            </li>
            <li>
              <Link href={`/${lng}/gallery`} className="footer-link">
                {dict.nav.gallery}
              </Link>
            </li>
            <li>
              <Link href={`/${lng}/contacts`} className="footer-link">
                {dict.nav.contacts}
              </Link>
            </li>
          </ul>
        </nav>

        {/* 3. Список всех услуг (SEO перелинковка) */}
        <nav className="footer-links" aria-label="Services navigation">
          <h3 className="footer-title">{dict.nav.services}</h3>
          <ul className="footer-list">
            {footerServices.map((svc) => (
              <li key={svc.slug}>
                <Link href={`/${lng}/services/${svc.slug}`} className="footer-link">
                  {svc.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 4. Контактная информация */}
        <div className="footer-info">
          <h3 className="footer-title">{dict.nav.contacts}</h3>
          <address style={{ fontStyle: 'normal' }}>
            <ul className="footer-list info-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="info-icon" style={{ marginTop: '4px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.82-1.587-5.18-3.95-6.77-6.77l1.293-.97c.362-.271.528-.833.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <div>
                  <a href={`tel:${dict.contacts.phone}`} className="hover-gold" style={{ display: 'block' }}>{dict.contacts.phone}</a>
                  {socialPhone && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      WA/TG/Viber:{' '}
                      <a href={`https://wa.me/${messengerDigits}`} target="_blank" rel="noopener noreferrer" className="hover-gold">
                        {socialPhone}
                      </a>
                    </span>
                  )}
                </div>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="info-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <a href={`mailto:${dict.contacts.email}`} className="hover-gold">{dict.contacts.email}</a>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="info-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{dict.contacts.hours}</span>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Горизонтальная плашка регионов обслуживания */}
      <div className="footer-coverage">
        <div className="container footer-coverage-content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="coverage-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span className="coverage-text">{regionText}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>
            &copy; {currentYear} BYGG I SYD. {dict.footer?.rights || 'All rights reserved.'}
          </p>
          <div className="footer-bottom-links">
            <Link href={`/${lng}/privacy`} className="footer-bottom-link">
              {dict.footer?.privacy || 'Privacy Policy'}
            </Link>
            <a href="/sitemap.xml" className="footer-bottom-link" target="_blank" rel="noopener noreferrer">
              {dict.footer?.sitemap || 'Sitemap'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
