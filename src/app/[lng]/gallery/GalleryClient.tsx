'use client';

import { useState } from 'react';
import Lightbox from '@/components/Lightbox';

interface GalleryClientProps {
  images: string[];
  closeLabel: string;
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
  };

  const handleClose = () => {
    setActiveIndex(-1);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div
            key={img}
            className="gallery-item-wrapper reveal"
            onClick={() => handleOpen(idx)}
          >
            <div className="gallery-item-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Oleg Massage Gallery Studio ${idx + 1}`}
                className="gallery-img"
              />
              <div className="gallery-item-hover">
                <span className="zoom-icon">🔍</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        images={images}
        activeIndex={activeIndex}
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
