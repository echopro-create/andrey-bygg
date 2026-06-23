import Link from 'next/link';
import { getDictionary, Locale } from '../../i18n';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface PrivacyPageProps {
  params: Promise<{
    lng: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { lng: 'sv' },
    { lng: 'en' },
    { lng: 'no' },
    { lng: 'ru' },
    { lng: 'uk' },
  ];
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = dict.privacy.seo_title || dict.privacy.title;
  const description = dict.privacy.seo_desc || dict.privacy.subtitle;
  const locales = ['sv', 'en', 'no', 'ru', 'uk'];

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/privacy`,
      languages: Object.fromEntries(
        locales.map((alt) => [alt, `/${alt}/privacy`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/privacy`,
      siteName: 'RYGGHJÄLP',
      locale: lng === 'no' ? 'nb_NO' : lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-image.webp`,
          width: 1200,
          height: 630,
          alt: 'RYGGHJÄLP — Premium Spa & Massage',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-image.webp`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <div className="privacy-page section-spacing">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link href={`/${lng}`} className="back-link reveal" style={{ marginBottom: '40px', display: 'inline-block' }}>
          ← {dict.privacy.backToHome}
        </Link>

        <header className="privacy-header reveal" style={{ marginBottom: '48px' }}>
          <h1 className="section-title" style={{ marginBottom: '16px', fontSize: '2.5rem' }}>{dict.privacy.title}</h1>
          <p className="section-subtitle" style={{ color: 'var(--primary)', fontStyle: 'italic' }}>{dict.privacy.subtitle}</p>
        </header>

        <div className="privacy-content reveal" style={{ opacity: 0.8, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <p>{dict.privacy.intro}</p>

          <section>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 400 }}>
              {dict.privacy.section1_title}
            </h3>
            <p>{dict.privacy.section1_text}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 400 }}>
              {dict.privacy.section2_title}
            </h3>
            <p>{dict.privacy.section2_text}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 400 }}>
              {dict.privacy.section3_title}
            </h3>
            <p>{dict.privacy.section3_text}</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 400 }}>
              {dict.privacy.section4_title}
            </h3>
            <p>{dict.privacy.section4_text}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
