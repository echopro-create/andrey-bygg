import type { MetadataRoute } from 'next';
import { SITE_URL, locales, serviceSlugs } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lng of locales) {
    const localeUrl = `${SITE_URL}/${lng}`;

    entries.push({
      url: localeUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${SITE_URL}/${alt}`])
        ),
      },
    });

    entries.push({
      url: `${localeUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${SITE_URL}/${alt}/gallery`])
        ),
      },
    });

    entries.push({
      url: `${localeUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${SITE_URL}/${alt}/contacts`])
        ),
      },
    });

    entries.push({
      url: `${localeUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${SITE_URL}/${alt}/privacy`])
        ),
      },
    });

    for (const service of serviceSlugs) {
      entries.push({
        url: `${localeUrl}/services/${service}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${SITE_URL}/${alt}/services/${service}`])
          ),
        },
      });
    }
  }

  return entries;
}
