'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';

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
  imageUrl?: string;
  generatedImages?: string[];
  specs: Spec[];
  [key: string]: any;
}

export default function RifleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rifleId = decodeURIComponent(params.id as string);

  const [rifle, setRifle] = useState<Rifle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRifleDetails();
  }, [rifleId]);

  const fetchRifleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rifles');
      const result = await response.json();

      if (result.success) {
        const rifles = result.data;
        const current = rifles.find((r: Rifle) =>
          r.id?.trim?.().toLowerCase?.() === rifleId?.trim?.().toLowerCase?.()
        );

        if (current) {
          setRifle(current);
        } else {
          setError(`Rifle with ID "${rifleId}" not found`);
        }
      } else {
        setError('Failed to fetch rifle data');
      }
    } catch (err) {
      setError('Error fetching rifle details: ' + (err as Error).message);
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
          <p className="text-white mt-4">Loading rifle details...</p>
        </div>
      </div>
    );
  }

  if (error || !rifle) {
    return (
      <div className="min-h-screen bg-slate-950" style={{
        background: 'linear-gradient(to bottom, #160808, #000000)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error || 'Rifle not found'}
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
              <ImageGallery images={rifle.generatedImages} itemName={rifle.name} fallbackImage={rifle.imageUrl} />
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{rifle.name}</h1>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-lg text-white font-semibold">{rifle.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Origin</p>
                    <p className="text-lg text-white font-semibold">{rifle.origin}</p>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{rifle.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Caliber', value: rifle.caliber },
                { label: 'Range', value: rifle.range },
                { label: 'Weight', value: rifle.weight },
              ].map((spec, idx) => (
                spec.value && (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">{spec.label}</p>
                    <p className="text-lg font-semibold text-white">{spec.value}</p>
                  </div>
                )
              ))}
            </div>

            {rifle.specs && rifle.specs.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Additional Details</h4>
                <div className="space-y-3">
                  {rifle.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-gray-300">{spec.label}</span>
                      <span className="font-semibold text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
