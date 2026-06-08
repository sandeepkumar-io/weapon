'use client';

import { useState, useEffect } from 'react';
import DataCard from '@/components/DataCard';
import { getImageUrlForRifle } from '@/lib/imageGenerator';

interface Spec {
  label: string;
  value: string;
}

interface JetEngine {
  _id: string;
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  thrust?: string;
  type?: string;
  description: string;
  specs: Spec[];
}

export default function JetEnginesPage() {
  const [data, setData] = useState<JetEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jet-engines');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const origins = Array.from(new Set(data.map((item) => item.origin)));

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigin = !selectedOrigin || item.origin === selectedOrigin;
    return matchesSearch && matchesOrigin;
  });

  return (
    <div className="min-h-screen bg-slate-950" style={{
      background: 'linear-gradient(to bottom, rgba(6, 21, 43, 1), rgba(15, 23, 42, 1))'
    }}>
      <div className="relative pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 text-center">
            Jet Engines
          </h1>
          <p className="text-xl text-blue-300 text-center mb-8">
            Advanced propulsion systems database
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Origins</option>
              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-400">
              Showing <span className="text-blue-400 font-semibold">{filteredData.length}</span> of{' '}
              <span className="text-blue-400 font-semibold">{data.length}</span> jet engines
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-white mt-4">Loading jet engines...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        </div>
      )}

      {!loading && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <DataCard
                  key={item._id}
                  id={item.id}
                  name={item.name}
                  category={item.type || 'Engine'}
                  origin={item.origin}
                  description={item.description}
                  specs={item.specs}
                  imageUrl={getImageUrlForRifle(item.name)}
                  additionalInfo={[
                    { label: 'Manufacturer', value: item.manufacturer },
                    { label: 'Thrust', value: item.thrust },
                  ]}
                  detailPath={`/jet-engines/${encodeURIComponent(item.id)}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No jet engines found</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
