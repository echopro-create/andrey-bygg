export type Theme = 'obsidian' | 'zen';

/**
 * Определяет тему по умолчанию на основе системных настроек prefers-color-scheme.
 * Поскольку доступны только темные темы, возвращает 'obsidian'.
 */
export function getSystemTheme(): Theme {
  return 'obsidian';
}

/**
 * Возвращает следующую тему в циклическом переключателе:
 * obsidian -> zen -> obsidian
 */
export function getNextTheme(currentTheme: Theme): Theme {
  switch (currentTheme) {
    case 'obsidian':
      return 'zen';
    case 'zen':
      return 'obsidian';
    default:
      return 'obsidian';
  }
}
