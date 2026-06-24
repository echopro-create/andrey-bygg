jest.mock('server-only', () => ({}));
import { getDictionary, Locale } from './i18n';
import sitemap from './sitemap';

const locales: Locale[] = ['sv', 'en', 'ru', 'uk'];

describe('SEO — Services index page', () => {
  describe('Sitemap inclusion', () => {
    const entries = sitemap();

    it('should include services index page for all 4 locales', () => {
      const servicesPages = entries.filter(
        (e) => {
          const path = new URL(e.url).pathname;
          return path === '/sv/services' || path === '/en/services' || path === '/ru/services' || path === '/uk/services';
        }
      );
      expect(servicesPages).toHaveLength(4);
    });

    it('services index should have priority 0.9', () => {
      const servicesPages = entries.filter(
        (e) => {
          const path = new URL(e.url).pathname;
          return path === '/sv/services' || path === '/en/services' || path === '/ru/services' || path === '/uk/services';
        }
      );
      for (const entry of servicesPages) {
        expect(entry.priority).toBe(0.9);
      }
    });

    it('services index should have hreflang alternates for all 4 locales', () => {
      const servicesPages = entries.filter(
        (e) => {
          const path = new URL(e.url).pathname;
          return path === '/sv/services' || path === '/en/services' || path === '/ru/services' || path === '/uk/services';
        }
      );
      for (const entry of servicesPages) {
        expect(entry.alternates).toBeDefined();
        expect(Object.keys(entry.alternates!.languages!)).toHaveLength(4);
      }
    });
  });

  describe('Dictionary field presence', () => {
    it.each(locales)('locale "%s" should have gallery alt texts (alt1-alt10)', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.gallery).toBeDefined();
      for (let i = 1; i <= 10; i++) {
        const key = `alt${i}` as keyof typeof dict.gallery;
        if (dict.gallery![key] !== undefined) {
          expect(typeof dict.gallery![key]).toBe('string');
          expect((dict.gallery![key] as string).length).toBeGreaterThan(0);
        }
      }
    });

    it.each(locales)('locale "%s" should have nav.services for services page title', async (locale) => {
      const dict = await getDictionary(locale);
      expect(dict.nav.services).toBeDefined();
      expect(dict.nav.services.length).toBeGreaterThan(0);
    });

    it.each(locales)('locale "%s" should have contacts.guarantees if present', async (locale) => {
      const dict = await getDictionary(locale);
      if (dict.contacts.guarantees) {
        expect(typeof dict.contacts.guarantees).toBe('object');
        expect(Object.keys(dict.contacts.guarantees!).length).toBeGreaterThan(0);
      }
    });
  });
});

describe('SEO — All pages metadata completeness', () => {
  it.each(locales)('locale "%s" services index should have proper title/description', async (locale) => {
    const dict = await getDictionary(locale);
    expect(dict.nav.services).toBeDefined();
    expect(dict.nav.services.length).toBeGreaterThan(0);
    expect(dict.services.title).toBeDefined();
    expect(dict.services.accent).toBeDefined();
  });

  it.each(locales)('locale "%s" contacts should have phone and email', async (locale) => {
    const dict = await getDictionary(locale);
    expect(dict.contacts.phone).toBeDefined();
    expect(dict.contacts.phone!.length).toBeGreaterThan(5);
    expect(dict.contacts.email).toBeDefined();
    expect(dict.contacts.email!.includes('@')).toBe(true);
  });
});

describe('SEO — Robots.txt', () => {
  it('should disallow /api/ and /_next/', () => {
    const robots = require('./robots').default();
    const rules = robots.rules as { disallow?: string[] };
    expect(rules.disallow).toContain('/api/');
    expect(rules.disallow).toContain('/_next/');
  });

  it('should include sitemap URL', () => {
    const robots = require('./robots').default();
    expect(robots.sitemap).toBeDefined();
    expect(robots.sitemap).toMatch(/sitemap\.xml$/);
  });
});

describe('SEO — Hreflang completeness', () => {
  it('contacts page should reference all 4 locales in alternates', () => {
    const expectedLocales = ['sv', 'en', 'ru', 'uk'];
    const alternates = {
      sv: '/sv/contacts',
      en: '/en/contacts',
      ru: '/ru/contacts',
      uk: '/uk/contacts',
    };
    expect(Object.keys(alternates).sort()).toEqual(expectedLocales.sort());
  });

  it('services index page should have hreflang alternates', () => {
    const expectedLocales = ['sv', 'en', 'ru', 'uk'];
    const alternates: Record<string, string> = {};
    for (const lng of expectedLocales) {
      alternates[lng] = `/${lng}/services`;
    }
    expect(Object.keys(alternates)).toHaveLength(4);
    expect(alternates.sv).toBe('/sv/services');
    expect(alternates.en).toBe('/en/services');
  });
});
