'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { LuArrowLeft, LuArrowRight, LuSearch, LuSparkles } from 'react-icons/lu';
import { getImageUrlForRifle } from '@/lib/imageGenerator';
import CatalogCard, { type CardItem } from '@/components/catalog/CatalogCard';

interface Spec {
  label: string;
  value: string;
}

interface Missile {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  manufacturer?: string;
  guidance?: string;
  max_speed?: string;
  range?: string;
  description: string;
  specs: Spec[];
  generatedImages?: string[];
}

// 3D missile renders client-side only (WebGL); falls back to the gradient bg.
const MissileScene = dynamic(() => import('@/components/hero/MissileScene'), { ssr: false });

const PER_PAGE = 6;

const toCard = (m: Missile): CardItem => ({
  id: m.id,
  name: m.name,
  image: m.generatedImages?.[0] || getImageUrlForRifle(m.name),
  badge: m.category,
  subtitle: m.origin,
  description: m.description,
  stats: [
    { label: 'Range', value: m.range },
    { label: 'Max speed', value: m.max_speed },
  ],
});

export default function AirToAirMissilesPage() {
  const [data, setData] = useState<Missile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('All origins');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/air-to-air-missiles');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch data');
      } catch (err) {
        setError('Error fetching data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const origins = useMemo(
    () => Array.from(new Set(data.map((e) => e.origin))).filter(Boolean),
    [data],
  );

  const filtered = useMemo(
    () =>
      data.filter((m) => {
        const searchable =
          `${m.name} ${m.category} ${m.origin} ${m.manufacturer ?? ''} ${m.description}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (origin === 'All origins' || m.origin === origin)
        );
      }),
    [data, query, origin],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const updateOrigin = (value: string) => {
    setOrigin(value);
    setPage(1);
  };

  return (
    <main className="min-h-screen overflow-x-hidden pt-16">
      {/* Hero + search */}
      <section className="relative overflow-hidden border-b border-border px-5 py-14 sm:py-20 lg:px-8">
        <div className="absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_68%)] opacity-10" />

        {/* Live 3D missile — right-hand side */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 lg:block">
          <MissileScene />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <LuSparkles className="h-4 w-4" /> Air combat archive / 01
            </p>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.82] tracking-tight sm:text-8xl lg:text-9xl">
              Lock on,
              <br />
              <span className="text-primary">fire away.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Explore the air-to-air missiles that rule the skies — from short-range dogfight
              seekers to long-range beyond-visual-range interceptors.
            </p>
          </div>
          <div className="technical-panel grid max-w-3xl gap-3 rounded-2xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_240px]">
            <label className="relative block">
              <span className="sr-only">Search missiles</span>
              <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background/70 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search missile, type or origin..."
              />
            </label>
            <label>
              <span className="sr-only">Filter by origin</span>
              <select
                value={origin}
                onChange={(e) => updateOrigin(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary"
              >
                <option>All origins</option>
                {origins.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Technical index</p>
            <h2 className="mt-2 truncate font-display text-4xl font-bold uppercase sm:text-5xl">Missile catalog</h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> records
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Loading missiles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-red-300">{error}</div>
        ) : visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((m, index) => (
              <CatalogCard key={m._id} item={toCard(m)} basePath="/air-to-air-missiles" index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <LuSearch className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-2xl uppercase">No missiles found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try another name, type, or origin.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filtered.length > 0 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            <PageButton disabled={page === 1} onClick={() => setPage(page - 1)} ariaLabel="Previous page">
              <LuArrowLeft />
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <PageButton key={number} active={number === page} onClick={() => setPage(number)} ariaLabel={`Page ${number}`}>
                {number}
              </PageButton>
            ))}
            <PageButton disabled={page === totalPages} onClick={() => setPage(page + 1)} ariaLabel="Next page">
              <LuArrowRight />
            </PageButton>
          </nav>
        )}
      </section>
    </main>
  );
}

function PageButton({
  children,
  onClick,
  active,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-primary bg-primary text-[#050505]'
          : 'border-border text-foreground hover:border-primary hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}
