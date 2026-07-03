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
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (m: Missile) => m.generatedImages?.[0] || getImageUrlForRifle(m.name);

export default function MissileDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<Missile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/air-to-air-missiles');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch missile data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const missile = useMemo(
    () => data.find((m) => m.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!missile) return [];
    return data
      .filter((m) => m.id !== missile.id)
      .slice(0, 8)
      .map((m) => ({
        id: m.id,
        name: m.name,
        image: imageFor(m),
        badge: m.category,
        subtitle: m.origin,
        description: m.description,
        stats: [
          { label: 'Range', value: m.range },
          { label: 'Max speed', value: m.max_speed },
        ],
      }));
  }, [data, missile]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading missile...</p>
        </div>
      </main>
    );
  }

  if (error || !missile) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Missile "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/air-to-air-missiles"
      backLabel="All missiles"
      kicker="Missile dossier"
      relatedLabel="More missiles"
      related={related}
      data={{
        id: missile.id,
        name: missile.name,
        images: missile.generatedImages?.length ? missile.generatedImages : [imageFor(missile)],
        badge: missile.category,
        metaLine: [missile.manufacturer, missile.origin].filter(Boolean).join(' · '),
        description: missile.description,
        stats: [
          { label: 'Max speed', value: missile.max_speed },
          { label: 'Range', value: missile.range },
          { label: 'Guidance', value: missile.guidance },
          { label: 'Origin', value: missile.origin },
        ],
        details: buildDetailRows(missile, [
          'category',
          'origin',
          'manufacturer',
          'max_speed',
          'range',
          'guidance',
        ]),
        specs: missile.specs ?? [],
      }}
    />
  );
}
