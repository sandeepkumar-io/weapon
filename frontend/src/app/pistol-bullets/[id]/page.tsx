'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import CartridgeAnatomy from '@/components/CartridgeAnatomy';

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
  diagramImage?: string;
  specs?: any[];
  [key: string]: any;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const child = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
};

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
        const current = result.data.find(
          (b: PistolBullet) => b.id?.trim?.().toLowerCase?.() === bulletId?.trim?.().toLowerCase?.()
        );
        if (current) setBullet(current);
        else setError(`Pistol Bullet with ID "${bulletId}" not found`);
      } else {
        setError('Failed to fetch pistol bullet data');
      }
    } catch (err) {
      setError('Error fetching pistol bullet details: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const blueprintBg = {
    backgroundColor: '#070910',
    backgroundImage:
      'radial-gradient(120% 80% at 50% -10%, rgba(34,211,238,0.10), transparent 60%), linear-gradient(rgba(34,211,238,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.045) 1px, transparent 1px)',
    backgroundSize: 'auto, 32px 32px, 32px 32px',
  } as React.CSSProperties;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={blueprintBg}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
          <p className="text-gray-300 mt-4">Loading cartridge data…</p>
        </div>
      </div>
    );
  }

  if (error || !bullet) {
    return (
      <div className="min-h-screen" style={blueprintBg}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error || 'Pistol bullet not found'}
          </div>
          <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const badges = [
    { label: 'Category', value: bullet.category },
    { label: 'Origin', value: bullet.origin },
    { label: 'Manufacturer', value: bullet.manufacturer },
  ].filter((b) => b.value);

  const specs = [
    { label: 'Caliber', value: bullet.caliber },
    { label: 'Bullet Diameter', value: bullet.bullet_diameter },
    { label: 'Bullet Weight', value: bullet.bullet_weight },
    { label: 'Muzzle Velocity', value: bullet.muzzle_velocity },
    { label: 'Muzzle Energy', value: bullet.muzzle_energy },
    { label: 'Case Length', value: bullet.case_length },
    { label: 'Overall Length', value: bullet.overall_length },
    { label: 'Introduced', value: bullet.introduced },
    { label: 'Used In', value: bullet.used_in },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen" style={blueprintBg}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <button
          onClick={() => router.back()}
          className="mb-8 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200 backdrop-blur transition-colors hover:bg-cyan-500/20"
        >
          ← Back
        </button>

        {/* Hero */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={child} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
            // Ammunition
          </motion.span>
          <motion.h1
            variants={child}
            className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-white"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            {bullet.name}
          </motion.h1>

          {badges.length > 0 && (
            <motion.div variants={child} className="mt-5 flex flex-wrap gap-3">
              {badges.map((b) => (
                <span key={b.label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
                  <span className="text-gray-400">{b.label}: </span>
                  <span className="font-semibold text-white">{b.value}</span>
                </span>
              ))}
            </motion.div>
          )}

          {bullet.description && (
            <motion.p variants={child} className="mt-6 max-w-3xl leading-relaxed text-gray-300">
              {bullet.description}
            </motion.p>
          )}
        </motion.div>

        {/* Specifications */}
        {specs.length > 0 && (
          <div className="mt-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">// Specifications</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">Technical sheet</h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {specs.map((s) => (
                <motion.div
                  key={s.label}
                  variants={child}
                  whileHover={{ y: -4 }}
                  className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
                >
                  <span className="pointer-events-none absolute top-0 left-0 h-3.5 w-3.5 rounded-tl-md border-t-2 border-l-2 border-amber-400/60" />
                  <span className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 rounded-br-md border-b-2 border-r-2 border-amber-400/60" />
                  <p className="text-[11px] uppercase tracking-wider text-amber-300/80">{s.label}</p>
                  <p className="mt-2 text-lg font-bold text-white">{s.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Anatomy */}
        <CartridgeAnatomy name={bullet.name} diagramImage={bullet.diagramImage} />
      </div>
    </div>
  );
}
