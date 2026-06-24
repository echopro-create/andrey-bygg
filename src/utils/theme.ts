export type Theme = 'obsidian';

/**
 * Определяет тему по умолчанию на основе системных настроек.
 * Возвращает 'obsidian'.
 */
export function getSystemTheme(): Theme {
  return 'obsidian';
}

/**
 * Возвращает следующую тему: всегда 'obsidian'.
 */
export function getNextTheme(): Theme {
  return 'obsidian';
}
