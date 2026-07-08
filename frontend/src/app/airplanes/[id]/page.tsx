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

interface Airplane {
  _id: string;
  id: string;
  name: string;
  category?: string;
  origin?: string;
  manufacturer?: string;
  max_speed?: string;
  cruise_speed?: string;
  range?: string;
  service_ceiling?: string;
  capacity?: string;
  crew?: string;
  engine?: string;
  mtow?: string;
  description?: string;
  imageUrl?: string;
  generatedImages?: string[];
  specs?: Spec[];
  [key: string]: unknown;
}

const imageFor = (airplane: Airplane) =>
  airplane.generatedImages?.[0] || airplane.imageUrl || getImageUrlForRifle(airplane.name);

const toCard = (airplane: Airplane): CardItem => ({
  id: airplane.id,
  name: airplane.name,
  image: imageFor(airplane),
  badge: airplane.category || 'Airplane',
  subtitle: [airplane.origin, airplane.manufacturer].filter(Boolean).join(' · '),
  description: airplane.description,
  stats: [
    { label: 'Range', value: airplane.range },
    { label: 'Capacity', value: airplane.capacity },
  ],
});

export default function AirplaneDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/airplanes');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch airplane data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const airplane = useMemo(
    () => data.find((item) => item.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!airplane) return [];
    return data
      .filter((item) => item.id !== airplane.id)
      .slice(0, 8)
      .map(toCard);
  }, [data, airplane]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading airplane...</p>
        </div>
      </main>
    );
  }

  if (error || !airplane) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Airplane "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/airplanes"
      backLabel="All airplanes"
      kicker="Airplane dossier"
      relatedLabel="More airplanes"
      related={related}
      data={{
        id: airplane.id,
        name: airplane.name,
        images: airplane.generatedImages?.length ? airplane.generatedImages : [imageFor(airplane)],
        badge: airplane.category || 'Airplane',
        metaLine: [airplane.manufacturer, airplane.origin].filter(Boolean).join(' · '),
        description: airplane.description || '',
        stats: [
          { label: 'Cruise speed', value: airplane.cruise_speed || airplane.max_speed },
          { label: 'Range', value: airplane.range },
          { label: 'Capacity', value: airplane.capacity },
          { label: 'Engine', value: airplane.engine },
        ],
        details: buildDetailRows(airplane, [
          'category',
          'origin',
          'manufacturer',
          'cruise_speed',
          'max_speed',
          'range',
          'capacity',
          'engine',
        ]),
        specs: airplane.specs ?? [],
      }}
    />
  );
}
