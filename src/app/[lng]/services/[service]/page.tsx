import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, Locale } from '../../../i18n';

interface ServicePageProps {
  params: Promise<{
    lng: string;
    service: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ['sv', 'en', 'no', 'ru'];
  const services = [
    'classic',
    'anti-cellulite',
    'sports',
    'lymphatic-drainage',
    'cupping',
    'hot-stone',
    'turkish-foam',
    'natural-massage',
  ];

  const params: { lng: string; service: string }[] = [];
  for (const lng of locales) {
    for (const service of services) {
      params.push({ lng, service });
    }
  }
  return params;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const serviceSlug = resolvedParams.service;
  const dict = await getDictionary(lng);
  
  const service = (dict.services.items as any)[serviceSlug];

  if (!service) {
    notFound();
  }

  return (
    <div className="service-detail-page section-spacing">
      <div className="container">
        <Link href={`/${lng}`} className="back-link reveal">
          ← {dict.services.back}
        </Link>
        
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
      </div>
    </div>
  );
}
