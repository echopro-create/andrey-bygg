import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDictionary, Locale } from '../../../i18n';
import { SITE_URL, SITE_NAME, serviceSlugs, locales } from '@/lib/config';

interface ServicePageProps {
  params: Promise<{
    lng: string;
    service: string;
  }>;
}

export async function generateStaticParams() {
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

  const title = service.seo_title || service.title;
  const description = service.seo_desc || service.desc;

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
      siteName: SITE_NAME,
      locale: lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
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
    ru: 'Другие услуги',
    en: 'Other services',
    sv: 'Andra tjänster',
    uk: 'Інші послуги',
  }[lng] || 'Other services';

  const faqTitle = {
    ru: 'Часто задаваемые вопросы',
    en: 'Frequently Asked Questions',
    sv: 'Vanliga frågor',
    uk: 'Часті запитання',
  }[lng] || 'FAQ';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'ConstructionBusiness',
      name: 'BYGG I SYD',
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

  const faqSchema = service.faq ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item: { q: string; a: string }) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="service-detail-page section-spacing">
        <div className="container">
          <Link href={`/${lng}/services`} className="back-link reveal">
            ← {dict.services.back}
          </Link>

          {/* Шапка услуги: на всю ширину страницы */}
          <div className="service-detail-header reveal">
            <h1 className="service-detail-title">{service.title}</h1>
          </div>

        <div className="service-detail-content-wrap reveal">
          <div className="service-detail-grid">
            {/* Левая колонка: Изображение + Карточка действия */}
            <div className="service-grid-left">
              <div className="service-detail-image-wrapper">
                <div className="service-detail-glow"></div>
                <div className="service-detail-img-frame">
                  <Image
                    src={`/images/services/${serviceSlug}.webp`}
                    alt={service.title}
                    className="service-detail-img"
                    width={768}
                    height={480}
                    fetchPriority="high"
                    priority
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Карточка действия для десктопов */}
              <div className="service-cta-card glass-card reveal">
                <h3 className="cta-card-title">{dict.services.bookService}</h3>
                <p className="cta-card-text">
                  {lng === 'ru' ? 'Мы проконсультируем вас по всем вопросам, приедем на бесплатный замер и составим подробную смету.' :
                   lng === 'sv' ? 'Vi svarar на dina frågor, kommer på ett kostnadsfritt hembesök och tar fram en detaljerad offert.' :
                   lng === 'uk' ? 'Ми проконсультуємо вас з усіх питань, приїдемо на безкоштовний замір та складемо детальну кошторис.' :
                   'We will answer your questions, come for a free site visit and prepare a detailed estimate.'}
                </p>
                <Link
                  href={`/${lng}/contacts?service=${serviceSlug}&book=true`}
                  className="btn btn-primary cta-card-btn"
                >
                  {dict.services.bookService}
                </Link>
              </div>
            </div>

            {/* Правая колонка: Описание + Эффект + Процесс + Показания */}
            <div className="service-grid-right">
              <p className="service-short-desc">{service.desc}</p>
              
              {/* Терапевтический эффект */}
              <div className="service-benefit-card glass-card">
                <div className="benefit-card-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#theme-gradient-icon-service)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="benefit-icon">
                    <defs>
                      <linearGradient id="theme-gradient-icon-service" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--btn-primary-bg-end)" />
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#theme-gradient-icon-service)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="indication-check">
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


          
          <div className="book-btn-wrapper">
            <Link
              href={`/${lng}/contacts?service=${serviceSlug}&book=true`}
              className="btn btn-primary book-service-btn"
            >
              {dict.services.bookService}
            </Link>
          </div>

          {service.faq && service.faq.length > 0 && (
            <div className="service-faq-section reveal">
              <h2 className="service-faq-title">{faqTitle}</h2>
              <div className="service-faq-list">
                {service.faq.map((item: { q: string; a: string }, idx: number) => (
                  <details key={idx} className="faq-details">
                    <summary className="faq-summary">
                      {item.q}
                      <span className="faq-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </summary>
                    <div className="faq-content">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
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
                    <Image
                      src={`/images/services/${slug}.webp`}
                      alt={relService.title}
                      className="related-service-img"
                      width={400}
                      height={250}
                      loading="lazy"
                      quality={80}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="related-service-info">
                    <h3 className="related-service-name">{relService.title}</h3>

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
