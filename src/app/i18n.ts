import 'server-only';

export type Locale = 'sv' | 'en' | 'no' | 'ru' | 'uk';

const dictionaries = {
  sv: () => import('../dictionaries/sv.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  no: () => import('../dictionaries/no.json').then((module) => module.default),
  ru: () => import('../dictionaries/ru.json').then((module) => module.default),
  uk: () => import('../dictionaries/uk.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries.sv;
  return loader();
};
