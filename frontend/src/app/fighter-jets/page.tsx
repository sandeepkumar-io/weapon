'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuSparkles } from 'react-icons/lu';
import AircraftCard from '@/components/catalog/AircraftCard';
import CatalogPagination from '@/components/catalog/CatalogPagination';
import { generationRank, type AircraftListItem } from '@/lib/aircraftFormat';

const PER_PAGE = 9;
const ALL_COUNTRIES = 'All countries';
const ALL_GENERATIONS = 'All generations';
const ALL_STATUSES = 'All statuses';

export default function FighterJetsPage() {
  const [data, setData] = useState<AircraftListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [country, setCountry] = useState(ALL_COUNTRIES);
  const [generation, setGeneration] = useState(ALL_GENERATIONS);
  const [status, setStatus] = useState(ALL_STATUSES);
  const [stealthOnly, setStealthOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/fighter-jets');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError(result.error || 'Failed to fetch aircraft');
      } catch (err) {
        setError('Error fetching data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Country filter uses `datasetCountries` (the fleets an aircraft appears in)
  // rather than `originCountry`, so the F-35 shows up under every operator.
  const countries = useMemo(
    () => Array.from(new Set(data.flatMap((a) => a.datasetCountries || []))).sort(),
    [data],
  );

  const generations = useMemo(
    () =>
      Array.from(new Set(data.map((a) => a.generationTier).filter(Boolean) as string[])).sort(
        (a, b) => generationRank(a) - generationRank(b),
      ),
    [data],
  );

  const statuses = useMemo(
    () => Array.from(new Set(data.map((a) => a.statusGroup).filter(Boolean) as string[])).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return data.filter((aircraft) => {
      const haystack = [
        aircraft.name,
        aircraft.manufacturer,
        aircraft.originCountry,
        aircraft.aircraftType,
        aircraft.description,
        aircraft.engine?.name,
        ...(aircraft.roles || []),
        ...(aircraft.variants || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        (!needle || haystack.includes(needle)) &&
        (country === ALL_COUNTRIES || (aircraft.datasetCountries || []).includes(country)) &&
        (generation === ALL_GENERATIONS || aircraft.generationTier === generation) &&
        (status === ALL_STATUSES || aircraft.statusGroup === status) &&
        (!stealthOnly || Boolean(aircraft.stealth?.stealthCapability))
      );
    });
  }, [data, query, country, generation, status, stealthOnly]);

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
          src="/fighterjet.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover bg-black/35"
        />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-[#050505] via-[#050505]/28 to-[#050505]/10" />
        <div className="absolute inset-0 z-0 bg-linear-to-b from-[#050505]/15 via-transparent to-[#050505]/50" />

        <div className="relative z-10 w-full max-w-[760px] text-left">
          <div className="mb-12">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <LuSparkles className="h-4 w-4" /> Air superiority archive / 01
            </p>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.82] tracking-tight sm:text-8xl lg:text-9xl">
              Edge of
              <br />
              <span className="text-primary">air power.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Compare the fighters built for speed, survivability, and control of the air, from
              agile interceptors to stealth multirole aircraft.
            </p>
          </div>

          <div className="technical-panel grid gap-3 rounded-lg border border-border p-3">
            <label className="relative block">
              <span className="sr-only">Search aircraft</span>
              <LuSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => withPageReset(setQuery)(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background/70 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search aircraft, role, engine or manufacturer..."
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
                <span className="sr-only">Filter by generation</span>
                <select
                  value={generation}
                  onChange={(e) => withPageReset(setGeneration)(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary"
                >
                  <option>{ALL_GENERATIONS}</option>
                  {generations.map((g) => (
                    <option key={g}>{g}</option>
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
                checked={stealthOnly}
                onChange={(e) => withPageReset(setStealthOnly)(e.target.checked)}
                className="h-4 w-4 accent-[#22d3ee]"
              />
              Stealth aircraft only
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
              Aircraft catalog
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> records
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Loading aircraft...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
            {error}
          </div>
        ) : visible.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((aircraft, index) => (
              <AircraftCard key={aircraft._id} aircraft={aircraft} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <LuSearch className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-2xl uppercase">No aircraft found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another name, role, country or generation.
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
