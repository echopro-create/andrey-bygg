import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['sv', 'en', 'no', 'ru', 'uk'];
const defaultLocale = 'sv';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  try {
    const parsedLocales = acceptLanguage.split(',')
      .map(lang => {
        const parts = lang.split(';');
        const locale = parts[0].trim().split('-')[0];
        const q = parts[1] && parts[1].startsWith('q=') ? parseFloat(parts[1].substring(2)) : 1.0;
        return { locale, q };
      })
      .sort((a, b) => b.q - a.q);

    for (const { locale } of parsedLocales) {
      if (locales.includes(locale)) {
        return locale;
      }
    }
  } catch {
    // Игнорируем ошибки парсинга и возвращаем локаль по умолчанию
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, есть ли уже локаль в пути
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Пропускаем служебные файлы, изображения, favicon и API-роуты
  if (
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Перенаправляем на URL с автоопределенной локалью
  const locale = getLocale(request);
  
  // Создаем URL перенаправления
  const redirectUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Применяем proxy ко всем путям, кроме статики и внутренних путей Next.js
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
