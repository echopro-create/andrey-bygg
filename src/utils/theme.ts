export type Theme = 'obsidian' | 'zen' | 'light';

/**
 * Определяет тему по умолчанию на основе системных настроек prefers-color-scheme.
 */
export function getSystemTheme(matchesDark: boolean): Theme {
  return matchesDark ? 'obsidian' : 'light';
}

/**
 * Возвращает следующую тему в циклическом переключателе:
 * light -> obsidian -> zen -> light
 */
export function getNextTheme(currentTheme: Theme): Theme {
  switch (currentTheme) {
    case 'light':
      return 'obsidian';
    case 'obsidian':
      return 'zen';
    case 'zen':
      return 'light';
    default:
      return 'obsidian';
  }
}
