'use client';

import { useState } from 'react';
import { getImageUrlForRifle } from '@/lib/imageGenerator';

interface ImageGalleryProps {
  images?: string[];
  itemName: string;
  fallbackImage?: string;
}

export default function ImageGallery({ images, itemName, fallbackImage }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use generated images if available, otherwise fallback
  const displayImages = images && images.length > 0
    ? images
    : [fallbackImage || getImageUrlForRifle(itemName)];

  const currentImage = displayImages[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden group">
      {/* Main Image */}
      <img
        src={currentImage}
        alt={`${itemName} ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)'
        }}
      />

      {/* Navigation Buttons - Only show if multiple images */}
      {displayImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
