import { getDictionary, Locale } from '../../i18n';
import GalleryClient from './GalleryClient';

interface GalleryPageProps {
  params: Promise<{ lng: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  const images = [
    '/images/gallery/gallery-1.webp',
    '/images/gallery/gallery-2.webp',
    '/images/gallery/gallery-3.webp',
    '/images/gallery/gallery-4.webp',
    '/images/gallery/gallery-5.webp',
    '/images/gallery/gallery-6.webp',
  ];

  return (
    <div className="gallery-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.nav.gallery} <span className="gold-accent">Studio</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Take a look inside our premium private massage studio in Stockholm. A sanctuary of peace, equipped for your absolute comfort.
          </p>
        </div>
        
        <GalleryClient images={images} closeLabel={dict.contacts.formTitle} />
      </div>
    </div>
  );
}
