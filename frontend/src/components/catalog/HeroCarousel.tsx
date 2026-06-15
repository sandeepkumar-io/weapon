'use client';

import { useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { getFallbackImageUrl } from '@/lib/imageGenerator';

/** Full-bleed hero image carousel with autoplay + pagination. */
export default function HeroCarousel({
  images,
  name,
  badge,
  interval = 3500,
}: {
  images: string[];
  name: string;
  badge?: string;
  interval?: number;
}) {
  const slides = images.length ? images : [getFallbackImageUrl(name)];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (n: number) => setIndex((n + slides.length) % slides.length);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, paused, interval]);

  return (
    <div
      className="relative h-[60vh] w-full overflow-hidden border-y border-border bg-[#0a0a0a] sm:h-[70vh] lg:h-[82vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`${name} ${idx + 1}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackImageUrl(name);
          }}
          className={`absolute inset-0 mx-auto h-full w-full object-contain transition-opacity duration-700 ${
            idx === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Bottom vignette for legibility */}
      <div className="image-shade pointer-events-none absolute inset-x-0 bottom-0 h-1/3" />

      {badge && (
        <span className="absolute left-5 top-5 z-10 rounded-full border border-primary/30 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
          {badge}
        </span>
      )}

      {slides.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute right-5 top-5 z-10 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-bold tabular-nums text-foreground backdrop-blur">
            {index + 1} / {slides.length}
          </div>

          {/* Pagination dots */}
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === index ? 'w-6 bg-primary' : 'w-2 bg-foreground/40 hover:bg-foreground/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
