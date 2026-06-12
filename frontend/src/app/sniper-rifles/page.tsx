'use client';

import { useState, useEffect } from 'react';
import SniperRifleCard from '@/components/SniperRifleCard';
import { getImageUrlForRifle } from '@/lib/imageGenerator';

interface Spec {
  label: string;
  value: string;
}

interface SniperRifle {
  _id: string;
  id: string;
  name: string;
  category: string;
  origin: string;
  caliber?: string;
  effective_range?: string;
  weight?: string;
  description: string;
  specs: Spec[];
}

export default function SniperRiflesPage() {
  const [sniperRifles, setSniperRifles] = useState<SniperRifle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');

  useEffect(() => {
    fetchSniperRifles();
  }, []);

  const fetchSniperRifles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sniper-rifles');
      const data = await response.json();

      if (data.success) {
        setSniperRifles(data.data);
      } else {
        setError('Failed to fetch sniper rifles');
      }
    } catch (err) {
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique origins for filter
  const origins = Array.from(new Set(sniperRifles.map((rifle) => rifle.origin)));

  // Filter sniper rifles based on search and origin
  const filteredRifles = sniperRifles.filter((rifle) => {
    const matchesSearch =
      rifle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rifle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigin = !selectedOrigin || rifle.origin === selectedOrigin;
    return matchesSearch && matchesOrigin;
  });

  return (
    <div className="min-h-screen bg-slate-950" style={{
      background: 'linear-gradient(to bottom, #160808, #000000)'
    }}>
      {/* Header */}
      <div className="relative pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 text-center">
            Sniper Rifles
          </h1>
          <p className="text-xl text-blue-300 text-center mb-8">
            Precision long-range weapons database
          </p>

          {/* Search and Filter Section */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Origin Filter */}
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">All Origins</option>
              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>

          {/* Results Counter */}
          <div className="text-center mb-8">
            <p className="text-gray-400">
              Showing <span className="text-blue-400 font-semibold">{filteredRifles.length}</span> of{' '}
              <span className="text-blue-400 font-semibold">{sniperRifles.length}</span> sniper
              rifles
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-white mt-4">Loading sniper rifles...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        </div>
      )}

      {/* Grid of Sniper Rifle Cards */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          {filteredRifles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRifles.map((rifle) => (
                <SniperRifleCard
                  key={rifle._id}
                  id={rifle.id}
                  name={rifle.name}
                  category={rifle.category}
                  origin={rifle.origin}
                  caliber={rifle.caliber}
                  effective_range={rifle.effective_range}
                  weight={rifle.weight}
                  description={rifle.description}
                  specs={rifle.specs}
                  imageUrl={(rifle as any).generatedImages?.[0] || getImageUrlForRifle(rifle.name)}
                  detailPath={`/sniper-rifles/${encodeURIComponent(rifle.id)}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No sniper rifles found</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
