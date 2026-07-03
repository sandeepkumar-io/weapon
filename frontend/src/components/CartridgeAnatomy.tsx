'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import CartridgeDiagram from './CartridgeDiagram';

const EASE = [0.16, 1, 0.3, 1] as const;

const CYAN = '#22d3ee';
const AMBER = '#f59e0b';

interface Part {
  n: number;
  key: string;
  title: string;
  sub: string;
  desc: string;
  group: 'projectile' | 'case';
}

const PARTS: Part[] = [
  { n: 1, key: 'projectile', group: 'projectile', title: 'Projectile (Bullet)', sub: 'FMJ', desc: 'The slug launched down the barrel — a lead core sheathed in a metal jacket.' },
  { n: 2, key: 'jacket', group: 'projectile', title: 'Copper Jacket', sub: 'Gilding metal', desc: 'Shell enclosing the lead; cuts barrel fouling and holds shape at velocity.' },
  { n: 3, key: 'core', group: 'projectile', title: 'Lead Core', sub: 'Mass', desc: 'Dense lead that gives the bullet its weight and downrange momentum.' },
  { n: 4, key: 'mouth', group: 'projectile', title: 'Case Mouth / Neck', sub: 'Crimp', desc: 'Opening that grips and seals the seated bullet against setback.' },
  { n: 5, key: 'case', group: 'case', title: 'Brass Case', sub: 'Cartridge case', desc: 'Binds every component and expands to seal the chamber when fired.' },
  { n: 6, key: 'powder', group: 'case', title: 'Propellant', sub: 'Smokeless powder', desc: 'Powder charge that deflagrates into high-pressure gas to drive the bullet.' },
  { n: 7, key: 'primer', group: 'case', title: 'Primer', sub: 'Boxer', desc: 'Struck by the firing pin; its spark ignites the propellant charge.' },
  { n: 8, key: 'flash', group: 'case', title: 'Flash Hole', sub: 'Ignition path', desc: 'Channel routing the primer flame into the powder charge.' },
  { n: 9, key: 'rim', group: 'case', title: 'Rim / Extractor Groove', sub: 'Rimless', desc: 'Groove the extractor grips to pull the spent case from the chamber.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const child = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
};

/** Compact bespoke glyph per cartridge part (stroke = currentColor). */
function PartIcon({ k }: { k: string }) {
  const c = 'currentColor';
  switch (k) {
    case 'projectile':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M12 2c3 2.5 4 5 4 8v9H8v-9c0-3 1-5.5 4-8Z" />
        </svg>
      );
    case 'jacket':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M12 3c2.6 2 3.5 4.4 3.5 7v8h-7v-8c0-2.6.9-5 3.5-7Z" />
          <path d="M12 6c1.3 1.3 1.8 2.6 1.8 4.3V18h-3.6v-7.7C10.2 8.6 10.7 7.3 12 6Z" opacity="0.5" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill={c} stroke="none">
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
    case 'mouth':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M6 9a6 3 0 0 0 12 0" />
          <path d="M6 9v8M18 9v8" />
        </svg>
      );
    case 'case':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <rect x="8" y="4" width="8" height="16" rx="2" />
          <path d="M8 7h8" />
        </svg>
      );
    case 'powder':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill={c} stroke="none">
          <circle cx="8" cy="9" r="1.6" /><circle cx="13" cy="7" r="1.6" /><circle cx="16" cy="11" r="1.6" />
          <circle cx="10" cy="13" r="1.6" /><circle cx="14" cy="15" r="1.6" /><circle cx="8" cy="16" r="1.6" />
        </svg>
      );
    case 'primer':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" fill={c} />
        </svg>
      );
    case 'flash':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M12 3v10" /><circle cx="12" cy="18" r="3" fill={c} stroke="none" />
        </svg>
      );
    case 'rim':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={c} strokeWidth="1.6">
          <circle cx="12" cy="12" r="7" /><path d="M12 5v3M12 16v3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CartridgeAnatomy({
  name,
  diagramImage,
}: {
  name: string;
  diagramImage?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
          // Anatomy
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">Cartridge breakdown</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Sectional view of the {name}, with every component called out — from the projectile down to
          the primer.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Diagram panel */}
        {diagramImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden rounded-lg border border-cyan-500/20 bg-[#0b0e16]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          >
            {/* corner brackets */}
            {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((c) => (
              <span key={c} className={`pointer-events-none absolute h-4 w-4 ${c} border-cyan-400/60 rounded-sm`} />
            ))}
            <div className="relative z-10 p-4">
              <CartridgeDiagram hovered={hovered} onHover={setHovered} />
            </div>
            {/* scan line */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 z-20 h-24"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.12), transparent)' }}
              initial={{ y: '-30%' }}
              animate={{ y: '130%' }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* Parts index */}
        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8%' }}
          className="grid content-start gap-3"
        >
          {PARTS.map((p) => {
            const accent = p.group === 'projectile' ? CYAN : AMBER;
            return (
              <motion.li
                key={p.key}
                variants={child}
                whileHover={{ x: 4 }}
                onMouseEnter={() => setHovered(p.key)}
                onMouseLeave={() => setHovered(null)}
                className={`group flex items-start gap-4 rounded-xl border border-white/10 p-4 transition-all ${
                  hovered && hovered !== p.key ? 'opacity-50' : 'opacity-100'
                }`}
                style={{
                  borderLeft: `3px solid ${accent}`,
                  background: hovered === p.key ? `${accent}14` : 'rgba(255,255,255,0.03)',
                  boxShadow: hovered === p.key ? `0 8px 30px -12px ${accent}` : undefined,
                }}
              >
                <div
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                  style={{ background: `${accent}1a`, color: accent }}
                >
                  <PartIcon k={p.key} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color: accent }}>
                      {String(p.n).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-gray-400">
                      {p.sub}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{p.desc}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>

      {/* legend */}
      <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-gray-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: CYAN }} /> Projectile group
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: AMBER }} /> Case &amp; charge group
        </span>
      </div>
    </section>
  );
}
