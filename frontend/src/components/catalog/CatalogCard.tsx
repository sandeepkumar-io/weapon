'use client';

import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { getFallbackImageUrl } from '@/lib/imageGenerator';

export interface CardItem {
  id: string;
  name: string;
  image: string;
  badge?: string;
  subtitle?: string;
  stats: { label: string; value?: string }[];
  description?: string;
}

/** Shared catalog card. Navigates to `${basePath}/${id}` on click. */
export default function CatalogCard({
  item,
  basePath,
  index = 0,
}: {
  item: CardItem;
  basePath: string;
  index?: number;
}) {
  return (
    <Link
      href={`${basePath}/${encodeURIComponent(item.id)}`}
      className="technical-panel group block cursor-pointer overflow-hidden rounded-lg border border-border transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-38px_rgba(34,211,238,0.65)]"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading={index > 2 ? 'lazy' : 'eager'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackImageUrl(item.name);
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="image-shade absolute inset-0" />
        {item.badge && (
          <span className="absolute left-4 top-4 rounded-md border border-primary/30 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
            {item.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          {item.subtitle && <p className="text-xs font-medium text-primary">{item.subtitle}</p>}
          <h3 className="font-display text-[1.25rem] font-bold uppercase line-clamp-1 tracking-tight">{item.name}</h3>
        </div>
      </div>
      <div className="p-5">
        {item.description && (
          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          {item.stats.slice(0, 2).map((s) => (
            <div key={s.label} className="bg-[#0f0f0f] p-3">
              <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <strong className="mt-1 block text-sm">{s.value || '—'}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <span>Show more</span>
          <LuArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
