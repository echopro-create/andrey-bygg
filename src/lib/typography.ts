// Typographic rules for line distribution (preventing orphaned words / prepositions hanging)
// This function recursively processes all string values in a dictionary.

export function formatTypographyString(text: string, locale: string): string {
  if (typeof text !== 'string') return text;

  // Skip strings that look like:
  // - single words (no spaces)
  // - HTML tags (just in case)
  // - emails, phone numbers, URLs, or icon classnames/paths
  if (!text.includes(' ') || text.includes('://') || text.includes('@') || /^\+?[0-9\s-]{5,}$/.test(text)) {
    return text;
  }

  let formatted = text;

  // 1. Replace spaces after 1-2 letter words with non-breaking spaces (\u00A0).
  // Matches any 1-2 letter word (Cyrillic or Latin) starting a string or preceded by space/punctuation,
  // followed by one or more regular spaces.
  // We use [a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ] to cover Swedish, English, Russian, and Ukrainian letters.
  const word1or2Regex = /(?<=^|[\s"'(«])([a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ]{1,2})\s+/g;
  formatted = formatted.replace(word1or2Regex, (match, word) => {
    const lower = word.toLowerCase();
    if (lower === 'бы' || lower === 'ли' || lower === 'же' || lower === 'б' || lower === 'ж') {
      return match;
    }
    return word + '\u00A0';
  });

  // 2. Specific 3-letter prepositions/conjunctions/words that shouldn't hang:
  // - Russian: для, под, над, без, при, про, что, как, все, кто
  // - Ukrainian: або, але, від, для, між, над, під, при, про, чим, що
  // - Swedish: och, att, men, som, med, för, vid, mot, hos, ett, den, det, hon, han, jag, dig, mig, sig
  // - English: the, and, for, but, yet, you, our, are, was, all, not, out, how, who, can, now, new, her, his, him, one
  const words3 = [
    // Russian
    'для', 'под', 'над', 'без', 'при', 'про', 'что', 'как', 'все', 'кто',
    // Ukrainian
    'або', 'але', 'від', 'між', 'під', 'чим', 'що',
    // Swedish
    'och', 'att', 'men', 'som', 'med', 'för', 'vid', 'mot', 'hos', 'ett', 'den', 'det', 'hon', 'han', 'jag', 'dig', 'mig', 'sig',
    // English
    'the', 'and', 'for', 'but', 'yet', 'you', 'our', 'are', 'was', 'all', 'not', 'out', 'how', 'who', 'can', 'now', 'new', 'her', 'his', 'him', 'one'
  ];

  // We build a case-insensitive regex for these 3-letter words
  const words3Regex = new RegExp(`(?<=^|[\\s"'(«])(${words3.join('|')})\\s+`, 'gi');
  formatted = formatted.replace(words3Regex, '$1\u00A0');

  // 3. Bind particles in Russian/Ukrainian: "бы", "ли", "же"
  // They should be bound to the preceding word.
  if (locale === 'ru' || locale === 'uk') {
    const particlesRegex = /\s+(бы|ли|же)(?=\s|[.,!?;:]|$)/g;
    formatted = formatted.replace(particlesRegex, '\u00A0$1');
  }

  // 4. Bind numbers to their units/words (e.g. "10 км", "10+", "2026 г.")
  // Match a digit (possibly followed by + or %), followed by a space and then a word.
  const numberUnitRegex = /(\b\d+[%+]?)\s+([a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ]+)/g;
  formatted = formatted.replace(numberUnitRegex, '$1\u00A0$2');

  // 5. Clean up any double non-breaking spaces or trailing ones
  formatted = formatted.replace(/\u00A0+/g, '\u00A0');

  return formatted;
}

export function formatTypographyObject<T>(obj: T, locale: string): T {
  if (typeof obj === 'string') {
    return formatTypographyString(obj, locale) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => formatTypographyObject(item, locale)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      result[key] = formatTypographyObject((obj as Record<string, unknown>)[key], locale);
    }
    return result as unknown as T;
  }
  return obj;
}
