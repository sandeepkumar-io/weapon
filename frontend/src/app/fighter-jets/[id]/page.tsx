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

interface FighterJet {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  manufacturer?: string;
  max_speed?: string;
  range?: string;
  service_ceiling?: string;
  role?: string;
  description: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (j: FighterJet) => j.generatedImages?.[0] || getImageUrlForRifle(j.name);

export default function FighterJetDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<FighterJet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/fighter-jets');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch jet data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const jet = useMemo(
    () => data.find((j) => j.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!jet) return [];
    return data
      .filter((j) => j.id !== jet.id)
      .slice(0, 8)
      .map((j) => ({
        id: j.id,
        name: j.name,
        image: imageFor(j),
        badge: j.category,
        subtitle: j.origin,
        description: j.description,
        stats: [
          { label: 'Max speed', value: j.max_speed },
          { label: 'Range', value: j.range },
        ],
      }));
  }, [data, jet]);

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

  if (error || !jet) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Aircraft "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/fighter-jets"
      backLabel="All aircraft"
      kicker="Aircraft dossier"
      relatedLabel="More aircraft"
      related={related}
      data={{
        id: jet.id,
        name: jet.name,
        images: jet.generatedImages?.length ? jet.generatedImages : [imageFor(jet)],
        badge: jet.category,
        metaLine: [jet.manufacturer, jet.origin].filter(Boolean).join(' · '),
        description: jet.description,
        stats: [
          { label: 'Max speed', value: jet.max_speed },
          { label: 'Range', value: jet.range },
          { label: 'Service ceiling', value: jet.service_ceiling },
          { label: 'Role', value: jet.role || jet.category },
        ],
        details: buildDetailRows(jet, [
          'category',
          'origin',
          'manufacturer',
          'max_speed',
          'range',
          'service_ceiling',
          'role',
        ]),
        specs: jet.specs ?? [],
      }}
    />
  );
}
