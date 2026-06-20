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
          <div className="hero-text reveal">
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
          <div className="hero-image-wrapper reveal">
            <div className="hero-arch-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.png"
                alt="Massage Therapy Spa Stockholm"
                className="hero-img"
              />
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
                src="/images/oleg-about.webp"
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
            <p className="about-paragraph">{dict.about.text1}</p>
            <p className="about-paragraph">{dict.about.text2}</p>
            <div className="experience-metric">
              <div className="metric-item">
                <span className="metric-number">10+</span>
                <span className="metric-label">{dict.advantages.expTitle}</span>
              </div>
              <div className="metric-line"></div>
              <div className="metric-item">
                <span className="metric-number">4</span>
                <span className="metric-label">LANGUAGES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Advantages Section */}
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

      {/* 4. Services Section */}
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
