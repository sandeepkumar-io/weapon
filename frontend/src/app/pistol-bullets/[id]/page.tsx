'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';

interface PistolBullet {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  caliber?: string;
  muzzle_velocity?: string;
  imageUrl?: string;
  generatedImages?: string[];
  specs?: any[];
  [key: string]: any;
}

export default function PistolBulletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bulletId = decodeURIComponent(params.id as string);

  const [bullet, setBullet] = useState<PistolBullet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBulletDetails();
  }, [bulletId]);

  const fetchBulletDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pistol-bullets');
      const result = await response.json();

      if (result.success) {
        const bullets = result.data;
        const current = bullets.find((b: PistolBullet) =>
          b.id?.trim?.().toLowerCase?.() === bulletId?.trim?.().toLowerCase?.()
        );

        if (current) {
          setBullet(current);
        } else {
          setError(`Pistol Bullet with ID "${bulletId}" not found`);
        }
      } else {
        setError('Failed to fetch pistol bullet data');
      }
    } catch (err) {
      setError('Error fetching pistol bullet details: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center" style={{
        background: 'linear-gradient(to bottom, #160808, #000000)'
      }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Loading pistol bullet details...</p>
        </div>
      </div>
    );
  }

  if (error || !bullet) {
    return (
      <div className="min-h-screen bg-slate-950" style={{
        background: 'linear-gradient(to bottom, #160808, #000000)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error || 'Pistol bullet not found'}
          </div>
          <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950" style={{
      background: 'linear-gradient(to bottom, #160808, #000000)'
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
          ← Back
        </button>

        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-96 md:h-full bg-slate-900 overflow-hidden">
              <ImageGallery images={bullet.generatedImages} itemName={bullet.name} fallbackImage={bullet.imageUrl} />
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{bullet.name}</h1>
                <div className="space-y-3 mb-6">
                  <div><p className="text-sm text-gray-400">Category</p><p className="text-lg text-white font-semibold">{bullet.category}</p></div>
                  <div><p className="text-sm text-gray-400">Origin</p><p className="text-lg text-white font-semibold">{bullet.origin}</p></div>
                </div>
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{bullet.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Caliber', value: bullet.caliber },
                { label: 'Muzzle Velocity', value: bullet.muzzle_velocity },
              ].map((spec, idx) => (
                spec.value && (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">{spec.label}</p>
                    <p className="text-lg font-semibold text-white">{spec.value}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
