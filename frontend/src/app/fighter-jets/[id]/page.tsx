'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getImageUrlForRifle } from '@/lib/imageGenerator';
import ImageGallery from '@/components/ImageGallery';

interface Spec {
  label: string;
  value: string;
}

interface FighterJet {
  _id: string;
  id: string;
  name: string;
  category: string;
  status: string;
  origin: string;
  manufacturer: string;
  generation: string;
  role: string;
  first_flight: string;
  introduced: string;
  retired: string;
  max_speed: string;
  range: string;
  service_ceiling: string;
  weight: string;
  engines: string;
  crew: string;
  description: string;
  images: string;
  imageUrl?: string;
  generatedImages?: string[];
  specs: Spec[];
}

export default function FighterJetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jetId = decodeURIComponent(params.id as string);

  const [jet, setJet] = useState<FighterJet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJetDetails();
  }, [jetId]);

  const fetchJetDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fighter-jets');
      const result = await response.json();

      if (result.success) {
        const jets = result.data;
        const current = jets.find((j: FighterJet) =>
          j.id?.trim?.().toLowerCase?.() === jetId?.trim?.().toLowerCase?.()
        );

        if (current) {
          setJet(current);
        } else {
          setError(`Fighter Jet with ID "${jetId}" not found`);
        }
      } else {
        setError('Failed to fetch fighter jet data');
      }
    } catch (err) {
      setError('Error fetching fighter jet details: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center" style={{
        background: 'linear-gradient(to bottom, #0b2a5c, #061831)'
      }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Loading fighter jet details...</p>
        </div>
      </div>
    );
  }

  if (error || !jet) {
    return (
      <div className="min-h-screen bg-slate-950" style={{
        background: 'linear-gradient(to bottom, #0b2a5c, #061831)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error || 'Fighter jet not found'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950" style={{
      background: 'linear-gradient(to bottom, #0b2a5c, #061831)'
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
          {/* Image Section */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-96 md:h-full bg-slate-900 overflow-hidden">
              <ImageGallery
                images={jet.generatedImages}
                itemName={jet.name}
                fallbackImage={jet.imageUrl}
              />
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{jet.name}</h1>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Manufacturer</p>
                    <p className="text-lg text-white font-semibold">{jet.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Origin</p>
                    <p className="text-lg text-white font-semibold">{jet.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-lg text-white font-semibold">{jet.category}</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{jet.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="border-t border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Specifications</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Max Speed', value: jet.max_speed },
                { label: 'Range', value: jet.range },
                { label: 'Service Ceiling', value: jet.service_ceiling },
                { label: 'Weight', value: jet.weight },
                { label: 'Engines', value: jet.engines },
                { label: 'Crew', value: jet.crew },
                { label: 'Generation', value: jet.generation },
                { label: 'Role', value: jet.role },
                { label: 'Status', value: jet.status },
                { label: 'First Flight', value: jet.first_flight },
                { label: 'Introduced', value: jet.introduced },
                { label: 'Retired', value: jet.retired },
              ].map((spec, idx) => (
                spec.value && (
                  <div key={idx} className="bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">{spec.label}</p>
                    <p className="text-lg font-semibold text-white">{spec.value}</p>
                  </div>
                )
              ))}
            </div>

            {/* Additional Specs */}
            {jet.specs && jet.specs.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Additional Details</h4>
                <div className="space-y-3">
                  {jet.specs.map((spec, idx) => (
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
