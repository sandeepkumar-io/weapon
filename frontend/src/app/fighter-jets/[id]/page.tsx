'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AircraftDetail from '@/components/catalog/AircraftDetail';
import type { AircraftDetailItem, AircraftListItem } from '@/lib/aircraftFormat';

export default function FighterJetDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.id as string);

  const [aircraft, setAircraft] = useState<AircraftDetailItem | null>(null);
  const [related, setRelated] = useState<AircraftListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/fighter-jets/${encodeURIComponent(slug)}`);
        const result = await res.json();
        if (!active) return;

        if (result.success) {
          setAircraft(result.data);
          setRelated(result.related || []);
        } else {
          setError(result.error || `Aircraft "${slug}" not found`);
        }
      } catch (err) {
        if (active) setError('Error: ' + (err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading aircraft...</p>
        </div>
      </main>
    );
  }

  if (error || !aircraft) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Aircraft "${slug}" not found`}
        </div>
      </main>
    );
  }

  return <AircraftDetail aircraft={aircraft} related={related} />;
}
