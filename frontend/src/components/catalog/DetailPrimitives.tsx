'use client';

import type { ReactNode } from 'react';
import { getFallbackImageUrl } from '@/lib/imageGenerator';

export type Row = { label: string; value: string | null };

/** Drops rows with no value so sections never render half-empty grids. */
export const rows = (input: Row[]) => input.filter((row) => row.value);

/** Pulls the YouTube id out of a watch, share or embed URL. */
export function youTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: (props: { className?: string }) => ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="font-display text-2xl font-bold uppercase">{title}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

export function SpecGrid({ items }: { items: Row[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-3 bg-[#0f0f0f] px-4 py-3 text-sm"
        >
          <span className="shrink-0 text-muted-foreground">{row.label}</span>
          <strong className="text-right text-foreground">{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function ChipList({
  items,
  tone = 'muted',
}: {
  items?: string[];
  tone?: 'muted' | 'primary';
}) {
  if (!items?.length) return null;
  const style =
    tone === 'primary'
      ? 'border-primary/30 bg-primary/10 text-primary'
      : 'border-border bg-[#0f0f0f] text-muted-foreground';

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-md border px-3 py-1.5 text-xs tracking-wide ${style}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

/** A labelled block of free text, for the long prose fields in a dossier. */
export function Prose({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </h3>
      <p className="max-w-3xl leading-8 text-muted-foreground">{value}</p>
    </div>
  );
}

/** A labelled chip row, used for the many list-valued fields in a dossier. */
export function ChipSection({
  label,
  items,
  tone = 'muted',
}: {
  label: string;
  items?: string[];
  tone?: 'muted' | 'primary';
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </h3>
      <ChipList items={items} tone={tone} />
    </div>
  );
}

/** Named components (weapons, variants) rendered as a labelled thumbnail grid. */
export function ComponentGrid({
  label,
  names,
  images,
}: {
  label: string;
  names?: string[];
  images?: Record<string, string>;
}) {
  if (!names?.length) return null;

  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((name) => {
          const image = images?.[name];
          return (
            <div
              key={name}
              className="technical-panel overflow-hidden rounded-lg border border-border transition hover:border-primary/50"
            >
              <div className="aspect-4/3 overflow-hidden bg-[#0a0a0a]">
                <img
                  src={image || getFallbackImageUrl(name)}
                  alt={name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getFallbackImageUrl(name);
                  }}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <p className="px-3 py-2.5 text-xs font-medium leading-snug text-foreground">{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
