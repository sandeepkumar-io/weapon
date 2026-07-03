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

interface Bomber {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  manufacturer?: string;
  max_speed?: string;
  range?: string;
  payload?: string;
  service_ceiling?: string;
  description: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (b: Bomber) => b.generatedImages?.[0] || getImageUrlForRifle(b.name);

export default function BomberDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<Bomber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/bombers');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch bomber data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bomber = useMemo(
    () => data.find((b) => b.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!bomber) return [];
    return data
      .filter((b) => b.id !== bomber.id)
      .slice(0, 8)
      .map((b) => ({
        id: b.id,
        name: b.name,
        image: imageFor(b),
        badge: b.category,
        subtitle: b.origin,
        description: b.description,
        stats: [
          { label: 'Range', value: b.range },
          { label: 'Payload', value: b.payload },
        ],
      }));
  }, [data, bomber]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading bomber...</p>
        </div>
      </main>
    );
  }

  if (error || !bomber) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Bomber "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/bombers"
      backLabel="All bombers"
      kicker="Bomber dossier"
      relatedLabel="More bombers"
      related={related}
      data={{
        id: bomber.id,
        name: bomber.name,
        images: bomber.generatedImages?.length ? bomber.generatedImages : [imageFor(bomber)],
        badge: bomber.category,
        metaLine: [bomber.manufacturer, bomber.origin].filter(Boolean).join(' · '),
        description: bomber.description,
        stats: [
          { label: 'Max speed', value: bomber.max_speed },
          { label: 'Range', value: bomber.range },
          { label: 'Payload', value: bomber.payload },
          { label: 'Service ceiling', value: bomber.service_ceiling },
        ],
        details: buildDetailRows(bomber, [
          'category',
          'origin',
          'manufacturer',
          'max_speed',
          'range',
          'payload',
          'service_ceiling',
        ]),
        specs: bomber.specs ?? [],
      }}
    />
  );
}
