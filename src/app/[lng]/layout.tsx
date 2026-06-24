import { Cormorant_Garamond, Outfit } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { getDictionary, Locale } from '../i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import { SITE_URL, SITE_NAME, localeMap, locales } from '@/lib/config';
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
  return locales.map((lng) => ({ lng }));
}

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

  const titleDefault = `${SITE_NAME} | ${dict.hero.title} ${dict.hero.accent}`;
  const descriptionDefault = dict.hero.subtitle;

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
      'byggfirma',
      'renovering',
      'snickare',
      'takläggning',
      'köksmontering',
      'badrumsrenovering',
      'kakelsättning',
      'måleri',
      'utvändiga träarbeten',
      'Andrey Bygg',
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
        ru: '/ru',
        uk: '/uk',
      },
    },
    openGraph: {
      title: titleDefault,
      description: descriptionDefault,
      url: `${SITE_URL}/${lng}`,
      siteName: SITE_NAME,
      locale: localeMap[lng] || 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-image.webp`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${dict.hero.title} ${dict.hero.accent}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description: descriptionDefault,
      images: [`${SITE_URL}/images/og-image.webp`],
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
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180' },
      ],
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
    '@type': 'ConstructionBusiness',
    name: 'Andrey Bygg',
    description: dict.hero.subtitle,
    url: `${SITE_URL}/${lng}`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/images/og-image.webp`,
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
    priceRange: '$$',
    currenciesAccepted: 'SEK',
    paymentAccepted: 'Cash, Credit Card, Swish',
    sameAs: [],
  };

  return (
    <html
      lang={lng}
      className={`${cormorant.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('theme-obsidian');
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
          {dict.skipToContent}
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
