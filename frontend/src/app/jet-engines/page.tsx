'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuSparkles } from 'react-icons/lu';
import EngineCard from '@/components/catalog/EngineCard';
import CatalogPagination from '@/components/catalog/CatalogPagination';
import { generationRank, type EngineListItem } from '@/lib/engineFormat';

const PER_PAGE = 9;
const ALL_COUNTRIES = 'All countries';
const ALL_TYPES = 'All types';
const ALL_STATUSES = 'All statuses';

export default function JetEnginesPage() {
  const [data, setData] = useState<EngineListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [country, setCountry] = useState(ALL_COUNTRIES);
  const [type, setType] = useState(ALL_TYPES);
  const [status, setStatus] = useState(ALL_STATUSES);
  const [vectoringOnly, setVectoringOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/jet-engines');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError(result.error || 'Failed to fetch engines');
      } catch (err) {
        setError('Error fetching data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Country filter uses `datasetCountries` (the fleets an engine appears in)
  // rather than `originCountry`, so a licence-built engine shows up under
  // every dataset that carries it.
  const countries = useMemo(
    () => Array.from(new Set(data.flatMap((e) => e.datasetCountries || []))).sort(),
    [data],
  );

  const types = useMemo(
    () => Array.from(new Set(data.map((e) => e.engineTypeGroup).filter(Boolean) as string[])).sort(),
    [data],
  );

  const statuses = useMemo(
    () => Array.from(new Set(data.map((e) => e.statusGroup).filter(Boolean) as string[])).sort(),
    [data],
  );

  const generations = useMemo(
    () =>
      Array.from(new Set(data.map((e) => e.generationTier).filter(Boolean) as string[])).sort(
        (a, b) => generationRank(a) - generationRank(b),
      ),
    [data],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return data.filter((engine) => {
      const haystack = [
        engine.name,
        engine.manufacturer,
        engine.originCountry,
        engine.engineType,
        engine.description,
        ...(engine.applications || []),
        ...(engine.variants || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        (!needle || haystack.includes(needle)) &&
        (country === ALL_COUNTRIES || (engine.datasetCountries || []).includes(country)) &&
        (type === ALL_TYPES || engine.engineTypeGroup === type) &&
        (status === ALL_STATUSES || engine.statusGroup === status) &&
        (!vectoringOnly || Boolean(engine.nozzle?.thrustVectoring))
      );
    });
  }, [data, query, country, type, status, vectoringOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /** Every filter resets paging, otherwise page 5 of a 2-page result is blank. */
  const withPageReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  return (
    <main className="min-h-screen overflow-x-hidden pt-16">
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border px-5 py-14 sm:py-20 lg:px-8">
        <img
          src="/engin.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-[#050505] via-[#050505]/28 to-[#050505]/10" />
        <div className="absolute inset-0 z-0 bg-linear-to-b from-[#050505]/15 via-transparent to-[#050505]/50" />

        <div className="relative z-10 w-full max-w-[760px] text-left">
          <div className="mb-12">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <LuSparkles className="h-4 w-4" /> Propulsion archive / 01
            </p>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.82] tracking-tight sm:text-8xl lg:text-9xl">
              Inside the
              <br />
              <span className="text-primary">thrust core.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Study the engines that turn pressure, heat, and precision blades into aircraft
              performance, from classic turbojets to modern high-thrust turbofans.
            </p>
          </div>

          <div className="technical-panel grid gap-3 rounded-lg border border-border p-3">
            <label className="relative block">
              <span className="sr-only">Search engines</span>
              <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => withPageReset(setQuery)(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background/70 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search engine, maker, type or aircraft..."
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label>
                <span className="sr-only">Filter by country</span>
                <select
                  value={country}
                  onChange={(e) => withPageReset(setCountry)(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary"
                >
                  <option>{ALL_COUNTRIES}</option>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sr-only">Filter by engine type</span>
                <select
                  value={type}
                  onChange={(e) => withPageReset(setType)(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary"
                >
                  <option>{ALL_TYPES}</option>
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(e) => withPageReset(setStatus)(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary"
                >
                  <option>{ALL_STATUSES}</option>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 px-1 py-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <input
                type="checkbox"
                checked={vectoringOnly}
                onChange={(e) => withPageReset(setVectoringOnly)(e.target.checked)}
                className="h-4 w-4 accent-[#22d3ee]"
              />
              Thrust-vectoring engines only
            </label>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Technical index
            </p>
            <h2 className="mt-2 truncate font-display text-4xl font-bold uppercase sm:text-5xl">
              Engine catalog
            </h2>
            {generations.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Generations covered: {generations.join(' · ')}
              </p>
            )}
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> records
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Loading jet engines...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
            {error}
          </div>
        ) : visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((engine, index) => (
              <EngineCard key={engine._id} engine={engine} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <LuSearch className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-2xl uppercase">No engines found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another name, maker, type or country.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <CatalogPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </section>
    </main>
  );
}
