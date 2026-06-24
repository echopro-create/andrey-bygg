import { formatTypographyString, formatTypographyObject } from './typography';

describe('Typography Formatter', () => {
  describe('formatTypographyString', () => {
    it('should bind 1-2 letter prepositions with a non-breaking space', () => {
      // Arrange
      const input = 'О нас и о нашем доме в Швеции';
      const expected = 'О\u00A0нас и\u00A0о\u00A0нашем доме в\u00A0Швеции';

      // Act
      const result = formatTypographyString(input, 'ru');

      // Assert
      expect(result).toBe(expected);
    });

    it('should bind 3-letter prepositions/conjunctions', () => {
      // Arrange
      const input = 'Ремонт для вас под ключ';
      const expected = 'Ремонт для\u00A0вас под\u00A0ключ';

      // Act
      const result = formatTypographyString(input, 'ru');

      // Assert
      expect(result).toBe(expected);
    });

    it('should bind Swedish prepositions and conjunctions', () => {
      // Arrange
      const input = 'Professionella byggtjänster i Sverige och andra regioner med garanti';
      const expected = 'Professionella byggtjänster i\u00A0Sverige och\u00A0andra regioner med\u00A0garanti';

      // Act
      const result = formatTypographyString(input, 'sv');

      // Assert
      expect(result).toBe(expected);
    });

    it('should bind Russian particles like бы, ли, же to preceding words', () => {
      // Arrange
      const input = 'Если бы мы могли прийти же завтра';
      const expected = 'Если\u00A0бы мы\u00A0могли прийти\u00A0же завтра'; // note: 'мы' is 2-letter so bound to 'могли', 'бы' and 'же' bound to preceding

      // Act
      const result = formatTypographyString(input, 'ru');

      // Assert
      expect(result).toBe(expected);
    });

    it('should bind numbers and units together', () => {
      // Arrange
      const input = 'Опыт работы 10+ лет и гарантия 5 лет';
      const expected = 'Опыт работы 10+\u00A0лет и\u00A0гарантия 5\u00A0лет';

      // Act
      const result = formatTypographyString(input, 'ru');

      // Assert
      expect(result).toBe(expected);
    });

    it('should skip email, phone numbers, and URLs', () => {
      // Arrange
      const email = 'info@andreybygg.se';
      const phone = '+46 70 123 45 67';
      const url = 'https://andreybygg.se/services/painting';

      // Act & Assert
      expect(formatTypographyString(email, 'sv')).toBe(email);
      expect(formatTypographyString(phone, 'sv')).toBe(phone);
      expect(formatTypographyString(url, 'sv')).toBe(url);
    });
  });

  describe('formatTypographyObject', () => {
    it('should recursively format nested dictionaries', () => {
      // Arrange
      const input = {
        title: 'Услуги по ремонту',
        nested: {
          subtitle: 'Ремонт ванных комнат в Лахольме',
          list: ['Монтаж окон', 'Плиточные работы в Сконе']
        }
      };
      const expected = {
        title: 'Услуги по\u00A0ремонту',
        nested: {
          subtitle: 'Ремонт ванных комнат в\u00A0Лахольме',
          list: ['Монтаж окон', 'Плиточные работы в\u00A0Сконе']
        }
      };

      // Act
      const result = formatTypographyObject(input, 'ru');

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
