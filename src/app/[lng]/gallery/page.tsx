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

  const title = `${dict.nav.gallery} — RyggHjälp`;
  const description = dict.gallery?.subtitle || 'Take a look inside our premium private massage studio.';

  return {
    title,
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
      title,
      description,
      url: `${SITE_URL}/${lng}/gallery`,
      siteName: 'RyggHjälp',
      locale: lng === 'no' ? 'nb_NO' : lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/gallery/gallery-1.webp`,
          width: 1004,
          height: 1600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/gallery/gallery-1.webp`],
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const images = [
    { src: '/images/gallery/gallery-1.webp', alt: 'Professional deep tissue back massage therapy' },
    { src: '/images/gallery/gallery-2.webp', alt: 'Heated volcanic hot stone massage therapy' },
    { src: '/images/gallery/gallery-3.webp', alt: 'Neck and shoulder tension relief massage' },
    { src: '/images/gallery/gallery-4.webp', alt: 'Acupressure foot massage and reflexology treatment' },
    { src: '/images/gallery/gallery-5.webp', alt: 'Traditional vacuum cupping therapy on client back' },
    { src: '/images/gallery/gallery-6.webp', alt: 'Relaxing bamboo stick massage technique' },
    { src: '/images/gallery/gallery-7.webp', alt: 'Therapeutic arm stretch and joint mobilization' },
    { src: '/images/gallery/gallery-8.webp', alt: 'Soothing head and scalp massage for stress relief' },
    { src: '/images/gallery/gallery-9.webp', alt: 'Deep sports sports massage on calf muscle for recovery' },
    { src: '/images/gallery/gallery-10.webp', alt: 'Warm organic oil pouring for back massage' },
    { src: '/images/gallery/gallery-11.webp', alt: 'Gentle lymphatic drainage massage on neck area' },
    { src: '/images/gallery/gallery-12.webp', alt: 'Detoxifying honey massage treatment on back' },
    { src: '/images/gallery/gallery-13.webp', alt: 'Intense sports back massage for muscle recovery' },
    { src: '/images/gallery/gallery-14.webp', alt: 'Relaxing facial massage and temple acupressure' },
  ];

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: dict.nav.gallery,
    description: dict.gallery?.subtitle || 'Take a look inside our premium private massage studio.',
    url: `${SITE_URL}/${lng}/gallery`,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}${img.src}`,
      name: img.alt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />
      <div className="gallery-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.nav.gallery} <span className="gold-accent">{dict.gallery?.studio || 'Studio'}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {dict.gallery?.subtitle ||
              'Take a look inside our premium private massage studio. A sanctuary of peace, equipped for your absolute comfort.'}
          </p>
        </div>

        <GalleryClient images={images} closeLabel={dict.contacts.formTitle} lng={lng} dict={dict} />
      </div>
    </div>
    </>
  );
}
