import type { Metadata } from 'next';
import { getDictionary, Locale } from '../../i18n';
import ContactsClient from './ContactsClient';
import { SITE_URL } from '@/lib/config';

interface ContactsPageProps {
  params: Promise<{ lng: string }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const title = dict.contacts.seo_title || `${dict.contacts.title} ${dict.contacts.accent}`;
  const description = dict.contacts.seo_desc || dict.contacts?.subtitle || '';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lng}/contacts`,
      languages: {
        sv: '/sv/contacts',
        en: '/en/contacts',
        ru: '/ru/contacts',
        uk: '/uk/contacts',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lng}/contacts`,
      siteName: 'Andrey Bygg',
      locale: lng === 'sv' ? 'sv_SE' : lng === 'ru' ? 'ru_RU' : lng === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/og-image.webp`,
          width: 1200,
          height: 630,
          alt: 'Andrey Bygg — Professionella byggtjänster i Sverige',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-image.webp`],
    },
  };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <ContactsClient dict={dict as unknown as Record<string, unknown>} />
  );
}
