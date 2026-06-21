'use client';

import { useEffect, useState, useRef } from 'react';

interface LightboxProps {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isSwipingX, setIsSwipingX] = useState(false);
  const [isSwipingY, setIsSwipingY] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (activeIndex >= 0) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, onNext, onPrev]);

  // Сброс смещений при смене картинки
  useEffect(() => {
    setOffsetX(0);
    setOffsetY(0);
    setIsSwipingX(false);
    setIsSwipingY(false);
  }, [activeIndex]);

  if (activeIndex < 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    const touch = e.targetTouches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setOffsetX(0);
    setOffsetY(0);
    setIsSwipingX(false);
    setIsSwipingY(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAnimating || touchStartX === null || touchStartY === null) return;
    const touch = e.targetTouches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    if (!isSwipingX && !isSwipingY) {
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      if (absX > absY && absX > 10) {
        setIsSwipingX(true);
      } else if (absY > absX && absY > 10) {
        setIsSwipingY(true);
      }
    }

    if (isSwipingX) {
      setOffsetX(diffX);
      if (e.cancelable) e.preventDefault();
    } else if (isSwipingY) {
      setOffsetY(diffY);
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;

    const swipeThresholdX = 80;
    const swipeThresholdY = 120;

    setIsAnimating(true);

    if (isSwipingX) {
      if (offsetX > swipeThresholdX) {
        onPrev();
      } else if (offsetX < -swipeThresholdX) {
        onNext();
      }
    } else if (isSwipingY) {
      if (Math.abs(offsetY) > swipeThresholdY) {
        onClose();
        setIsAnimating(false);
        return;
      }
    }

    setOffsetX(0);
    setOffsetY(0);
    setIsSwipingX(false);
    setIsSwipingY(false);
    setTouchStartX(null);
    setTouchStartY(null);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const overlayOpacity = isSwipingY ? Math.max(0.3, 1 - Math.abs(offsetY) / 400) : 1;
  const overlayStyle: React.CSSProperties = {
    backgroundColor: `rgba(var(--background-rgb), ${overlayOpacity * 0.95})`,
    backdropFilter: `blur(${overlayOpacity * 12}px)`,
    WebkitBackdropFilter: `blur(${overlayOpacity * 12}px)`,
    transition: isSwipingY ? 'none' : 'background-color 0.3s, backdrop-filter 0.3s',
  };

  const imageStyle: React.CSSProperties = {
    objectFit: 'contain',
    transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
    transition: isSwipingX || isSwipingY ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  };

  return (
    <div 
      className="lightbox-overlay" 
      style={overlayStyle}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close Lightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous Image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[activeIndex]}
          alt={`Gallery item ${activeIndex + 1}`}
          className="lightbox-image"
          style={imageStyle}
        />
        <div className="lightbox-counter">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next Image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
