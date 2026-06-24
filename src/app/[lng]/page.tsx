import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import { getDictionary, Locale } from '../i18n';
import { SITE_URL, SITE_NAME, serviceSlugs } from '@/lib/config';

interface PageProps {
  params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = `${dict.hero.title} ${dict.hero.accent}`;
  const description = dict.hero.subtitle;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}`,
      languages: {
        sv: '/sv',
        en: '/en',
        ru: '/ru',
        uk: '/uk',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}`,
      siteName: SITE_NAME,
      locale: lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-image.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-image.webp`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: serviceSlugs.map((slug) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const service = (dict.services.items as any)[slug];
      return {
        '@type': 'Question',
        name: service.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: service.benefit,
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="home-page">
        {/* 1. Hero Section */}
        <section className="hero-section">
          {/* Background Image Wrapper for Scroll-driven Parallax */}
          <div className="hero-bg-wrapper">
            <Image
              src="/images/hero-bg.webp"
              alt="Andrey Bygg Construction Background"
              fill
              priority
              quality={85}
              sizes="100vw"
              className="hero-bg-image"
            />
            <div className="hero-bg-overlay" />
          </div>

          <div className="container hero-container">
            <div className="hero-content reveal">
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

          {/* Cross-browser Scroll-driven Parallax and Zoom using requestAnimationFrame */}
          <Script id="hero-parallax-script">
            {`
              (function() {
                var wrapper = document.querySelector('.hero-bg-wrapper');
                if (!wrapper) return;
                
                var ticking = false;
                var lastScrollY = 0;
                
                function updateAnimation() {
                  var zoom = 1 + (lastScrollY * 0.00025);
                  var opacity = 1 - (lastScrollY * 0.001);
                  
                  var finalZoom = Math.min(1.18, zoom);
                  var finalOpacity = Math.max(0.35, opacity);
                  
                  wrapper.style.transform = 'scale(' + finalZoom + ') translateZ(0)';
                  wrapper.style.opacity = finalOpacity;
                  ticking = false;
                }
                
                window.addEventListener('scroll', function() {
                  lastScrollY = window.scrollY;
                  if (!ticking) {
                    window.requestAnimationFrame(updateAnimation);
                    ticking = true;
                  }
                }, { passive: true });
              })();
            `}
          </Script>
        </section>

        {/* 2. About Master Section */}
        <section id="about" className="about-section section-spacing">
          <div className="container about-container">
            <div className="about-image-wrapper reveal">
              <div className="about-image-card">
                <Image
                  src="/images/builder-portrait.webp"
                  alt={dict.about.certTitle ? `Snickare — ${dict.about.certTitle}` : 'Snickare'}
                  className="about-img"
                  width={1024}
                  height={1365}
                  fetchPriority="high"
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
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
              <div className="about-paragraphs">
                <p className="about-paragraph">{dict.about.text1}</p>
                <p className="about-paragraph">{dict.about.text2}</p>
                {dict.about.text3 && <p className="about-paragraph">{dict.about.text3}</p>}
              </div>
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
                    <span className="metric-label">{dict.hero.languagesLabel || 'LANGUAGES'}</span>
                    <span className="metric-languages-list">SV | EN | RU | UK</span>
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const service = (dict.services.items as any)[slug];
                if (!service) return null;
                return (
                  <div key={slug} className="service-card reveal">
                    <div className="service-img-wrapper">
                      <Image
                        src={`/images/services/${slug}.webp`}
                        alt={service.title}
                        className="service-card-img"
                        width={768}
                        height={480}
                        loading="lazy"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="service-card-body">
                      <h3 className="service-card-title">{service.title}</h3>
                      <p className="service-card-desc">{service.desc}</p>
                      <div className="service-card-footer">
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
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {dict.reviews.list.map((review: any, index: number) => {
                const verifiedText = {
                  ru: 'Верифицированный клиент',
                  en: 'Verified client',
                  sv: 'Verifierad klient',
                  uk: 'Верифікований клієнт',
                }[lng] || 'Verified client';

                return (
                  <div key={index} className="review-card reveal">
                    <div className="review-card-inner">
                      <div className="quote-mark">
                        <svg width="40" height="30" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="quote-svg">
                          <path d="M10 0C4.477 0 0 4.477 0 10v14h12V10H4c0-3.314 2.686-6 6-6V0zm22 0c-5.523 0-10 4.477-10 10v14h12V10h-8c0-3.314 2.686-6 6-6V0z" fill="url(#gold-gradient-quote)" />
                          <defs>
                            <linearGradient id="gold-gradient-quote" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#e2d2b5" stopOpacity="0.08" />
                              <stop offset="100%" stopColor="#a38a5e" stopOpacity="0.03" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      <div className="stars">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="star-svg">
                            <defs>
                              <linearGradient id="gold-gradient-star" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e2d2b5" />
                                <stop offset="50%" stopColor="#d4be96" />
                                <stop offset="100%" stopColor="#a38a5e" />
                              </linearGradient>
                            </defs>
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#gold-gradient-star)" />
                          </svg>
                        ))}
                      </div>

                      <p className="review-text">“{review.text}”</p>

                      <div className="review-footer">
                        <span className="review-line"></span>
                        <div className="review-meta">
                          <div className="review-author">{review.name}</div>
                          <div className="review-status">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="verified-icon">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{verifiedText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
