'use client';

import { useState, useEffect } from 'react';
import JetEngineDetailCard from '@/components/JetEngineDetailCard';
import { getImageUrlForRifle } from '@/lib/imageGenerator';
import { useParams, useRouter } from 'next/navigation';

interface Spec {
  label: string;
  value: string;
  icon?: string;
  unit?: string;
}

interface RelatedEngine {
  _id: string;
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  thrust?: string;
  usedIn?: string;
  status?: string;
  imageUrl?: string;
}

interface JetEngine {
  _id: string;
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  type: string;
  description: string;
  thrust?: string;
  thrust_with_afterburner?: string;
  maxThrustWithAB?: string;
  used_in?: string;
  usedIn?: string;
  bypass_ratio?: string;
  pressure_ratio?: string;
  mass_flow?: string;
  dry_weight?: string;
  length?: string;
  diameter?: string;
  specs?: Spec[];
}

export default function JetEngineDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Decode URL parameter to handle spaces and special characters
  const engineId = decodeURIComponent(params.id as string);

  const [engine, setEngine] = useState<JetEngine | null>(null);
  const [relatedEngines, setRelatedEngines] = useState<RelatedEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEngineDetails();
  }, [engineId]);

  const fetchEngineDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jet-engines');
      const result = await response.json();

      if (result.success) {
        const engines = result.data;
        // Find engine by ID (case-insensitive and trim whitespace)
        const current = engines.find((e: JetEngine) =>
          e.id?.trim?.().toLowerCase?.() === engineId?.trim?.().toLowerCase?.()
        );

        if (current) {
          setEngine(current);
          // Get related engines (all except current)
          const related = engines
            .filter((e: JetEngine) => e._id !== current._id)
            .slice(0, 3)
            .map((e: JetEngine) => ({
              _id: e._id, // Add unique MongoDB ID
              id: e.id,
              name: e.name,
              manufacturer: e.manufacturer,
              type: e.type || 'Turbofan',
              thrust: e.thrust,
              usedIn: (e as any).used_in || e.usedIn || 'Unknown',
              status: 'Active',
              imageUrl: (e as any).generatedImages?.[0] || getImageUrlForRifle(e.name),
            }));

          setRelatedEngines(related);
        } else {
          setError(`Engine with ID "${engineId}" not found. Available IDs: ${engines.slice(0, 5).map((e: JetEngine) => e.id).join(', ')}`);
        }
      } else {
        setError('Failed to fetch engine data');
      }
    } catch (err) {
      setError('Error fetching engine details: ' + (err as Error).message);
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
          <p className="text-white mt-4">Loading engine details...</p>
        </div>
      </div>
    );
  }

  if (error || !engine) {
    return (
      <div className="min-h-screen bg-slate-950" style={{
        background: 'linear-gradient(to bottom, #0b2a5c, #061831)'
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error || 'Engine not found'}
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

  // Format thrust values
  const maxThrustWithAB = engine.maxThrustWithAB || engine.thrust_with_afterburner || engine.thrust || '0 lbf';
  const dryThrust = engine.thrust || '0 lbf';

  // Build specs array from individual fields
  const specsData: Spec[] = [];
  if (engine.thrust) specsData.push({ label: 'Thrust', value: engine.thrust });
  if (engine.bypass_ratio) specsData.push({ label: 'Bypass Ratio', value: engine.bypass_ratio });
  if (engine.pressure_ratio) specsData.push({ label: 'Pressure Ratio', value: engine.pressure_ratio });
  if (engine.mass_flow) specsData.push({ label: 'Mass Flow', value: engine.mass_flow });
  if (engine.dry_weight) specsData.push({ label: 'Dry Weight', value: engine.dry_weight });
  if (engine.length) specsData.push({ label: 'Length', value: engine.length });
  if (engine.diameter) specsData.push({ label: 'Diameter', value: engine.diameter });

  // Use existing specs array if available, otherwise use built specs
  const specs = engine.specs && engine.specs.length > 0 ? engine.specs : specsData;

  // Parse specs with default icons
  const specsWithIcons: Spec[] = specs.map((spec: Spec, idx: number) => ({
    ...spec,
    icon: spec.icon || ['🔥', '🌬', '📊', '📈', '⚖', '📏'][idx % 6],
  }));

  return (
    <JetEngineDetailCard
      id={engine.id}
      name={engine.name}
      manufacturer={engine.manufacturer}
      origin={engine.origin}
      type={engine.type}
      description={engine.description}
      maxThrustWithAB={maxThrustWithAB}
      dryThrust={dryThrust}
      usedIn={(engine as any).used_in || engine.usedIn}
      specs={specsWithIcons}
      imageUrl={(engine as any).imageUrl || getImageUrlForRifle(engine.name)}
      generatedImages={(engine as any).generatedImages}
      relatedEngines={relatedEngines}
      onViewDatasheet={() => {
        alert(`Datasheet for ${engine.name} would be downloaded here`);
      }}
    />
  );
}
