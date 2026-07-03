'use client';

import Link from 'next/link';
import { LuArrowLeft, LuGauge, LuShieldCheck, LuSparkles, LuZap } from 'react-icons/lu';
import CatalogCard, { type CardItem } from './CatalogCard';
import HeroCarousel from './HeroCarousel';

export interface DetailData {
  id: string;
  name: string;
  images: string[];
  badge?: string;
  metaLine: string;
  description: string;
  stats: { label: string; value?: string }[];
  details?: { label: string; value: string }[];
  specs: { label: string; value: string }[];
}

const ICONS = [LuZap, LuGauge, LuShieldCheck, LuSparkles];

export default function CatalogDetail({
  data,
  basePath,
  backLabel,
  kicker,
  relatedLabel,
  related,
}: {
  data: DetailData;
  basePath: string;
  backLabel: string;
  kicker: string;
  relatedLabel: string;
  related: CardItem[];
}) {
  return (
    <main className="min-h-screen overflow-x-hidden pt-16">
      {/* Back link (constrained) */}
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary"
        >
          <LuArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      </div>

      {/* Full-width image carousel (autoplay + pagination) */}
      <div className="mt-6">
        <HeroCarousel images={data.images} name={data.name} badge={data.badge} />
      </div>

      {/* Content (max 1600px) */}
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {kicker} / {String(data.id).padStart(2, '0')}
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            {data.name}
          </h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{data.metaLine}</p>

          {/* Stat tiles */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.stats.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={s.label} className="rounded-lg border border-border bg-background/50 p-4">
                  <span className="mb-4 block text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  <strong className="mt-1 block text-sm">{s.value || '—'}</strong>
                </div>
              );
            })}
          </div>

          {/* Description */}
          {data.description && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold uppercase">Overview</h2>
              <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">{data.description}</p>
            </div>
          )}

          {/* Full details (every field) */}
          {data.details && data.details.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold uppercase">Details</h2>
              <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {data.details.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 bg-[#0f0f0f] px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <strong className="text-right text-foreground">{row.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {data.specs?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold uppercase">Specifications</h2>
              <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {data.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between bg-[#0f0f0f] px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <strong className="text-foreground">{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related cards */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-display text-2xl font-bold uppercase">{relatedLabel}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => (
                <CatalogCard key={`${item.id}-${i}`} item={item} basePath={basePath} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
