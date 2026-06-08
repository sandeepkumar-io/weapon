'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFallbackImageUrl } from '@/lib/imageGenerator';

interface Spec {
  label: string;
  value: string;
}

interface SniperRifleCardProps {
  id: string;
  name: string;
  category: string;
  origin: string;
  caliber?: string;
  effective_range?: string;
  weight?: string;
  description: string;
  specs: Spec[];
  imageUrl: string;
  detailPath?: string;
}

export default function SniperRifleCard({
  id,
  name,
  category,
  origin,
  caliber,
  effective_range,
  weight,
  description,
  specs,
  imageUrl,
  detailPath = `/sniper-rifles/${id}`,
}: SniperRifleCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [imageSrc, setImageSrc] = useState(imageUrl);

  const handleImageError = () => {
    setImageSrc(getFallbackImageUrl(name));
  };

  const handleCardClick = () => {
    router.push(detailPath);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer hover:shadow-xl" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative w-full h-64 bg-slate-950 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)'
        }}></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-sm text-blue-300">{category}</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-700 rounded p-2">
            <p className="text-xs text-gray-400">Origin</p>
            <p className="text-sm font-semibold text-white">{origin}</p>
          </div>
          {caliber && (
            <div className="bg-slate-700 rounded p-2">
              <p className="text-xs text-gray-400">Caliber</p>
              <p className="text-sm font-semibold text-white">{caliber}</p>
            </div>
          )}
          {effective_range && (
            <div className="bg-slate-700 rounded p-2">
              <p className="text-xs text-gray-400">Effective Range</p>
              <p className="text-sm font-semibold text-white">{effective_range}</p>
            </div>
          )}
          {weight && (
            <div className="bg-slate-700 rounded p-2">
              <p className="text-xs text-gray-400">Weight</p>
              <p className="text-sm font-semibold text-white">{weight}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4">
          {description.length > 150 ? description.substring(0, 150) + '...' : description}
        </p>

        {/* Specs Preview */}
        {specs.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-blue-300 uppercase mb-2">Key Specs</h4>
            <div className="space-y-1">
              {specs.slice(0, 3).map((spec, idx) => (
                <div key={idx} className="text-xs text-gray-400">
                  <span className="text-white font-semibold">{spec.label}:</span> {spec.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {expanded ? 'Show Less' : 'View Details'}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-bold text-blue-300 mb-3">Full Specifications</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="text-white font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
