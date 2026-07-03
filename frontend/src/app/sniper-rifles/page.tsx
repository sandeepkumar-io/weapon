'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuSparkles } from 'react-icons/lu';
import { getImageUrlForRifle } from '@/lib/imageGenerator';
import CatalogCard, { type CardItem } from '@/components/catalog/CatalogCard';
import CatalogPagination from '@/components/catalog/CatalogPagination';

interface Spec {
  label: string;
  value: string;
}

interface SniperRifle {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  caliber?: string;
  effective_range?: string;
  weight?: string;
  description: string;
  specs: Spec[];
  generatedImages?: string[];
}

const PER_PAGE = 6;

const toCard = (r: SniperRifle): CardItem => ({
  id: r.id,
  name: r.name,
  image: r.generatedImages?.[0] || getImageUrlForRifle(r.name),
  badge: r.category,
  subtitle: r.origin,
  description: r.description,
  stats: [
    { label: 'Caliber', value: r.caliber },
    { label: 'Range', value: r.effective_range },
  ],
});

export default function SniperRiflesPage() {
  const [data, setData] = useState<SniperRifle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('All origins');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/sniper-rifles');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch sniper rifles');
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
      data.filter((rifle) => {
        const searchable =
          `${rifle.name} ${rifle.category} ${rifle.origin} ${rifle.description}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (origin === 'All origins' || rifle.origin === origin)
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
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border px-5 py-14 sm:py-20 lg:px-8">
        <img
          src="/maxim-potkin-Uo4iZenrVxk-unsplash.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-[#050505] via-[#050505]/36 to-[#050505]/10" />
        <div className="absolute inset-0 z-0 bg-linear-to-b from-[#050505]/18 via-transparent to-[#050505]/62" />

        <div className="relative z-10 w-full max-w-[760px] text-left">
          <div className="mb-12">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <LuSparkles className="h-4 w-4" /> Precision archive / 01
            </p>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.82] tracking-tight sm:text-8xl lg:text-9xl">
              Precision
              <br />
              <span className="text-primary">over distance.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Explore long-range systems built for stability, optics, and repeatable accuracy, from
              bolt-action marksman rifles to heavy anti-materiel platforms.
            </p>
          </div>
          <div className="technical-panel grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_240px]">
            <label className="relative block">
              <span className="sr-only">Search sniper rifles</span>
              <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background/70 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search rifle, type or origin..."
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
            <h2 className="mt-2 truncate font-display text-4xl font-bold uppercase sm:text-5xl">Sniper catalog</h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> records
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Loading sniper rifles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">{error}</div>
        ) : visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((rifle, index) => (
              <CatalogCard key={rifle._id} item={toCard(rifle)} basePath="/sniper-rifles" index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <LuSearch className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-2xl uppercase">No sniper rifles found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try another name, type, or origin.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <CatalogPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </section>
    </main>
  );
}
