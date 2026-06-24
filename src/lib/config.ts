export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_NAME = 'Andrey Bygg';

export const locales = ['sv', 'en', 'ru', 'uk'] as const;

export const serviceSlugs = [
  'windows-doors',
  'kitchen-assembly',
  'bathroom-renovation',
  'tiling',
  'painting',
  'roofing-woodwork',
] as const;

export const localeMap: Record<string, string> = {
  sv: 'sv_SE',
  en: 'en_US',
  ru: 'ru_RU',
  uk: 'uk_UA',
};

export interface Dict {
  nav: {
    about: string;
    services: string;
    gallery: string;
    contacts: string;
    book: string;
  };
  hero: {
    title: string;
    accent: string;
    subtitle: string;
    badge: string;
    bookBtn: string;
    servicesBtn: string;
    languagesLabel?: string;
    metrics: Record<string, string>;
  };
  skipToContent: string;
  allServices?: string;
  privacyLink?: string;
  services: {
    back?: string;
    title?: string;
    accent?: string;
    readMore?: string;
    duration?: string;
    bookService?: string;
    benefitsTitle?: string;
    items: Record<string, {
      title: string;
      desc: string;
      benefit?: string;
      duration?: string;
      seo_title?: string;
      seo_desc?: string;
      process_title?: string;
      process_text?: string;
      indications_title?: string;
      indications_list?: string[];
      contraindications_title?: string;
      contraindications_text?: string;
    }>;
  };
  contacts: {
    phone: string;
    email: string;
    address?: string;
    hours?: string;
    title?: string;
    accent?: string;
    subtitle?: string;
    seo_title?: string;
    seo_desc?: string;
    formTitle?: string;
  };
  gallery: {
    seo_title?: string;
    seo_desc?: string;
    subtitle?: string;
    studio?: string;
  };
  privacy: {
    title: string;
    subtitle: string;
    seo_title?: string;
    seo_desc?: string;
    intro: string;
    backToHome: string;
    section1_title: string;
    section1_text: string;
    section2_title: string;
    section2_text: string;
    section3_title: string;
    section3_text: string;
    section4_title: string;
    section4_text: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  about: Record<string, string>;
  advantages: Record<string, string>;
  reviews: {
    title: string;
    accent: string;
    list: Array<{
      name: string;
      text: string;
      rating?: number;
    }>;
  };
}
