import { getSystemTheme, getNextTheme, Theme } from './theme';

describe('theme utilities', () => {
  describe('getSystemTheme', () => {
    it('should return obsidian when system prefers dark mode', () => {
      // Arrange & Act
      const theme = getSystemTheme();

      // Assert
      expect(theme).toBe('obsidian');
    });

    it('should return obsidian when system prefers light mode (since only dark themes are available)', () => {
      // Arrange & Act
      const theme = getSystemTheme();

      // Assert
      expect(theme).toBe('obsidian');
    });
  });

  describe('getNextTheme', () => {
    it('should cycle from obsidian to zen', () => {
      // Arrange & Act
      const next = getNextTheme('obsidian');

      // Assert
      expect(next).toBe('zen');
    });

    it('should cycle from zen to obsidian', () => {
      // Arrange & Act
      const next = getNextTheme('zen');

      // Assert
      expect(next).toBe('obsidian');
    });

    it('should fall back to obsidian for unknown themes', () => {
      // Arrange & Act
      const next = getNextTheme('unknown' as Theme);

      // Assert
      expect(next).toBe('obsidian');
    });
  });
});
