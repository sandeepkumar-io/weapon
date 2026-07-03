'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { getImageUrlForRifle } from '@/lib/imageGenerator';
import CatalogDetail from '@/components/catalog/CatalogDetail';
import type { CardItem } from '@/components/catalog/CatalogCard';
import { buildDetailRows } from '@/components/catalog/detailUtils';

interface Spec {
  label: string;
  value: string;
}

interface JetEngine {
  _id: string;
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  thrust?: string;
  type?: string;
  description: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (e: JetEngine) => e.generatedImages?.[0] || getImageUrlForRifle(e.name);

export default function JetEngineDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<JetEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/jet-engines');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch engine data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const engine = useMemo(
    () => data.find((e) => e.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!engine) return [];
    return data
      .filter((e) => e.id !== engine.id)
      .slice(0, 8)
      .map((e) => ({
        id: e.id,
        name: e.name,
        image: imageFor(e),
        badge: e.type,
        subtitle: e.manufacturer,
        description: e.description,
        stats: [
          { label: 'Thrust', value: e.thrust },
          { label: 'Origin', value: e.origin },
        ],
      }));
  }, [data, engine]);

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
          {error || `Engine "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/jet-engines"
      backLabel="All engines"
      kicker="Engine dossier"
      relatedLabel="More engines"
      related={related}
      data={{
        id: engine.id,
        name: engine.name,
        images: engine.generatedImages?.length ? engine.generatedImages : [imageFor(engine)],
        badge: engine.type,
        metaLine: `${engine.manufacturer} · ${engine.origin}`,
        description: engine.description,
        stats: [
          { label: 'Thrust', value: engine.thrust },
          { label: 'Type', value: engine.type },
          { label: 'Manufacturer', value: engine.manufacturer },
          { label: 'Origin', value: engine.origin },
        ],
        details: buildDetailRows(engine, ['type', 'manufacturer', 'origin', 'thrust']),
        specs: engine.specs ?? [],
      }}
    />
  );
}
