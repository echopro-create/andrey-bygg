'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
  lng: string;
  dict: Record<string, unknown>;
}

export default function GalleryClient({ images, lng, dict }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(6);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(-1);
  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="gallery-grid">
        {images.slice(0, visibleCount).map((img, index) => {
          const isVertical = index < 3;

          return (
            <div key={index} className={`gallery-item-wrapper ${isVertical ? 'gallery-item-vertical' : 'gallery-item-square'} ${index < 3 ? '' : 'reveal'}`} style={{ animationDelay: `${index * 0.05}s` }}>
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
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  className="gallery-img"
                  width={800}
                  height={isVertical ? 1024 : 800}
                  loading={index < 3 ? undefined : 'lazy'}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                  style={{ objectFit: 'cover' }}
                />
                <div className="gallery-item-hover">
                  <div className="zoom-icon" aria-hidden="true">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="zoom-svg"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="gallery-load-more text-center reveal" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {visibleCount < images.length ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setVisibleCount(images.length)}
          >
            {(dict.gallery as Record<string, string>)?.loadMore || 'Show more'}
          </button>
        ) : (
          <Link href={`/${lng}/contacts`} className="btn btn-secondary">
            {(dict.nav as Record<string, string>)?.book || 'Request a quote'}
          </Link>
        )}
      </div>

      {activeIndex >= 0 && (
        <Lightbox
          images={images.map((i) => i.src)}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}
