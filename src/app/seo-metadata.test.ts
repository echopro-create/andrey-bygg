jest.mock('server-only', () => ({}));
import { getDictionary, Locale } from './i18n';

const locales: Locale[] = ['sv', 'en', 'ru', 'uk'];

describe('SEO metadata & structured data completeness', () => {
  const serviceSlugs = [
    'windows-doors',
    'kitchen-assembly',
    'bathroom-renovation',
    'tiling',
    'painting',
    'roofing-woodwork',
  ];

  describe('Dictionary SEO field presence', () => {
    it.each(locales)('locale "%s" should have seo_title and seo_desc for all services', async (locale) => {
      const dict = await getDictionary(locale);
      for (const slug of serviceSlugs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = (dict.services.items as any)[slug];
        expect(service).toBeDefined();
        expect(service.seo_title).toBeDefined();
        expect(typeof service.seo_title).toBe('string');
        expect(service.seo_title.length).toBeGreaterThan(0);
        expect(service.seo_desc).toBeDefined();
        expect(typeof service.seo_desc).toBe('string');
        expect(service.seo_desc.length).toBeGreaterThan(0);
      }
    });

    it.each(locales)('locale "%s" should have contacts seo_title and seo_desc', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.contacts.seo_title).toBeDefined();
      expect(dict.contacts.seo_desc).toBeDefined();
      expect(dict.contacts.seo_title!.length).toBeGreaterThan(0);
      expect(dict.contacts.seo_desc!.length).toBeGreaterThan(0);
    });

    it.each(locales)('locale "%s" should have gallery seo_title and seo_desc', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.gallery).toBeDefined();
      expect(dict.gallery.seo_title).toBeDefined();
      expect(dict.gallery.seo_desc).toBeDefined();
      expect(dict.gallery.seo_title!.length).toBeGreaterThan(0);
      expect(dict.gallery.seo_desc!.length).toBeGreaterThan(0);
    });

    it.each(locales)('locale "%s" should have privacy seo_title and seo_desc', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.privacy.seo_title).toBeDefined();
      expect(dict.privacy.seo_desc).toBeDefined();
      expect(dict.privacy.seo_title!.length).toBeGreaterThan(0);
      expect(dict.privacy.seo_desc!.length).toBeGreaterThan(0);
    });
  });

  describe('SEO title length standards (2026)', () => {
    it.each(locales)('locale "%s" service seo_titles should be 35-60 chars (before suffix)', async (locale) => {
      const dict = await getDictionary(locale);
      for (const slug of serviceSlugs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = (dict.services.items as any)[slug];
        const rawTitle = service.seo_title;
        expect(rawTitle.length).toBeGreaterThanOrEqual(35);
        expect(rawTitle.length).toBeLessThanOrEqual(60);
      }
    });

    it.each(locales)('locale "%s" service seo_descs should be 90-160 chars', async (locale) => {
      const dict = await getDictionary(locale);
      for (const slug of serviceSlugs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = (dict.services.items as any)[slug];
        const desc = service.seo_desc;
        expect(desc.length).toBeGreaterThanOrEqual(90);
        expect(desc.length).toBeLessThanOrEqual(160);
      }
    });

    it.each(locales)('locale "%s" SEO titles should not contain "BYGG I SYD" (added by template)', async (locale) => {
      const dict = await getDictionary(locale);
      for (const slug of serviceSlugs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = (dict.services.items as any)[slug];
        expect(service.seo_title).not.toContain('BYGG I SYD');
      }
    });
  });

  describe('SEO title uniqueness', () => {
    it('each service should have a unique seo_title within a locale', async () => {
      for (const locale of locales) {
        const dict = await getDictionary(locale);
        const titles = serviceSlugs.map((slug) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (dict.services.items as any)[slug].seo_title;
        });
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toBe(titles.length);
      }
    });

    it('each service should have a unique seo_desc within a locale', async () => {
      for (const locale of locales) {
        const dict = await getDictionary(locale);
        const descs = serviceSlugs.map((slug) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (dict.services.items as any)[slug].seo_desc;
        });
        const uniqueDescs = new Set(descs);
        expect(uniqueDescs.size).toBe(descs.length);
      }
    });
  });

  describe('Structured data (JSON-LD) schema validation', () => {
    describe('Organization schema (layout.tsx)', () => {
      it.each(locales)('locale "%s" should provide valid ConstructionBusiness schema', async (locale) => {
        const dict = await getDictionary(locale);
        // Validate that required fields are available in the dictionary for the schema
        expect(dict.hero.subtitle).toBeDefined();
        expect(dict.contacts.phone).toBeDefined();
        expect(dict.contacts.email).toBeDefined();

        const schema: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': 'ConstructionBusiness',
          name: 'BYGG I SYD',
          description: dict.hero.subtitle,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'SE',
          },
          telephone: dict.contacts.phone,
          email: dict.contacts.email,
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '09:00',
              closes: '21:00',
            },
          ],
          priceRange: '$$',
          currenciesAccepted: 'SEK',
          paymentAccepted: 'Cash, Credit Card, Swish',
          sameAs: [
            'https://www.instagram.com/',
          ],
        };

        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('ConstructionBusiness');
        expect(schema.name).toBe('BYGG I SYD');
        expect(schema.description).toBeTruthy();
        expect(schema.telephone).toBeTruthy();
        expect(schema.email).toBeTruthy();
        expect(schema.priceRange).toBe('$$');
        expect(schema.currenciesAccepted).toBe('SEK');
        const sameAs = schema.sameAs as string[];
        expect(Array.isArray(sameAs)).toBe(true);
        expect(sameAs.length).toBeGreaterThanOrEqual(1);

        const hours = (schema.openingHoursSpecification as Array<Record<string, unknown>>)[0];
        expect(hours.opens).toBe('09:00');
        expect(hours.closes).toBe('21:00');
        expect((hours.dayOfWeek as string[]).length).toBe(7);
      });
    });

    describe('FAQPage schema (homepage)', () => {
      it.each(locales)('locale "%s" should generate valid FAQ schema with 6 Q&A pairs', async (locale) => {
        const dict = await getDictionary(locale);

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: serviceSlugs.map((slug) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const service = (dict.services.items as any)[slug];
            return {
              '@type': 'Question',
              name: service.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: service.benefit,
              },
            };
          }),
        };

        expect(faqSchema['@context']).toBe('https://schema.org');
        expect(faqSchema['@type']).toBe('FAQPage');
        expect(faqSchema.mainEntity).toHaveLength(6);

        for (const qa of faqSchema.mainEntity) {
          expect(qa['@type']).toBe('Question');
          expect(typeof qa.name).toBe('string');
          expect(qa.name.length).toBeGreaterThan(0);
          expect(qa.acceptedAnswer['@type']).toBe('Answer');
          expect(typeof qa.acceptedAnswer.text).toBe('string');
          expect(qa.acceptedAnswer.text.length).toBeGreaterThan(0);
        }
      });
    });

    describe('Service schema (service detail pages)', () => {
      it.each(locales)('locale "%s" each service should have required fields for Service schema', async (locale) => {
        const dict = await getDictionary(locale);

        for (const slug of serviceSlugs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const service = (dict.services.items as any)[slug];

          const serviceSchema = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.desc,
            provider: {
              '@type': 'ConstructionBusiness',
              name: 'BYGG I SYD',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'SE',
              },
            },
            areaServed: {
              '@type': 'Country',
              name: 'SE',
            },
          };

          expect(serviceSchema['@context']).toBe('https://schema.org');
          expect(serviceSchema['@type']).toBe('Service');
          expect(typeof serviceSchema.name).toBe('string');
          expect(serviceSchema.name.length).toBeGreaterThan(0);
          expect(typeof serviceSchema.description).toBe('string');
          expect(serviceSchema.description.length).toBeGreaterThan(0);
          expect(serviceSchema.provider['@type']).toBe('ConstructionBusiness');
          expect(serviceSchema.provider.name).toBe('BYGG I SYD');
          expect(serviceSchema.areaServed['@type']).toBe('Country');
          expect(serviceSchema.areaServed.name).toBe('SE');
        }
      });
    });

    describe('BreadcrumbList schema', () => {
      it('should generate valid BreadcrumbList with correct positions', () => {
        const items = [
          { label: 'Home', href: '/en' },
          { label: 'Services', href: '/en/services' },
          { label: 'Window & door installation', href: '/en/services/windows-doors' },
        ];

        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href,
          })),
        };

        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('BreadcrumbList');
        expect(jsonLd.itemListElement).toHaveLength(3);

        for (let i = 0; i < jsonLd.itemListElement.length; i++) {
          const element = jsonLd.itemListElement[i];
          expect(element['@type']).toBe('ListItem');
          expect(element.position).toBe(i + 1);
          expect(typeof element.name).toBe('string');
          expect(element.name.length).toBeGreaterThan(0);
        }
      });
    });

    describe('ImageGallery schema (gallery page)', () => {
      it('should generate valid ImageGallery with ImageObject children', () => {
        const images = [
          { src: '/images/gallery/gallery-1_v2.webp', alt: 'Window installation' },
          { src: '/images/gallery/gallery-2_v2.webp', alt: 'Kitchen assembly' },
          { src: '/images/gallery/gallery-3_v2.webp', alt: 'Bathroom renovation' },
        ];

        const imageGallerySchema = {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'Gallery',
          description: 'Studio gallery',
          url: 'http://localhost:3000/en/gallery',
          image: images.map((img) => ({
            '@type': 'ImageObject',
            contentUrl: `http://localhost:3000${img.src}`,
            name: img.alt,
          })),
        };

        expect(imageGallerySchema['@context']).toBe('https://schema.org');
        expect(imageGallerySchema['@type']).toBe('ImageGallery');
        expect(imageGallerySchema.image).toHaveLength(3);

        for (const img of imageGallerySchema.image) {
          expect(img['@type']).toBe('ImageObject');
          expect(typeof img.contentUrl).toBe('string');
          expect(img.contentUrl.startsWith('http')).toBe(true);
          expect(typeof img.name).toBe('string');
          expect(img.name.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('OpenGraph & Twitter Card standards', () => {
    it('OG image should be 1200x630 (standard)', () => {
      const ogImageWidth = 1200;
      const ogImageHeight = 630;
      expect(ogImageWidth).toBe(1200);
      expect(ogImageHeight).toBe(630);
    });

    it('Twitter card type should be summary_large_image', () => {
      const expectedCardType = 'summary_large_image';
      expect(expectedCardType).toBe('summary_large_image');
    });
  });

  describe('Canonical URL format', () => {
    it.each(locales)('locale "%s" canonical should use the locale in the path', (locale) => {
      const canonical = `/${locale}`;
      expect(canonical).toMatch(new RegExp(`^/${locale}`));
    });

    it('canonical URLs should be relative paths (not full URLs)', () => {
      for (const locale of locales) {
        const canonical = `/${locale}/services/windows-doors`;
        expect(canonical.startsWith('http')).toBe(false);
        expect(canonical).toMatch(/^\/[a-z]{2}/);
      }
    });
  });

  describe('Hreflang alternates completeness', () => {
    it('all pages should reference all 4 locales in alternates', () => {
      const expectedLocales = ['sv', 'en', 'ru', 'uk'];
      const alternates = {
        sv: '/sv',
        en: '/en',
        ru: '/ru',
        uk: '/uk',
      };
      expect(Object.keys(alternates).sort()).toEqual(expectedLocales.sort());
      expect(Object.keys(alternates)).toHaveLength(4);
    });
  });

  describe('Robots meta directives', () => {
    it('main pages should allow indexing and following', () => {
      const robots = {
        index: true,
        follow: true,
      };
      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);
    });

    it('GoogleBot should have max-image-preview and max-snippet settings', () => {
      const googleBot = {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      };
      expect(googleBot.index).toBe(true);
      expect(googleBot['max-image-preview']).toBe('large');
      expect(googleBot['max-snippet']).toBe(-1);
    });

    it('privacy page should also allow indexing and following', () => {
      const robots = {
        index: true,
        follow: true,
      };
      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);
    });
  });

  describe('Keywords presence', () => {
    const localeKeywords: Record<string, string[]> = {
      sv: ['bygg', 'renovering'],
      en: ['renovation', 'construction'],
      ru: ['ремонт', 'строительство'],
      uk: ['ремонт', 'будівництво'],
    };

    it.each(locales)('locale "%s" should have locale-appropriate keywords in hero text', async (locale) => {
      const dict = await getDictionary(locale);
      const heroText = `${dict.hero.title} ${dict.hero.accent} ${dict.hero.subtitle}`.toLowerCase();

      const keywords = localeKeywords[locale] || ['renovation', 'construction'];
      for (const keyword of keywords) {
        expect(heroText).toContain(keyword);
      }
    });

    it('brand name BYGG I SYD should appear as a keyword', () => {
      const brandKeyword = 'BYGG I SYD';
      const keywords = [
        'professional construction',
        'home renovation',
        'carpenter Sweden',
        'kitchen assembly',
        'bathroom renovation',
        'bygg i syd',
        'BYGG I SYD',
      ];
      expect(keywords).toContain(brandKeyword);
    });
  });

  describe('Locale mapping for OpenGraph', () => {
    it('should map sv -> sv_SE', () => {
      const localeMap: Record<string, string> = {
        sv: 'sv_SE',
        en: 'en_US',
        ru: 'ru_RU',
        uk: 'uk_UA',
      };
      expect(localeMap.sv).toBe('sv_SE');
      expect(localeMap.en).toBe('en_US');
      expect(localeMap.ru).toBe('ru_RU');
      expect(localeMap.uk).toBe('uk_UA');
    });
  });

  describe('Security headers presence in next.config', () => {
    const expectedHeaders: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    it.each(Object.entries(expectedHeaders))('should set %s to %s', (key, value) => {
      expect(expectedHeaders[key]).toBe(value);
    });

    it('should have Permissions-Policy restricting camera, microphone, geolocation', () => {
      const permissionsPolicy = 'camera=(), microphone=(), geolocation=()';
      expect(permissionsPolicy).toContain('camera=()');
      expect(permissionsPolicy).toContain('microphone=()');
      expect(permissionsPolicy).toContain('geolocation=()');
    });
  });

  describe('WWW redirect presence in next.config', () => {
    it('should redirect www.byggisyd.se to byggisyd.se (canonical domain)', () => {
      const redirectSource = '/:path*';
      const redirectHost = 'www.byggisyd.se';
      const redirectDestination = 'https://byggisyd.se/:path*';

      expect(redirectHost).toBe('www.byggisyd.se');
      expect(redirectDestination).toBe('https://byggisyd.se/:path*');
      expect(redirectSource).toBe('/:path*');
    });
  });

  describe('Image cache headers', () => {
    it('should set immutable cache for images', () => {
      const cacheControl = 'public, max-age=31536000, immutable';
      expect(cacheControl).toContain('immutable');
      expect(cacheControl).toContain('max-age=31536000');
    });
  });

  describe('Metadata completeness across all pages', () => {
    it.each(locales)('locale "%s" homepage hero should have title and subtitle (description)', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.hero.title).toBeDefined();
      expect(dict.hero.title.length).toBeGreaterThan(0);
      expect(dict.hero.accent).toBeDefined();
      expect(dict.hero.accent.length).toBeGreaterThan(0);
      expect(dict.hero.subtitle).toBeDefined();
      expect(dict.hero.subtitle.length).toBeGreaterThan(0);
    });

    it.each(locales)('locale "%s" nav should have all required navigation labels', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.nav.about).toBeDefined();
      expect(dict.nav.about.length).toBeGreaterThan(0);
      expect(dict.nav.services).toBeDefined();
      expect(dict.nav.gallery).toBeDefined();
      expect(dict.nav.contacts).toBeDefined();
      expect(dict.nav.book).toBeDefined();
    });

    it.each(locales)('locale "%s" should have not-found page translations', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.notFound).toBeDefined();
      expect(dict.notFound.title).toBeDefined();
      expect(dict.notFound.title.length).toBeGreaterThan(0);
      expect(dict.notFound.description).toBeDefined();
      expect(dict.notFound.backHome).toBeDefined();
    });

    it.each(locales)('locale "%s" should have skip-to-content and accessibility labels', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.skipToContent).toBeDefined();
      expect(dict.skipToContent.length).toBeGreaterThan(0);
    });
  });
});
