import 'server-only';
import { locales } from '@/lib/config';
import type { Dict } from '@/lib/config';

export type Locale = (typeof locales)[number];

const dictionaries: Record<string, () => Promise<Dict>> = {
  sv: () => import('../dictionaries/sv.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ru: () => import('../dictionaries/ru.json').then((module) => module.default),
  uk: () => import('../dictionaries/uk.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dict> => {
  if (!dictionaries[locale]) {
    console.warn(`[i18n] Unknown locale "${locale}", falling back to "sv".`);
    return dictionaries.sv();
  }
  return dictionaries[locale]();
};
