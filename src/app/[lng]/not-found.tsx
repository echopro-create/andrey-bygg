import Link from 'next/link';
import { getDictionary, Locale } from '../i18n';

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
          {dict.notFound?.title || 'Page not found'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
          {dict.notFound?.description ||
            'The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.'}
        </p>
        <Link href={`/${lng}`} className="btn btn-primary">
          {dict.notFound?.backHome || 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}
