import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary, Locale } from '../i18n';

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lng = (resolvedParams.lng || 'sv') as Locale;

  const titles: Record<string, string> = {
    sv: 'Sidan hittades inte — BYGG I SYD',
    en: 'Page not found — BYGG I SYD',
    ru: 'Страница не найдена — BYGG I SYD',
    uk: 'Сторінку не знайдено — BYGG I SYD',
  };

  return {
    title: titles[lng] || titles.en,
    robots: { index: false, follow: false },
  };
}

interface NotFoundProps {
  params: Promise<{ lng: string }>;
}

export default async function NotFound({ params }: NotFoundProps) {
  let lng: Locale = 'sv';
  try {
    const resolvedParams = await params;
    if (resolvedParams?.lng) {
      lng = resolvedParams.lng as Locale;
    }
  } catch {
    // Fallback to default locale if params are not available
  }

  let dict;
  try {
    dict = await getDictionary(lng);
  } catch {
    dict = await getDictionary('sv');
  }

  return (
    <div className="not-found-page section-spacing">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="section-title" style={{ fontSize: '5rem', marginBottom: '16px', opacity: 0.3 }}>
          404
        </h1>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          {dict.notFound.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
          {dict.notFound.description}
        </p>
        <Link href={`/${lng}`} className="btn btn-primary">
          {dict.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
