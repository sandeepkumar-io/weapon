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

interface Rifle {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  caliber?: string;
  range?: string;
  weight?: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (r: Rifle) => r.generatedImages?.[0] || getImageUrlForRifle(r.name);

export default function RifleDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<Rifle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/rifles');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch rifle data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rifle = useMemo(
    () => data.find((r) => r.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!rifle) return [];
    return data
      .filter((r) => r.id !== rifle.id)
      .slice(0, 8)
      .map((r) => ({
        id: r.id,
        name: r.name,
        image: imageFor(r),
        badge: r.category,
        subtitle: r.origin,
        description: r.description,
        stats: [
          { label: 'Caliber', value: r.caliber },
          { label: 'Range', value: r.range },
        ],
      }));
  }, [data, rifle]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading rifle...</p>
        </div>
      </main>
    );
  }

  if (error || !rifle) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Rifle "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/rifles"
      backLabel="All rifles"
      kicker="Rifle dossier"
      relatedLabel="More rifles"
      related={related}
      data={{
        id: rifle.id,
        name: rifle.name,
        images: rifle.generatedImages?.length ? rifle.generatedImages : [imageFor(rifle)],
        badge: rifle.category,
        metaLine: `${rifle.category} · ${rifle.origin}`,
        description: rifle.description,
        stats: [
          { label: 'Caliber', value: rifle.caliber },
          { label: 'Effective range', value: rifle.range },
          { label: 'Weight', value: rifle.weight },
          { label: 'Origin', value: rifle.origin },
        ],
        details: buildDetailRows(rifle, ['category', 'origin', 'caliber', 'range', 'weight']),
        specs: rifle.specs ?? [],
      }}
    />
  );
}
