import { getSystemTheme, getNextTheme, Theme } from './theme';

describe('theme utilities', () => {
  describe('getSystemTheme', () => {
    it('should return obsidian when system prefers dark mode', () => {
      // Arrange & Act
      const theme = getSystemTheme(true);

      // Assert
      expect(theme).toBe('obsidian');
    });

    it('should return light when system prefers light mode', () => {
      // Arrange & Act
      const theme = getSystemTheme(false);

      // Assert
      expect(theme).toBe('light');
    });
  });

  describe('getNextTheme', () => {
    it('should cycle from light to obsidian', () => {
      // Arrange & Act
      const next = getNextTheme('light');

      // Assert
      expect(next).toBe('obsidian');
    });

    it('should cycle from obsidian to zen', () => {
      // Arrange & Act
      const next = getNextTheme('obsidian');

      // Assert
      expect(next).toBe('zen');
    });

    it('should cycle from zen to light', () => {
      // Arrange & Act
      const next = getNextTheme('zen');

      // Assert
      expect(next).toBe('light');
    });

    it('should fall back to obsidian for unknown themes', () => {
      // Arrange & Act
      const next = getNextTheme('unknown' as Theme);

      // Assert
      expect(next).toBe('obsidian');
    });
  });
});
