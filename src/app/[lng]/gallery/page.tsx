import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../i18n';
import GalleryClient from './GalleryClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface GalleryPageProps {
  params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const description = dict.gallery?.subtitle || 'Take a look inside our premium massage studio in Stockholm.';

  return {
    title: dict.nav.gallery,
    description,
    alternates: {
      canonical: `/${lng}/gallery`,
      languages: {
        sv: '/sv/gallery',
        en: '/en/gallery',
        no: '/no/gallery',
        ru: '/ru/gallery',
      },
    },
    openGraph: {
      title: `${dict.nav.gallery} — Oleg Massage Stockholm`,
      description,
      url: `${SITE_URL}/${lng}/gallery`,
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const images = [
    { src: '/images/gallery/gallery-1.webp', alt: 'Massage studio interior — treatment room in Stockholm' },
    { src: '/images/gallery/gallery-2.webp', alt: 'Premium massage table with organic oils' },
    { src: '/images/gallery/gallery-3.webp', alt: 'Relaxation area with ambient lighting' },
    { src: '/images/gallery/gallery-4.webp', alt: 'Massage therapy preparation area' },
    { src: '/images/gallery/gallery-5.webp', alt: 'Spa atmosphere — candles and towels' },
    { src: '/images/gallery/gallery-6.webp', alt: 'Oleg Massage Studio — reception and welcome area' },
  ];

  return (
    <div className="gallery-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.nav.gallery} <span className="gold-accent">Studio</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {dict.gallery?.subtitle ||
              'Take a look inside our premium private massage studio in Stockholm. A sanctuary of peace, equipped for your absolute comfort.'}
          </p>
        </div>

        <GalleryClient images={images} closeLabel={dict.contacts.formTitle} lng={lng} dict={dict} />
      </div>
    </div>
  );
}
