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

interface PistolBullet {
  _id: string;
  id: string;
  name: string;
  caliber: string;
  origin: string;
  category?: string;
  muzzle_velocity?: string;
  muzzle_energy?: string;
  description: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: unknown;
}

const imageFor = (b: PistolBullet) => b.generatedImages?.[0] || getImageUrlForRifle(b.name);

export default function PistolBulletDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  const [data, setData] = useState<PistolBullet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pistol-bullets');
        const result = await res.json();
        if (result.success) setData(result.data);
        else setError('Failed to fetch ammunition data');
      } catch (err) {
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bullet = useMemo(
    () => data.find((b) => b.id?.trim?.().toLowerCase?.() === id?.trim?.().toLowerCase?.()),
    [data, id],
  );

  const related: CardItem[] = useMemo(() => {
    if (!bullet) return [];
    return data
      .filter((b) => b.id !== bullet.id)
      .slice(0, 8)
      .map((b) => ({
        id: b.id,
        name: b.name,
        image: imageFor(b),
        badge: b.caliber,
        subtitle: b.origin,
        description: b.description,
        stats: [
          { label: 'Velocity', value: b.muzzle_velocity },
          { label: 'Energy', value: b.muzzle_energy },
        ],
      }));
  }, [data, bullet]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading cartridge...</p>
        </div>
      </main>
    );
  }

  if (error || !bullet) {
    return (
      <main className="mx-auto max-w-3xl px-5 pt-28">
        <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-red-300">
          {error || `Cartridge "${id}" not found`}
        </div>
      </main>
    );
  }

  return (
    <CatalogDetail
      basePath="/pistol-bullets"
      backLabel="All ammunition"
      kicker="Cartridge dossier"
      relatedLabel="More ammunition"
      related={related}
      data={{
        id: bullet.id,
        name: bullet.name,
        images: bullet.generatedImages?.length ? bullet.generatedImages : [imageFor(bullet)],
        badge: bullet.caliber,
        metaLine: `${bullet.caliber} · ${bullet.origin}`,
        description: bullet.description,
        stats: [
          { label: 'Caliber', value: bullet.caliber },
          { label: 'Muzzle velocity', value: bullet.muzzle_velocity },
          { label: 'Muzzle energy', value: bullet.muzzle_energy },
          { label: 'Origin', value: bullet.origin },
        ],
        details: buildDetailRows(bullet, ['caliber', 'origin', 'muzzle_velocity', 'muzzle_energy', 'category']),
        specs: bullet.specs ?? [],
      }}
    />
  );
}
