import sitemap from './sitemap';

describe('sitemap.xml generation', () => {
  let entries: ReturnType<typeof sitemap>;

  beforeAll(() => {
    entries = sitemap();
  });

  it('should generate entries for all locales and pages', () => {
    expect(entries).toBeDefined();
    expect(Array.isArray(entries)).toBe(true);
  });

  describe('Homepage entries', () => {
    it('should have 4 homepage entries (one per locale)', () => {
      const homepageEntries = entries.filter(
        (e) =>
          !e.url.includes('/services/') &&
          !e.url.includes('/gallery') &&
          !e.url.includes('/contacts') &&
          !e.url.includes('/privacy') &&
          e.url.match(/\/[a-z]{2}$/)
      );
      expect(homepageEntries).toHaveLength(4);
    });

    it('each homepage should have priority 1', () => {
      const homepageEntries = entries.filter(
        (e) =>
          !e.url.includes('/services/') &&
          !e.url.includes('/gallery') &&
          !e.url.includes('/contacts') &&
          !e.url.includes('/privacy') &&
          e.url.match(/\/[a-z]{2}$/)
      );
      for (const entry of homepageEntries) {
        expect(entry.priority).toBe(1);
      }
    });

    it('each homepage should have changeFrequency weekly', () => {
      const homepageEntries = entries.filter(
        (e) =>
          !e.url.includes('/services/') &&
          !e.url.includes('/gallery') &&
          !e.url.includes('/contacts') &&
          !e.url.includes('/privacy') &&
          e.url.match(/\/[a-z]{2}$/)
      );
      for (const entry of homepageEntries) {
        expect(entry.changeFrequency).toBe('weekly');
      }
    });

    it('each homepage should have hreflang alternates for all 4 locales', () => {
      const homepageEntries = entries.filter(
        (e) =>
          !e.url.includes('/services/') &&
          !e.url.includes('/gallery') &&
          !e.url.includes('/contacts') &&
          !e.url.includes('/privacy') &&
          e.url.match(/\/[a-z]{2}$/)
      );
      for (const entry of homepageEntries) {
        expect(entry.alternates).toBeDefined();
        expect(entry.alternates!.languages).toBeDefined();
        const langs = entry.alternates!.languages!;
        expect(Object.keys(langs)).toHaveLength(4);
        expect(langs.sv).toMatch(/\/sv$/);
        expect(langs.en).toMatch(/\/en$/);
        expect(langs.ru).toMatch(/\/ru$/);
        expect(langs.uk).toMatch(/\/uk$/);
      }
    });

    it('each homepage should have a valid lastModified date', () => {
      const homepageEntries = entries.filter(
        (e) =>
          !e.url.includes('/services/') &&
          !e.url.includes('/gallery') &&
          !e.url.includes('/contacts') &&
          !e.url.includes('/privacy') &&
          e.url.match(/\/[a-z]{2}$/)
      );
      for (const entry of homepageEntries) {
        expect(entry.lastModified).toBeInstanceOf(Date);
      }
    });
  });

  describe('Gallery entries', () => {
    it('should have 4 gallery entries', () => {
      const galleryEntries = entries.filter((e) => e.url.includes('/gallery'));
      expect(galleryEntries).toHaveLength(4);
    });

    it('each gallery entry should have priority 0.7', () => {
      const galleryEntries = entries.filter((e) => e.url.includes('/gallery'));
      for (const entry of galleryEntries) {
        expect(entry.priority).toBe(0.7);
      }
    });

    it('each gallery entry should have changeFrequency monthly', () => {
      const galleryEntries = entries.filter((e) => e.url.includes('/gallery'));
      for (const entry of galleryEntries) {
        expect(entry.changeFrequency).toBe('monthly');
      }
    });

    it('each gallery entry should have hreflang alternates', () => {
      const galleryEntries = entries.filter((e) => e.url.includes('/gallery'));
      for (const entry of galleryEntries) {
        expect(entry.alternates!.languages).toBeDefined();
        expect(Object.keys(entry.alternates!.languages!)).toHaveLength(4);
      }
    });
  });

  describe('Contacts entries', () => {
    it('should have 4 contacts entries', () => {
      const contactsEntries = entries.filter((e) => e.url.includes('/contacts'));
      expect(contactsEntries).toHaveLength(4);
    });

    it('each contacts entry should have priority 0.9', () => {
      const contactsEntries = entries.filter((e) => e.url.includes('/contacts'));
      for (const entry of contactsEntries) {
        expect(entry.priority).toBe(0.9);
      }
    });

    it('each contacts entry should have changeFrequency monthly', () => {
      const contactsEntries = entries.filter((e) => e.url.includes('/contacts'));
      for (const entry of contactsEntries) {
        expect(entry.changeFrequency).toBe('monthly');
      }
    });
  });

  describe('Privacy entries', () => {
    it('should have 4 privacy entries', () => {
      const privacyEntries = entries.filter((e) => e.url.includes('/privacy'));
      expect(privacyEntries).toHaveLength(4);
    });

    it('each privacy entry should have priority 0.3', () => {
      const privacyEntries = entries.filter((e) => e.url.includes('/privacy'));
      for (const entry of privacyEntries) {
        expect(entry.priority).toBe(0.3);
      }
    });

    it('each privacy entry should have changeFrequency yearly', () => {
      const privacyEntries = entries.filter((e) => e.url.includes('/privacy'));
      for (const entry of privacyEntries) {
        expect(entry.changeFrequency).toBe('yearly');
      }
    });
  });

  describe('Service entries', () => {
    const expectedServices = [
      'windows-doors',
      'kitchen-assembly',
      'bathroom-renovation',
      'tiling',
      'painting',
      'roofing-woodwork',
    ];

    it('should have 24 service entries (6 services x 4 locales)', () => {
      const serviceEntries = entries.filter((e) => e.url.includes('/services/'));
      expect(serviceEntries).toHaveLength(24);
    });

    it('each service entry should have priority 0.8', () => {
      const serviceEntries = entries.filter((e) => e.url.includes('/services/'));
      for (const entry of serviceEntries) {
        expect(entry.priority).toBe(0.8);
      }
    });

    it('each service entry should have changeFrequency monthly', () => {
      const serviceEntries = entries.filter((e) => e.url.includes('/services/'));
      for (const entry of serviceEntries) {
        expect(entry.changeFrequency).toBe('monthly');
      }
    });

    it('should cover all 6 service slugs in all locales', () => {
      const serviceEntries = entries.filter((e) => e.url.includes('/services/'));
      for (const slug of expectedServices) {
        for (const lang of ['sv', 'en', 'ru', 'uk']) {
          const found = serviceEntries.some(
            (e) => e.url === `http://localhost:3000/${lang}/services/${slug}`
          );
          expect(found).toBe(true);
        }
      }
    });

    it('each service entry should have hreflang alternates for all 4 locales', () => {
      const serviceEntries = entries.filter((e) => e.url.includes('/services/'));
      for (const entry of serviceEntries) {
        expect(entry.alternates).toBeDefined();
        expect(Object.keys(entry.alternates!.languages!)).toHaveLength(4);
      }
    });
  });

  describe('Total entries count', () => {
    it('should have exactly 44 entries (5 pages + 6 services) x 4 locales', () => {
      expect(entries).toHaveLength(44);
    });
  });

  describe('URL format', () => {
    it('all URLs should use the SITE_URL as base', () => {
      for (const entry of entries) {
        expect(entry.url).toMatch(/^https?:\/\/.+/);
      }
    });

    it('all URLs should include a locale segment', () => {
      for (const entry of entries) {
        expect(entry.url).toMatch(/\/(sv|en|ru|uk)(\/|$)/);
      }
    });

    it('no duplicate URLs should exist', () => {
      const urls = entries.map((e) => e.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(urls.length);
    });
  });
});
