import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../../i18n';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const allServices = [
  'classic',
  'anti-cellulite',
  'sports',
  'lymphatic-drainage',
  'cupping',
  'hot-stone',
  'turkish-foam',
  'natural-massage',
];

interface ServicePageProps {
  params: Promise<{
    lng: string;
    service: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ['sv', 'en', 'no', 'ru'];
  const params: { lng: string; service: string }[] = [];
  for (const lng of locales) {
    for (const service of allServices) {
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
  const service = (dict.services.items as any)[serviceSlug];

  if (!service) return { title: 'Not Found' };

  const title = service.title;
  const description = service.desc;
  const url = `${SITE_URL}/${lng}/services/${serviceSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/services/${serviceSlug}`,
      languages: {
        sv: `/sv/services/${serviceSlug}`,
        en: `/en/services/${serviceSlug}`,
        no: `/no/services/${serviceSlug}`,
        ru: `/ru/services/${serviceSlug}`,
      },
    },
    openGraph: {
      title: `${title} — Oleg Massage Stockholm`,
      description,
      url,
      images: [
        {
          url: `/images/services/${serviceSlug}.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

const relatedGroups: Record<string, string[]> = {
  classic: ['sports', 'hot-stone', 'natural-massage'],
  sports: ['classic', 'cupping', 'lymphatic-drainage'],
  'hot-stone': ['classic', 'turkish-foam', 'natural-massage'],
  'lymphatic-drainage': ['anti-cellulite', 'sports', 'natural-massage'],
  'anti-cellulite': ['lymphatic-drainage', 'cupping', 'turkish-foam'],
  cupping: ['sports', 'anti-cellulite', 'hot-stone'],
  'turkish-foam': ['hot-stone', 'natural-massage', 'classic'],
  'natural-massage': ['classic', 'turkish-foam', 'lymphatic-drainage'],
};

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const serviceSlug = resolvedParams.service;
  const dict = await getDictionary(lng);

  const service = (dict.services.items as any)[serviceSlug];

  if (!service) {
    notFound();
  }

  const relatedSlugs = relatedGroups[serviceSlug] || [];
  const relatedServices = relatedSlugs
    .map((slug) => ({ slug, ...(dict.services.items as any)[slug] }))
    .filter((s) => s.title);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'HealthAndBeautyBusiness',
      name: 'Oleg Massage Stockholm',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Birger Jarlsgatan 42',
        addressLocality: 'Stockholm',
        postalCode: '114 29',
        addressCountry: 'SE',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Stockholm',
    },
    offers: {
      '@type': 'Offer',
      price: service.price.replace(/\D/g, ''),
      priceCurrency: 'SEK',
      availability: 'https://schema.org/InStock',
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
          <Breadcrumbs
            items={[
              { label: dict.breadcrumbs.home, href: `/${lng}` },
              { label: dict.breadcrumbs.services, href: `/${lng}#services` },
              { label: service.title },
            ]}
          />

          <div className="service-detail-container">
            <div className="service-detail-image-wrapper reveal">
              <div className="service-detail-img-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/services/${serviceSlug}.webp`}
                  alt={service.title}
                  className="service-detail-img"
                />
              </div>
            </div>

            <div className="service-detail-info-wrapper reveal">
              <h1 className="service-detail-title">{service.title}</h1>

              <div className="service-meta-panel">
                <div className="meta-item">
                  <span className="meta-label">{dict.services.duration}</span>
                  <span className="meta-value">⏱ {service.duration}</span>
                </div>
                <div className="meta-divider"></div>
                <div className="meta-item">
                  <span className="meta-label">Cost</span>
                  <span className="meta-value gold">{service.price}</span>
                </div>
              </div>

              <div className="service-detail-description">
                <p className="service-short-desc">{service.desc}</p>

                <div className="service-benefit-card glass-card">
                  <h3 className="benefit-title">Therapeutic Benefits</h3>
                  <p className="benefit-text">{service.benefit}</p>
                </div>
              </div>

              <Link
                href={`/${lng}/contacts?service=${serviceSlug}&book=true`}
                className="btn btn-primary book-service-btn"
              >
                {dict.services.bookService}
              </Link>
            </div>
          </div>

          {relatedServices.length > 0 && (
            <section className="related-services-section" style={{ marginTop: '80px' }}>
              <h2 className="section-title" style={{ marginBottom: '32px' }}>
                {dict.relatedServices}
              </h2>
              <div className="services-grid" style={{ marginTop: 0 }}>
                {relatedServices.map((rel: any) => (
                  <div key={rel.slug} className="service-card reveal">
                    <div className="service-img-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/services/${rel.slug}.webp`}
                        alt={rel.title}
                        className="service-card-img"
                        loading="lazy"
                      />
                      <div className="service-price-tag">
                        {dict.services.priceFrom} {rel.price}
                      </div>
                    </div>
                    <div className="service-card-body">
                      <h3 className="service-card-title">{rel.title}</h3>
                      <p className="service-card-desc">{rel.desc}</p>
                      <div className="service-card-footer">
                        <span className="service-duration-label">⏱ {rel.duration}</span>
                        <Link href={`/${lng}/services/${rel.slug}`} className="service-card-link">
                          {dict.services.readMore} →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
