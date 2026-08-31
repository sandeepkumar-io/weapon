'use client';

import Link from 'next/link';
import { LuArrowRight, LuFlame, LuGauge, LuMoveDiagonal, LuScale, LuWind } from 'react-icons/lu';
import { getFallbackImageUrl } from '@/lib/imageGenerator';
import {
  engineImage,
  formatRatio,
  formatThrustKN,
  generationLabel,
  maxThrust,
  type EngineListItem,
} from '@/lib/engineFormat';

const STATUS_STYLES: Record<string, string> = {
  'In service': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'In production': 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  'In development': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  Retired: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400',
};

/**
 * Catalog card for one jet engine. Shows the four figures that let two engines
 * be compared at a glance — max thrust, dry thrust, thrust-to-weight and
 * bypass ratio — and links to `${basePath}/${slug}`.
 */
export default function EngineCard({
  engine,
  basePath = '/jet-engines',
  index = 0,
}: {
  engine: EngineListItem;
  basePath?: string;
  index?: number;
}) {
  const generation = generationLabel(engine.generationTier);
  const isVectoring = Boolean(engine.nozzle?.thrustVectoring);
  const statusStyle = STATUS_STYLES[engine.statusGroup || ''] || STATUS_STYLES['In service'];

  const stats = [
    { icon: LuFlame, label: 'Max thrust', value: maxThrust(engine.thrust) },
    { icon: LuGauge, label: 'Dry thrust', value: formatThrustKN(engine.thrust?.dryThrustKN) },
    { icon: LuScale, label: 'Thrust:weight', value: formatRatio(engine.thrust?.thrustToWeightRatio) },
    { icon: LuWind, label: 'Bypass ratio', value: formatRatio(engine.performance?.bypassRatio) },
  ];

  return (
    <Link
      href={`${basePath}/${encodeURIComponent(engine.slug || engine.id)}`}
      className="technical-panel group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-38px_rgba(34,211,238,0.65)]"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={engineImage(engine)}
          alt={engine.name}
          loading={index > 2 ? 'lazy' : 'eager'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getFallbackImageUrl(engine.name);
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="image-shade absolute inset-0" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {generation && (
            <span className="rounded-md border border-primary/30 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
              {generation}
            </span>
          )}
          {isVectoring && (
            <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent backdrop-blur">
              <LuMoveDiagonal className="h-3 w-3" /> Vectoring
            </span>
          )}
        </div>

        <span
          className={`absolute right-4 top-4 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur ${statusStyle}`}
        >
          {engine.statusGroup}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          {engine.originCountry && (
            <p className="text-xs font-medium text-primary">{engine.originCountry}</p>
          )}
          <h3 className="font-display text-[1.25rem] font-bold uppercase leading-tight tracking-tight line-clamp-1">
            {engine.name}
          </h3>
          {engine.manufacturer && (
            <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
              {engine.manufacturer}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {engine.engineType && (
            <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
              {engine.engineType}
            </span>
          )}
          {engine.applications?.slice(0, 2).map((application) => (
            <span
              key={application}
              className="rounded border border-border bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {application}
            </span>
          ))}
          {(engine.applications?.length || 0) > 2 && (
            <span className="px-1 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              +{(engine.applications?.length || 0) - 2}
            </span>
          )}
        </div>

        {engine.description && (
          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {engine.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#0f0f0f] p-3">
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground">
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </span>
              <strong className="mt-1 block text-sm">{value || '—'}</strong>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <span>Show more</span>
          <LuArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
