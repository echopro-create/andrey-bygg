'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/Lightbox';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
  closeLabel: string;
  lng: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function GalleryClient({ images, lng, dict }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(-1);
  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-item-wrapper reveal" style={{ animationDelay: `${index * 0.1}s` }}>
            <button
              type="button"
              className="gallery-item-frame"
              onClick={() => openLightbox(index)}
              aria-label={`Open gallery image ${index + 1}`}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'block',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                className="gallery-img"
                width={600}
                height={450}
                priority={index < 3}
                style={{ objectFit: 'cover' }}
              />
              <div className="gallery-item-hover">
                <span className="zoom-icon" role="img" aria-hidden="true">🔍</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="gallery-cta text-center reveal" style={{ marginTop: '60px' }}>
        <Link href={`/${lng}/contacts?book=true`} className="btn btn-primary">
          {dict.nav.book}
        </Link>
        <Link href={`/${lng}#services`} className="btn btn-secondary" style={{ marginLeft: '16px' }}>
          {dict.allServices || 'View services'}
        </Link>
      </div>

      <Lightbox
        images={images.map((i) => i.src)}
        activeIndex={activeIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}
