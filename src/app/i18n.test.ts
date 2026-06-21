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
});
