import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../i18n';
import ContactsClient from './ContactsClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface ContactsPageProps {
  params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = `${dict.contacts.title} ${dict.contacts.accent} — Oleh Massage`;
  const description = dict.contacts?.subtitle || 'Book your session online or reach out via phone.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/contacts`,
      languages: {
        sv: '/sv/contacts',
        en: '/en/contacts',
        no: '/no/contacts',
        ru: '/ru/contacts',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/contacts`,
      siteName: 'Oleh Massage',
      locale: lng === 'no' ? 'nb_NO' : lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/hero-bg.webp`,
          width: 1024,
          height: 1024,
          alt: 'Oleh Massage — Premium Spa & Massage',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/hero-bg.webp`],
    },
  };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Oleh Massage',
    description: dict.contacts?.subtitle || 'Professional massage therapy and premium spa treatments.',
    url: `${SITE_URL}/${lng}/contacts`,
    telephone: dict.contacts.phone,
    email: dict.contacts.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SE',
    },
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <div className="contacts-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.contacts.title} <span className="gold-accent">{dict.contacts.accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {dict.contacts?.subtitle ||
              'Book your session online or reach out via phone. Our studio is equipped with everything needed for your comfort.'}
          </p>
        </div>

        <ContactsClient dict={dict} />
      </div>
    </div>
    </>
  );
}
