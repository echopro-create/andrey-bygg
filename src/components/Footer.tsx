import Link from 'next/link';

interface FooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  lng: string;
}

export default function Footer({ dict, lng }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerServices = [
    { slug: 'classic', title: dict.services.items.classic.title },
    { slug: 'sports', title: dict.services.items.sports.title },
    { slug: 'hot-stone', title: dict.services.items['hot-stone'].title },
    { slug: 'lymphatic-drainage', title: dict.services.items['lymphatic-drainage'].title },
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href={`/${lng}`} className="footer-logo" aria-label="RYGGHJÄLP — Home">
            RYGG<span className="gold-accent">HJÄLP</span>
          </Link>
          <p className="footer-desc">
            {dict.hero.subtitle}
          </p>
        </div>

        <nav className="footer-links" aria-label="Services navigation">
          <h4 className="footer-title">{dict.nav.services}</h4>
          <ul className="footer-list">
            {footerServices.map((svc) => (
              <li key={svc.slug}>
                <Link href={`/${lng}/services/${svc.slug}`} className="footer-link">
                  {svc.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${lng}#services`} className="footer-link">
                {dict.allServices || 'All services'} →
              </Link>
            </li>
          </ul>
        </nav>

        <div className="footer-info">
          <h4 className="footer-title">{dict.contacts.title}</h4>
          <address style={{ fontStyle: 'normal' }}>
            <ul className="footer-list info-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="info-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>{dict.contacts.address}</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="info-icon" style={{ marginTop: '4px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.82-1.587-5.18-3.95-6.77-6.77l1.293-.97c.362-.271.528-.833.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <div>
                  <a href={`tel:${dict.contacts.phone}`} className="hover-gold" style={{ display: 'block' }}>{dict.contacts.phone}</a>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    WA/TG/Viber:{' '}
                    <a href="https://wa.me/4748614204" target="_blank" rel="noopener noreferrer" className="hover-gold">
                      +47 486 14 204
                    </a>
                  </span>
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

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>
            &copy; {currentYear} RYGGHJÄLP. All rights reserved. {dict.contacts.address}.
            {' | '}
            <Link href={`/${lng}/privacy`} className="footer-bottom-link" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
              {dict.privacyLink}
            </Link>
          </p>
          <nav className="footer-socials" aria-label="Social media links">
            <a
              href="https://www.instagram.com/touroleg/"
              className="social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              IG
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100028476219743"
              className="social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              FB
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
