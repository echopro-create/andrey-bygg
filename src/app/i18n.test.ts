jest.mock('server-only', () => ({}));
import { getDictionary, Locale } from './i18n';

describe('i18n dictionary loader', () => {
  it('should load English dictionary successfully', async () => {
    // Arrange
    const locale: Locale = 'en';

    // Act
    const dict = await getDictionary(locale);

    // Assert
    expect(dict).toBeDefined();
    expect(dict.nav).toBeDefined();
    expect(dict.nav.about).toBe('About');
    expect(dict.nav.services).toBe('Services');
    expect(dict.hero.accent).toBe('body & soul');
  });

  it('should load Swedish dictionary successfully', async () => {
    // Arrange
    const locale: Locale = 'sv';

    // Act
    const dict = await getDictionary(locale);

    // Assert
    expect(dict).toBeDefined();
    expect(dict.nav.about).toBe('Om mig');
    expect(dict.nav.services).toBe('Tjänster');
  });

  it('should load Russian dictionary successfully', async () => {
    // Arrange
    const locale: Locale = 'ru';

    // Act
    const dict = await getDictionary(locale);

    // Assert
    expect(dict).toBeDefined();
    expect(dict.nav.about).toBe('О мастере');
  });

  it('should load Norwegian dictionary successfully', async () => {
    // Arrange
    const locale: Locale = 'no';

    // Act
    const dict = await getDictionary(locale);

    // Assert
    expect(dict).toBeDefined();
    expect(dict.nav.about).toBe('Om meg');
  });

  it('should load Ukrainian dictionary successfully', async () => {
    // Arrange
    const locale: Locale = 'uk';

    // Act
    const dict = await getDictionary(locale);

    // Assert
    expect(dict).toBeDefined();
    expect(dict.nav.about).toBe('Про майстра');
  });

  describe('SEO standards verification (2026)', () => {
    const locales: Locale[] = ['sv', 'en', 'no', 'ru', 'uk'];

    locales.forEach((locale) => {
      describe(`Locale: ${locale}`, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dict: any;

        beforeAll(async () => {
          dict = await getDictionary(locale);
        });

        it('should validate service pages metadata limits', () => {
          const services = dict.services.items;
          Object.keys(services).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const service = (services as any)[key];
            const rawTitle = service.seo_title || service.title;
            const fullTitle = `${rawTitle} — RYGGHJÄLP`;

            // Title checks (Optimal: 50-60 chars, safe max: 70 chars)
            expect(rawTitle).toBeDefined();
            expect(rawTitle).not.toContain('RYGGHJÄLP');
            expect(fullTitle.length).toBeGreaterThanOrEqual(35);
            expect(fullTitle.length).toBeLessThanOrEqual(70);

            // Description checks (Optimal: 110-160 chars)
            const description = service.seo_desc || service.desc;
            expect(description).toBeDefined();
            expect(description.length).toBeGreaterThanOrEqual(80);
            expect(description.length).toBeLessThanOrEqual(160);
          });
        });

        it('should validate main pages metadata limits', () => {
          // 1. Homepage
          // Главная страница использует дефолтный тайтл без шаблона (37-43 симв.)
          const homeTitle = `${dict.hero.title} ${dict.hero.accent}`;
          expect(homeTitle.length).toBeGreaterThanOrEqual(35);
          expect(homeTitle.length).toBeLessThanOrEqual(70);
          expect(dict.hero.subtitle.length).toBeGreaterThanOrEqual(80);
          expect(dict.hero.subtitle.length).toBeLessThanOrEqual(160);

          // 2. Contacts
          const contactsRawTitle = dict.contacts.seo_title || `${dict.contacts.title} ${dict.contacts.accent}`;
          const contactsFullTitle = `${contactsRawTitle} — RYGGHJÄLP`;
          expect(contactsRawTitle).not.toContain('RYGGHJÄLP');
          expect(contactsFullTitle.length).toBeGreaterThanOrEqual(35);
          expect(contactsFullTitle.length).toBeLessThanOrEqual(70);
          
          const contactsDesc = dict.contacts.seo_desc || dict.contacts.subtitle || '';
          expect(contactsDesc.length).toBeGreaterThanOrEqual(80);
          expect(contactsDesc.length).toBeLessThanOrEqual(160);

          // 3. Gallery
          const galleryRawTitle = dict.gallery?.seo_title || dict.nav.gallery;
          const galleryFullTitle = `${galleryRawTitle} — RYGGHJÄLP`;
          expect(galleryRawTitle).not.toContain('RYGGHJÄLP');
          expect(galleryFullTitle.length).toBeGreaterThanOrEqual(35);
          expect(galleryFullTitle.length).toBeLessThanOrEqual(70);
          
          const galleryDesc = dict.gallery?.seo_desc || dict.gallery?.subtitle || '';
          expect(galleryDesc.length).toBeGreaterThanOrEqual(80);
          expect(galleryDesc.length).toBeLessThanOrEqual(160);

          // 4. Privacy
          const privacyRawTitle = dict.privacy.seo_title || dict.privacy.title;
          const privacyFullTitle = `${privacyRawTitle} — RYGGHJÄLP`;
          expect(privacyRawTitle).not.toContain('RYGGHJÄLP');
          expect(privacyFullTitle.length).toBeGreaterThanOrEqual(35);
          expect(privacyFullTitle.length).toBeLessThanOrEqual(70);
          
          const privacyDesc = dict.privacy.seo_desc || dict.privacy.subtitle || '';
          expect(privacyDesc.length).toBeGreaterThanOrEqual(80);
          expect(privacyDesc.length).toBeLessThanOrEqual(160);
        });
      });
    });
  });
});
