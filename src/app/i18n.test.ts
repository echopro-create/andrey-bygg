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
          const homeTitle = `${dict.hero.title} ${dict.hero.accent} — RYGGHJÄLP`;
          expect(homeTitle.length).toBeGreaterThanOrEqual(35);
          expect(homeTitle.length).toBeLessThanOrEqual(70);
          expect(dict.hero.subtitle.length).toBeGreaterThanOrEqual(100);
          expect(dict.hero.subtitle.length).toBeLessThanOrEqual(160);

          // 2. Contacts
          const contactsTitle = `${dict.contacts.title} ${dict.contacts.accent} — RYGGHJÄLP`;
          expect(contactsTitle.length).toBeGreaterThanOrEqual(15);
          expect(contactsTitle.length).toBeLessThanOrEqual(70);
          const contactsDesc = dict.contacts.subtitle || '';
          expect(contactsDesc.length).toBeGreaterThanOrEqual(25);
          expect(contactsDesc.length).toBeLessThanOrEqual(160);

          // 3. Gallery
          const galleryTitle = `${dict.nav.gallery} — RYGGHJÄLP`;
          expect(galleryTitle.length).toBeGreaterThanOrEqual(15);
          expect(galleryTitle.length).toBeLessThanOrEqual(70);
          const galleryDesc = dict.gallery?.subtitle || '';
          expect(galleryDesc.length).toBeGreaterThanOrEqual(25);
          expect(galleryDesc.length).toBeLessThanOrEqual(160);

          // 4. Privacy
          const privacyTitle = `${dict.privacy.title} — RYGGHJÄLP`;
          expect(privacyTitle.length).toBeGreaterThanOrEqual(15);
          expect(privacyTitle.length).toBeLessThanOrEqual(70);
          const privacyDesc = dict.privacy.subtitle || '';
          expect(privacyDesc.length).toBeGreaterThanOrEqual(25);
          expect(privacyDesc.length).toBeLessThanOrEqual(160);
        });
      });
    });
  });
});
