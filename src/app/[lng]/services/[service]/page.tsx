import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDictionary, Locale } from '../../../i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface ServicePageProps {
  params: Promise<{
    lng: string;
    service: string;
  }>;
}

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

export async function generateStaticParams() {
  const locales = ['sv', 'en', 'no', 'ru', 'uk'];
  const params: { lng: string; service: string }[] = [];
  for (const lng of locales) {
    for (const service of serviceSlugs) {
      params.push({ lng, service });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const serviceSlug = resolvedParams.service;
  const dict = await getDictionary(lng);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = (dict.services.items as any)[serviceSlug];

  if (!service) return {};

  const title = `${service.seo_title || service.title} — RYGGHJÄLP`;
  const description = service.seo_desc || service.desc;
  const locales = ['sv', 'en', 'no', 'ru', 'uk'];

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/services/${serviceSlug}`,
      languages: Object.fromEntries(
        locales.map((alt) => [alt, `/${alt}/services/${serviceSlug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/services/${serviceSlug}`,
      siteName: 'RYGGHJÄLP',
      locale: lng === 'no' ? 'nb_NO' : lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/services/${serviceSlug}.webp`,
          width: 1024,
          height: 1024,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/services/${serviceSlug}.webp`],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const serviceSlug = resolvedParams.service;
  const dict = await getDictionary(lng);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = (dict.services.items as any)[serviceSlug];

  if (!service) {
    notFound();
  }

  // Фильтруем текущую услугу для блока перелинковки
  const relatedSlugs = serviceSlugs.filter(slug => slug !== serviceSlug).slice(0, 3);

  const relatedTitle = {
    ru: 'Другие процедуры',
    en: 'Other treatments',
    sv: 'Andra behandlingar',
    no: 'Andre behandlinger',
    uk: 'Інші процедури',
  }[lng] || 'Other treatments';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'HealthAndBeautyBusiness',
      name: 'RYGGHJÄLP',
      url: `${SITE_URL}/${lng}`,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SE',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'SE',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="service-detail-page section-spacing">
        <div className="container">
          <Link href={`/${lng}`} className="back-link reveal">
            ← {dict.services.back}
          </Link>

          {/* Шапка услуги: на всю ширину страницы */}
          <div className="service-detail-header reveal">
            <h1 className="service-detail-title">{service.title}</h1>
          
          {/* Мета-панель: длительность и стоимость */}
          <div className="service-meta-panel">
            <div className="meta-item">
              <span className="meta-label">{dict.services.duration}</span>
              <span className="meta-value"><span role="img" aria-hidden="true">⏱</span> {service.duration}</span>
            </div>
          </div>
        </div>

        <div className="service-detail-content-wrap reveal">
          <div className="service-detail-grid">
            {/* Левая колонка: Изображение + Показания */}
            <div className="service-grid-left">
              <div className="service-detail-image-wrapper">
                <div className="service-detail-glow"></div>
                <div className="service-detail-img-frame">
                  <img
                    src={`/images/services/${serviceSlug}.webp?v=2`}
                    alt={service.title}
                    className="service-detail-img"
                    width={800}
                    height={1000}
                    fetchPriority="high"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

            </div>

            {/* Правая колонка: Описание + Эффект + Процесс + Показания */}
            <div className="service-grid-right">
              <p className="service-short-desc">{service.desc}</p>
              
              {/* Терапевтический эффект */}
              <div className="service-benefit-card glass-card">
                <div className="benefit-card-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon-service)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="benefit-icon">
                    <defs>
                      <linearGradient id="gold-gradient-icon-service" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2d2b5" />
                        <stop offset="50%" stopColor="#d4be96" />
                        <stop offset="100%" stopColor="#a38a5e" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <h3 className="benefit-title">{(dict.services as any).benefitsTitle}</h3>
                </div>
                <p className="benefit-text">{service.benefit}</p>
              </div>

              {/* Как проходит процедура */}
              {service.process_text && (
                <div className="service-content-block">
                  <h3 className="service-block-title">{service.process_title}</h3>
                  <p className="service-block-text">{service.process_text}</p>
                </div>
              )}

              {/* Показания к процедуре */}
              {service.indications_list && (
                <div className="service-content-block">
                  <h3 className="service-block-title">{service.indications_title}</h3>
                  <ul className="service-indications-list">
                    {service.indications_list.map((ind: string, idx: number) => (
                      <li key={idx} className="indication-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient-icon-service)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="indication-check">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Противопоказания (на всю ширину под Grid-панелью) */}
          {service.contraindications_text && (
            <div className="contraindications-block">
              <h4 className="service-block-title-small">{service.contraindications_title}</h4>
              <p className="service-block-text-small">{service.contraindications_text}</p>
            </div>
          )}
          
          <div className="book-btn-wrapper">
            <Link
              href={`/${lng}/contacts?service=${serviceSlug}&book=true`}
              className="btn btn-primary book-service-btn"
            >
              {dict.services.bookService}
            </Link>
          </div>
        </div>

        {/* Блок перелинковки: Другие процедуры */}
        <div className="related-services-section reveal">
          <h2 className="related-services-title">{relatedTitle}</h2>
          <div className="related-services-grid">
            {relatedSlugs.map((slug) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const relService = (dict.services.items as any)[slug];
              if (!relService) return null;
              return (
                <Link key={slug} href={`/${lng}/services/${slug}`} className="related-service-card glass-card">
                  <div className="related-service-img-wrapper">
                    <img
                      src={`/images/services/${slug}.webp`}
                      alt={relService.title}
                      className="related-service-img"
                      width={400}
                      height={250}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="related-service-info">
                    <h3 className="related-service-name">{relService.title}</h3>
                    <div className="related-service-meta">
                      <span className="related-service-duration"><span role="img" aria-hidden="true">⏱</span> {relService.duration.split(' / ')[0]}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
