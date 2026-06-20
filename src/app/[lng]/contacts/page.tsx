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

  const title = `${dict.contacts.title} ${dict.contacts.accent}`;
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
      title: `${title} — Oleh Massage`,
      description,
      url: `${SITE_URL}/${lng}/contacts`,
    },
  };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <div className="contacts-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.contacts.title} <span className="gold-accent">{dict.contacts.accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {dict.contacts?.subtitle ||
              'Book your session online or reach out via phone. Our private studio is located in the heart of Cherkasy.'}
          </p>
        </div>

        <ContactsClient dict={dict} />
      </div>
    </div>
  );
}
