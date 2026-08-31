'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EngineDetail from '@/components/catalog/EngineDetail';
import type { EngineDetailItem, EngineListItem } from '@/lib/engineFormat';

export default function JetEngineDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.id as string);

  const [engine, setEngine] = useState<EngineDetailItem | null>(null);
  const [related, setRelated] = useState<EngineListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/jet-engines/${encodeURIComponent(slug)}`);
        const result = await res.json();
        if (!active) return;

        if (result.success) {
          setEngine(result.data);
          setRelated(result.related || []);
        } else {
          setError(result.error || `Engine "${slug}" not found`);
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
          <p className="mt-4 text-muted-foreground">Loading engine...</p>
        </div>
      </main>
    );
  }

  if (error || !engine) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Engine "${slug}" not found`}
        </div>
      </main>
    );
  }

  return <EngineDetail engine={engine} related={related} />;
}
