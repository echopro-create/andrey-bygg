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
            <div className="glass-card reveal">
              <div className="advantage-icon">
                <span className="icon-gold">𓁠</span>
              </div>
              <h3 className="advantage-title">{dict.advantages.expTitle}</h3>
              <p className="advantage-desc">{dict.advantages.expDesc}</p>
            </div>
            <div className="glass-card reveal">
              <div className="advantage-icon">
                <span className="icon-gold">𓆱</span>
              </div>
              <h3 className="advantage-title">{dict.advantages.indTitle}</h3>
              <p className="advantage-desc">{dict.advantages.indDesc}</p>
            </div>
            <div className="glass-card reveal">
              <div className="advantage-icon">
                <span className="icon-gold">𓂶</span>
              </div>
              <h3 className="advantage-title">{dict.advantages.atmTitle}</h3>
              <p className="advantage-desc">{dict.advantages.atmDesc}</p>
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
