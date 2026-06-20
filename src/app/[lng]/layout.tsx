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
const SITE_NAME = 'Oleh Massage';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080908',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const titleDefault = 'Oleh Massage | Premium Spa & Massage';
  const descriptionDefault =
    dict.hero.subtitle ||
    'Professional massage therapy and premium spa treatments by Oleh.';

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
      'professional massage',
      'premium spa',
      'massage therapist',
      'Swedish massage',
      'sports massage',
      'hot stone massage',
      'Oleh massage',
      'professional massage',
    ],
    authors: [{ name: 'Oleh Massage' }],
    creator: 'Oleh Massage',
    publisher: 'Oleh Massage',
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
          alt: 'Oleh Massage — Premium Spa & Massage',
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
    name: 'Oleh Massage',
    description: dict.hero.subtitle,
    url: `${SITE_URL}/${lng}`,
    logo: `${SITE_URL}/favicon.ico`,
    image: `${SITE_URL}/images/hero-bg.webp`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SE',
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
                document.documentElement.classList.add('theme-obsidian');
                var meta = document.createElement('meta');
                meta.name = 'theme-color';
                meta.content = '#080908';
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
