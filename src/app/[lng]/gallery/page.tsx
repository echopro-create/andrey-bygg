import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../i18n';
import GalleryClient from './GalleryClient';
import { SITE_URL, SITE_NAME } from '@/lib/config';

interface GalleryPageProps {
  params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = dict.gallery?.seo_title || dict.nav.gallery;
  const description = dict.gallery?.seo_desc || dict.gallery?.subtitle || '';

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
      siteName: SITE_NAME,
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
    { src: '/images/gallery/gallery-1_v2.webp', alt: (dict.gallery?.alt4 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-2_v2.webp', alt: (dict.gallery?.alt1 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-3_v2.webp', alt: (dict.gallery?.alt6 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-4_v2.webp', alt: (dict.gallery?.alt2 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-5_v2.webp', alt: (dict.gallery?.alt5 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-6_v2.webp', alt: (dict.gallery?.alt7 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-7_v2.webp', alt: (dict.gallery?.alt3 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-8_v2.webp', alt: (dict.gallery?.alt9 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-9_v2.webp', alt: (dict.gallery?.alt8 as string) || dict.nav.gallery },
    { src: '/images/gallery/gallery-10_v2.webp', alt: (dict.gallery?.alt10 as string) || dict.nav.gallery },
  ];

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: dict.nav.gallery,
    description: dict.gallery?.subtitle || 'Take a look at our completed construction, renovation, and carpentry projects.',
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
              'Take a look at our completed construction, renovation, and carpentry projects. We guarantee high-quality craftsmanship in every detail.'}
          </p>
        </div>

        <GalleryClient images={images} lng={lng} dict={dict as unknown as Record<string, unknown>} />
      </div>
    </div>
    </>
  );
}
