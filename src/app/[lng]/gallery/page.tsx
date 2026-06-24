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

  const title = dict.gallery?.seo_title || dict.nav.gallery;
  const description = dict.gallery?.seo_desc || dict.gallery?.subtitle || 'Take a look inside our premium private massage studio.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/gallery`,
      languages: {
        sv: '/sv/gallery',
        en: '/en/gallery',
        ru: '/ru/gallery',
        uk: '/uk/gallery',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/gallery`,
      siteName: 'Andrey Bygg',
      locale: lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/gallery/gallery-1_v2.webp`,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/gallery/gallery-1_v2.webp`],
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const images = [
    { src: '/images/gallery/gallery-1_v2.webp', alt: 'Professional installation of modern kitchen cabinets' },
    { src: '/images/gallery/gallery-2_v2.webp', alt: 'Detailed tiling work with large-format tiles' },
    { src: '/images/gallery/gallery-3_v2.webp', alt: 'Custom exterior woodwork and deck construction' },
    { src: '/images/gallery/gallery-4_v2.webp', alt: 'Installation of energy-efficient windows' },
    { src: '/images/gallery/gallery-5_v2.webp', alt: 'High-quality painting and interior wall renovation' },
    { src: '/images/gallery/gallery-6_v2.webp', alt: 'Premium bathroom renovation and plumbing' },
    { src: '/images/gallery/gallery-7_v2.webp', alt: 'Roofing and structural wood restoration' },
    { src: '/images/gallery/gallery-8_v2.webp', alt: 'Accurate door alignment and installation' },
    { src: '/images/gallery/gallery-9_v2.webp', alt: 'Custom kitchen countertop assembly' },
    { src: '/images/gallery/gallery-10_v2.webp', alt: 'Elegant bathroom tiling and grout finish' },
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
