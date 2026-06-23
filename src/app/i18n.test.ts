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

  describe('SEO titles rules', () => {
    const locales: Locale[] = ['sv', 'en', 'no', 'ru', 'uk'];

    locales.forEach((locale) => {
      it(`should check that all service seo_title strings in ${locale} dictionary are valid`, async () => {
        // Arrange & Act
        const dict = await getDictionary(locale);
        const services = dict.services.items;

        // Assert
        Object.keys(services).forEach((key) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const service = (services as any)[key];
          if (service.seo_title) {
            // 1. Length constraint: seo_title should not be too long
            // Max allowed length is 55 so that with " — RYGGHJÄLP" (12 chars) it is <= 67 chars.
            expect(service.seo_title.length).toBeLessThanOrEqual(55);

            // 2. No brand duplicate constraint: seo_title should not contain RYGGHJÄLP
            expect(service.seo_title).not.toContain('RYGGHJÄLP');
          }
        });
      });
    });
  });
});
