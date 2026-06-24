import { getSystemTheme, getNextTheme } from './theme';

describe('theme utilities', () => {
  describe('getSystemTheme', () => {
    it('should return obsidian', () => {
      // Arrange & Act
      const theme = getSystemTheme();

      // Assert
      expect(theme).toBe('obsidian');
    });
  });

  describe('getNextTheme', () => {
    it('should always return obsidian', () => {
      // Arrange & Act
      const next = getNextTheme();

      // Assert
      expect(next).toBe('obsidian');
    });
  });
});
