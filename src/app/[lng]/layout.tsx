import { Cormorant_Garamond, Outfit } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { getDictionary, Locale } from '../i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-title',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export async function generateStaticParams() {
  return [{ lng: 'sv' }, { lng: 'en' }, { lng: 'no' }, { lng: 'ru' }];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Oleg Massage Stockholm';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080908' },
    { media: '(prefers-color-scheme: light)', color: '#080908' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const titleDefault = 'Oleg Massage Stockholm | Premium Spa & Massage';
  const descriptionDefault =
    dict.hero.subtitle ||
    'Professional massage therapy in Stockholm. Premium spa treatments by Oleg.';

  const localeMap: Record<string, string> = {
    sv: 'sv_SE',
    en: 'en_US',
    no: 'nb_NO',
    ru: 'ru_RU',
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s — ${SITE_NAME}`,
      default: titleDefault,
    },
    description: descriptionDefault,
    applicationName: SITE_NAME,
    generator: 'Next.js',
    keywords: [
      'massage Stockholm',
      'spa Stockholm',
      'massage therapist',
      'Swedish massage',
      'sports massage',
      'hot stone massage',
      'Oleg massage',
      'Östermalm massage',
    ],
    authors: [{ name: 'Oleg Massage Stockholm' }],
    creator: 'Oleg Massage Stockholm',
    publisher: 'Oleg Massage Stockholm',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `/${lng}`,
      languages: {
        sv: '/sv',
        en: '/en',
        no: '/no',
        ru: '/ru',
      },
    },
    openGraph: {
      title: titleDefault,
      description: descriptionDefault,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: localeMap[lng] || 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/hero-bg.webp',
          width: 1200,
          height: 630,
          alt: 'Oleg Massage Stockholm — Premium Spa & Massage',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description: descriptionDefault,
      images: ['/images/hero-bg.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Oleg Massage Stockholm',
    description: dict.hero.subtitle,
    url: `${SITE_URL}/${lng}`,
    logo: `${SITE_URL}/favicon.ico`,
    image: `${SITE_URL}/images/hero-bg.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Birger Jarlsgatan 42',
      addressLocality: 'Stockholm',
      postalCode: '114 29',
      addressCountry: 'SE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 59.3373,
      longitude: 18.0697,
    },
    telephone: dict.contacts.phone,
    email: dict.contacts.email,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    priceRange: '850-1200 SEK',
    currenciesAccepted: 'SEK',
    paymentAccepted: 'Cash, Credit Card, Swish',
    areaServed: {
      '@type': 'City',
      name: 'Stockholm',
    },
    sameAs: [
      'https://www.instagram.com/olegmassage/',
      'https://www.facebook.com/olegmassage/',
    ],
  };

  return (
    <html
      lang={lng}
      className={`${cormorant.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('oleg-theme') || 'obsidian';
                document.documentElement.classList.add('theme-' + theme);
                var color = theme === 'obsidian' ? '#080908' : '#060907';
                var meta = document.createElement('meta');
                meta.name = 'theme-color';
                meta.content = color;
                document.head.appendChild(meta);
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          {dict.skipToContent || 'Skip to content'}
        </a>

        <Header dict={dict} />

        <ScrollRevealInit />

        <main id="main-content" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          {children}
        </main>

        <Footer dict={dict} lng={lng} />
      </body>
    </html>
  );
}
