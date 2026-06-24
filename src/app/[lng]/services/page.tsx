import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../i18n';
import { SITE_URL, serviceSlugs, locales } from '@/lib/config';

export async function generateStaticParams() {
  return locales.map((lng) => ({ lng }));
}

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = dict.nav.services;
  const description = dict.services.title
    ? `${dict.services.title} ${dict.services.accent || ''} — Andrey Bygg`
    : '';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/services`,
      languages: Object.fromEntries(locales.map((alt) => [alt, `/${alt}/services`])),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/services`,
      type: 'website',
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ lng: string }> }) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <div className="section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.services.title} <span className="gold-accent">{dict.services.accent}</span>
          </h1>
        </div>

        <div className="services-grid">
          {serviceSlugs.map((slug) => {
            const service = dict.services.items[slug];
            if (!service) return null;
            return (
              <div key={slug} className="service-card reveal">
                <div className="service-img-wrapper">
                  <Image
                    src={`/images/services/${slug}.webp`}
                    alt={service.title as string}
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
                    <span className="service-duration-label">
                      <span role="img" aria-hidden="true">⏱</span> {service.duration}
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
    </div>
  );
}
