'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const translations = {
  ru: {
    title: 'Что-то пошло не так',
    description: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз или вернитесь на главную страницу.',
    tryAgain: 'Попробовать снова',
    backToHome: 'На главную',
  },
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again or return to the homepage.',
    tryAgain: 'Try again',
    backToHome: 'Back to Home',
  },
  sv: {
    title: 'Något gick fel',
    description: 'Ett oväntat fel inträffade. Försök igen eller återgå till startsidan.',
    tryAgain: 'Försök igen',
    backToHome: 'Till startsidan',
  },
  uk: {
    title: 'Щось пішло не так',
    description: 'Сталася непередбачена помилка. Будь ласка, спробуйте ще раз або поверніться на головну сторінку.',
    tryAgain: 'Спробувати знову',
    backToHome: 'На головну',
  },
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  const params = useParams();
  const rawLng = params?.lng;
  const lng = (typeof rawLng === 'string' && ['ru', 'en', 'sv', 'uk'].includes(rawLng) ? rawLng : 'sv') as 'ru' | 'en' | 'sv' | 'uk';
  const t = translations[lng] || translations.sv;

  return (
    <div className="error-page section-spacing">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="section-title" style={{ marginBottom: '24px' }}>
          {t.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
          {t.description}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn-primary">
            {t.tryAgain}
          </button>
          <Link href={`/${lng}`} className="btn btn-secondary">
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
