import Link from 'next/link';
import { getDictionary, Locale } from '../i18n';

interface PageProps {
  params: Promise<{ lng: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const serviceSlugs = [
    'classic',
    'anti-cellulite',
    'sports',
    'lymphatic-drainage',
    'cupping',
    'hot-stone',
    'turkish-foam',
    'natural-massage',
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content reveal">
            <div className="hero-pill-tag">{dict.hero.badge}</div>
            
            <h1 className="hero-title">
              {dict.hero.title} <span className="gold-accent">{dict.hero.accent}</span>
            </h1>
            
            <p className="hero-subtitle">{dict.hero.subtitle}</p>
            
            <div className="hero-actions">
              <Link href={`/${lng}/contacts?book=true`} className="btn btn-primary">
                {dict.hero.bookBtn}
              </Link>
              <Link href="#services" className="btn btn-secondary">
                {dict.hero.servicesBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Metrics Bar */}
        <div className="container hero-metrics-container reveal">
          <div className="hero-metrics-bar glass-card">
            <div className="metric-col">
              <div className="metric-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="metric-val">{dict.hero.metrics.m1_val}</span>
              <span className="metric-lbl">{dict.hero.metrics.m1_lbl}</span>
            </div>
            <div className="metric-col-divider"></div>
            <div className="metric-col">
              <div className="metric-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C12 2 6 8.5 6 13a6 6 0 0 0 12 0c0-4.5-6-11-6-11z" />
                </svg>
              </div>
              <span className="metric-val">{dict.hero.metrics.m2_val}</span>
              <span className="metric-lbl">{dict.hero.metrics.m2_lbl}</span>
            </div>
            <div className="metric-col-divider"></div>
            <div className="metric-col">
              <div className="metric-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 0 0-9 9c0 5 9 9 9 9s9-4 9-9a9 9 0 0 0-9-9z" />
                  <path d="M12 3v18" />
                </svg>
              </div>
              <span className="metric-val">{dict.hero.metrics.m3_val}</span>
              <span className="metric-lbl">{dict.hero.metrics.m3_lbl}</span>
            </div>
            <div className="metric-col-divider"></div>
            <div className="metric-col">
              <div className="metric-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="metric-val">{dict.hero.metrics.m4_val}</span>
              <span className="metric-lbl">{dict.hero.metrics.m4_lbl}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Master Section */}
      <section id="about" className="about-section section-spacing">
        <div className="container about-container">
          <div className="about-image-wrapper reveal">
            <div className="olive-background-plate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/oleg-portrait-new.webp"
                alt="Oleg Massage Therapist"
                className="about-img"
              />
              <div className="certificate-badge">
                <span className="cert-gold-star">★</span>
                <div className="cert-badge-text">
                  <h5>{dict.about.certTitle}</h5>
                  <p>{dict.about.certSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-text-content reveal">
            <h2 className="section-title">
              {dict.about.title} <span className="gold-accent">{dict.about.accent}</span>
            </h2>
            {dict.about.quote && (
              <blockquote className="about-quote">
                {dict.about.quote}
              </blockquote>
            )}
            <p className="about-paragraph">{dict.about.text1}</p>
            <p className="about-paragraph">{dict.about.text2}</p>
            <div className="experience-metric">
              <div className="metric-item">
                <span className="metric-number">10+</span>
                <div className="metric-info">
                  <span className="metric-label">{dict.advantages.expTitle}</span>
                </div>
              </div>
              <div className="metric-item">
                <span className="metric-number">4</span>
                <div className="metric-info">
                  <span className="metric-label">LANGUAGES</span>
                  <span className="metric-languages-list">SV | EN | NO | RU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="services-section section-spacing">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">
              {dict.services.title} <span className="gold-accent">{dict.services.accent}</span>
            </h2>
          </div>
          <div className="services-grid">
            {serviceSlugs.map((slug) => {
              const service = (dict.services.items as any)[slug];
              if (!service) return null;
              return (
                <div key={slug} className="service-card reveal">
                  <div className="service-img-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/services/${slug}.webp`}
                      alt={service.title}
                      className="service-card-img"
                    />
                    <div className="service-price-tag">
                      {dict.services.priceFrom} {service.price}
                    </div>
                  </div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.desc}</p>
                    <div className="service-card-footer">
                      <span className="service-duration-label">
                        ⏱ {service.duration}
                      </span>
                      <Link href={`/${lng}/services/${slug}`} className="service-card-link">
                        {dict.services.readMore} →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Advantages Section */}
      <section className="advantages-section section-spacing">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">
              {dict.advantages.title} <span className="gold-accent">{dict.advantages.accent}</span>
            </h2>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card reveal">
              <div className="advantage-card-inner">
                <div className="advantage-number">01</div>
                <div className="advantage-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="advantage-svg">
                    <defs>
                      <linearGradient id="gold-gradient-icon" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2d2b5" />
                        <stop offset="50%" stopColor="#d4be96" />
                        <stop offset="100%" stopColor="#a38a5e" />
                      </linearGradient>
                    </defs>
                    <path d="M6 16.5a6.5 6.5 0 0 0 12.07 3.36M18 16.5a6.5 6.5 0 0 1-12.07 3.36" />
                    <path d="M3 14c2.5-1.5 6-1 8 1.5M21 14c-2.5-1.5-6-1-8 1.5" />
                    <path d="M12 6c0 0-3 3.5-3 5.5s1.34 3.5 3 3.5 3-1.5 3-3.5S12 6 12 6z" />
                    <circle cx="12" cy="11" r="0.8" fill="url(#gold-gradient-icon)" />
                  </svg>
                </div>
                <h3 className="advantage-title">{dict.advantages.expTitle}</h3>
                <p className="advantage-desc">{dict.advantages.expDesc}</p>
              </div>
            </div>

            <div className="advantage-card reveal">
              <div className="advantage-card-inner">
                <div className="advantage-number">02</div>
                <div className="advantage-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="advantage-svg">
                    <path d="M12 21c-2.5-3-7-4-9-1.5 0 0 2-6.5 9-8.5 7 2 9 8.5 9 8.5-2-2.5-6.5-1.5-9 1.5z" />
                    <path d="M12 21c-1.5-4-4.5-7-7-6.5 0 0 2.5-4.5 7-5.5 4.5 1 7 5.5 7 5.5-2.5-.5-5.5 2.5-7 6.5z" />
                    <path d="M12 12c-1-3-3-5-5-4.5 0 0 2-3 5-3.5 3 .5 5 3.5 5 3.5-2-.5-4 1.5-5 4.5z" />
                    <path d="M12 7V3" />
                  </svg>
                </div>
                <h3 className="advantage-title">{dict.advantages.indTitle}</h3>
                <p className="advantage-desc">{dict.advantages.indDesc}</p>
              </div>
            </div>

            <div className="advantage-card reveal">
              <div className="advantage-card-inner">
                <div className="advantage-number">03</div>
                <div className="advantage-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="advantage-svg">
                    <ellipse cx="12" cy="19" rx="6" ry="2.5" />
                    <ellipse cx="12" cy="14" rx="4.5" ry="2" />
                    <ellipse cx="12" cy="9.5" rx="3" ry="1.5" />
                    <path d="M9 6c0-1.5 1-2 1-3M15 6c0-1.5-1-2-1-3M12 6c0-1.5 1-2.5 1-3.5" />
                  </svg>
                </div>
                <h3 className="advantage-title">{dict.advantages.atmTitle}</h3>
                <p className="advantage-desc">{dict.advantages.atmDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reviews Section */}
      <section className="reviews-section section-spacing">
        <div className="container">
          <div className="section-header text-center reveal">
            <h2 className="section-title">
              {dict.reviews.title} <span className="gold-accent">{dict.reviews.accent}</span>
            </h2>
          </div>
          <div className="reviews-grid">
            {dict.reviews.items.map((review: any, index: number) => (
              <div key={index} className="glass-card review-card reveal">
                <div className="stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="star-gold">★</span>
                  ))}
                </div>
                <p className="review-text">“{review.text}”</p>
                <div className="review-author">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
