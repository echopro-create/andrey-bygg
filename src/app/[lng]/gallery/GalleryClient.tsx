'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [showAll, setShowAll] = useState(false);
  const firstNewItemRef = useRef<HTMLButtonElement>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(-1);
  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleLoadMore = () => {
    setShowAll(true);
    // После рендеринга переносим фокус на первую новую картинку для доступности (A11y)
    setTimeout(() => {
      firstNewItemRef.current?.focus();
    }, 50);
  };

  const visibleImages = showAll ? images : images.slice(0, 6);

  return (
    <>
      <div className="gallery-grid" aria-live="polite" aria-relevant="additions">
        {visibleImages.map((img, index) => {
          const isVertical = index < 3;
          const isFirstNew = index === 6; // Индекс первого элемента из скрытых
          
          return (
            <div key={index} className={`gallery-item-wrapper ${isVertical ? 'gallery-item-vertical' : 'gallery-item-square'} ${index < 6 ? 'reveal' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <button
                ref={isFirstNew ? firstNewItemRef : null}
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
                  height={isVertical ? 800 : 600}
                  loading={index < 3 ? undefined : "lazy"}
                  quality={80}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="gallery-item-hover">
                  <span className="zoom-icon" role="img" aria-hidden="true">🔍</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {!showAll && images.length > 6 && (
        <div className="gallery-load-more text-center reveal" style={{ marginTop: '40px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLoadMore}
            aria-label={dict.gallery?.loadMore || 'Show more images'}
          >
            {dict.gallery?.loadMore || 'Show More'}
          </button>
        </div>
      )}

      <div className="gallery-cta text-center reveal" style={{ marginTop: '60px' }}>
        <Link href={`/${lng}/contacts?book=true`} className="btn btn-primary">
          {dict.nav.book}
        </Link>
        <Link href={`/${lng}#services`} className="btn btn-secondary">
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
