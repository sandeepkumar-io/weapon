'use client';

import Link from 'next/link';
import {
  LuArrowLeft,
  LuBomb,
  LuCpu,
  LuCrosshair,
  LuExternalLink,
  LuEyeOff,
  LuFlame,
  LuGauge,
  LuGlobe,
  LuLayers,
  LuPlane,
  LuRadar,
  LuRuler,
  LuSatelliteDish,
  LuTarget,
} from 'react-icons/lu';
import HeroCarousel from './HeroCarousel';
import {
  ChipList,
  ComponentGrid,
  Section,
  SpecGrid,
  rows,
  youTubeId,
} from './DetailPrimitives';
import AircraftCard from './AircraftCard';
import {
  aircraftImages,
  formatCost,
  formatDate,
  formatKg,
  formatKm,
  formatKn,
  formatMetres,
  formatNumber,
  formatSpeed,
  formatThrust,
  generationLabel,
  type AircraftDetailItem,
  type AircraftListItem,
} from '@/lib/aircraftFormat';

const WEAPON_CATEGORIES = [
  { key: 'airToAirMissiles', label: 'Air-to-air missiles' },
  { key: 'airToGroundMissiles', label: 'Air-to-ground missiles' },
  { key: 'antiShipMissiles', label: 'Anti-ship missiles' },
  { key: 'guidedBombs', label: 'Guided bombs' },
  { key: 'unguidedBombs', label: 'Unguided bombs' },
  { key: 'rockets', label: 'Rockets' },
  { key: 'otherWeapons', label: 'Other weapons' },
] as const;

export default function AircraftDetail({
  aircraft,
  related,
  basePath = '/fighter-jets',
}: {
  aircraft: AircraftDetailItem;
  related: AircraftListItem[];
  basePath?: string;
}) {
  const { performance, engine, radar, armament, avionics, stealth, operational, media } = aircraft;
  const componentImages = media?.componentImages || {};
  const videoId = youTubeId(media?.videoUrl);

  const headlineStats = [
    { icon: LuGauge, label: 'Max speed', value: formatSpeed(performance) },
    { icon: LuTarget, label: 'Combat radius', value: formatKm(performance?.combatRadiusKm) },
    { icon: LuPlane, label: 'Service ceiling', value: formatMetres(performance?.serviceCeilingM) },
    { icon: LuFlame, label: 'Thrust', value: formatThrust(engine) },
  ];

  const overviewRows = rows([
    { label: 'Manufacturer', value: aircraft.manufacturer || null },
    { label: 'Designer', value: aircraft.designer || null },
    { label: 'Origin', value: aircraft.originCountry || null },
    { label: 'Type', value: aircraft.aircraftType || null },
    { label: 'Generation', value: aircraft.generation || null },
    { label: 'Status', value: aircraft.status || null },
    { label: 'Crew', value: formatNumber(aircraft.crew) },
    { label: 'First flight', value: formatDate(aircraft.firstFlightDate) },
    { label: 'Introduced', value: aircraft.introducedYear ? String(aircraft.introducedYear) : null },
  ]);

  const dimensionRows = rows([
    { label: 'Length', value: formatMetres(aircraft.dimensions?.lengthM) },
    { label: 'Wingspan', value: formatMetres(aircraft.dimensions?.wingspanM) },
    { label: 'Height', value: formatMetres(aircraft.dimensions?.heightM) },
    { label: 'Empty weight', value: formatKg(aircraft.weights?.emptyWeightKg) },
    { label: 'Max takeoff weight', value: formatKg(aircraft.weights?.maximumTakeoffWeightKg) },
    { label: 'Max payload', value: formatKg(aircraft.weights?.maximumPayloadKg) },
  ]);

  const performanceRows = rows([
    { label: 'Max speed', value: formatSpeed(performance) },
    {
      label: 'Max speed (km/h)',
      value: performance?.maximumSpeedKmh
        ? `${formatNumber(performance.maximumSpeedKmh)} km/h`
        : null,
    },
    { label: 'Combat radius', value: formatKm(performance?.combatRadiusKm) },
    { label: 'Ferry range', value: formatKm(performance?.ferryRangeKm) },
    { label: 'Service ceiling', value: formatMetres(performance?.serviceCeilingM) },
    {
      label: 'Rate of climb',
      value: performance?.rateOfClimbMPerSecond
        ? `${formatNumber(performance.rateOfClimbMPerSecond)} m/s`
        : null,
    },
  ]);

  const engineRows = rows([
    { label: 'Engine', value: engine?.name || null },
    { label: 'Manufacturer', value: engine?.manufacturer || null },
    { label: 'Type', value: engine?.type || null },
    { label: 'Count', value: formatNumber(engine?.count) },
    { label: 'Dry thrust (each)', value: formatKn(engine?.dryThrustKNEach) },
    { label: 'Afterburning thrust (each)', value: formatKn(engine?.afterburningThrustKNEach) },
  ]);

  const sensorRows = rows([
    { label: 'Radar', value: radar?.name || null },
    { label: 'Radar manufacturer', value: radar?.manufacturer || null },
    { label: 'Radar type', value: radar?.type || null },
    { label: 'Radar range', value: formatKm(radar?.rangeKm) },
    { label: 'IRST', value: avionics?.infraredSearchAndTrack || null },
    { label: 'Helmet-mounted display', value: avionics?.helmetMountedDisplay || null },
    { label: 'Flight control', value: avionics?.flightControlSystem || null },
  ]);

  const stealthRows = rows([
    { label: 'Stealth capable', value: stealth?.stealthCapability ? 'Yes' : 'No' },
    {
      label: 'Radar cross-section',
      value: stealth?.radarCrossSectionSqM ? `${stealth.radarCrossSectionSqM} m²` : null,
    },
    { label: 'Internal weapons bay', value: stealth?.internalWeaponsBay ? 'Yes' : 'No' },
  ]);

  const productionRows = rows([
    { label: 'Number built', value: formatNumber(operational?.numberBuilt) },
    { label: 'Unit cost', value: formatCost(operational?.unitCostUsd) },
    {
      label: 'Production start',
      value: operational?.productionStartYear ? String(operational.productionStartYear) : null,
    },
    {
      label: 'Production end',
      value: operational?.productionEndYear ? String(operational.productionEndYear) : null,
    },
  ]);

  const armamentRows = rows([
    { label: 'Internal gun', value: armament?.internalGun?.name || null },
    {
      label: 'Gun calibre',
      value: armament?.internalGun?.caliberMm ? `${armament.internalGun.caliberMm} mm` : null,
    },
    { label: 'Hardpoints', value: formatNumber(armament?.hardpoints) },
    { label: 'Max external stores', value: formatKg(armament?.maximumExternalStoresKg) },
  ]);

  const ewRows = rows([
    { label: 'Radar warning receiver', value: aircraft.electronicWarfare?.radarWarningReceiver || null },
    {
      label: 'Missile approach warning',
      value: aircraft.electronicWarfare?.missileApproachWarningSystem || null,
    },
  ]);

  const generation = generationLabel(aircraft.generationTier);
  const metaLine = [aircraft.manufacturer, aircraft.originCountry, aircraft.aircraftType]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen overflow-x-hidden pt-16">
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary"
        >
          <LuArrowLeft className="h-4 w-4" /> All aircraft
        </Link>
      </div>

      <div className="mt-6">
        <HeroCarousel
          images={aircraftImages(aircraft)}
          name={aircraft.name}
          badge={generation || aircraft.statusGroup}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Aircraft dossier
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl">
          {aircraft.name}
        </h1>
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {metaLine}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {generation && (
            <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {generation}
            </span>
          )}
          {stealth?.stealthCapability && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              <LuEyeOff className="h-3 w-3" /> Stealth
            </span>
          )}
          {aircraft.statusGroup && (
            <span className="rounded-md border border-border bg-[#0f0f0f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {aircraft.statusGroup}
            </span>
          )}
        </div>

        {/* Headline figures */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {headlineStats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-background/50 p-4">
              <span className="mb-4 block text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block text-sm">{value || '—'}</strong>
            </div>
          ))}
        </div>

        {aircraft.description && (
          <Section title="Overview" icon={LuPlane}>
            <p className="max-w-3xl leading-8 text-muted-foreground">{aircraft.description}</p>
            {aircraft.roles && aircraft.roles.length > 0 && (
              <div className="mt-6">
                <ChipList items={aircraft.roles} tone="primary" />
              </div>
            )}
            <div className="mt-6">
              <SpecGrid items={overviewRows} />
            </div>
          </Section>
        )}

        {dimensionRows.length > 0 && (
          <Section title="Dimensions & weights" icon={LuRuler}>
            <SpecGrid items={dimensionRows} />
          </Section>
        )}

        {performanceRows.length > 0 && (
          <Section title="Performance" icon={LuGauge}>
            <SpecGrid items={performanceRows} />
          </Section>
        )}

        {engineRows.length > 0 && (
          <Section title="Powerplant" icon={LuFlame}>
            <SpecGrid items={engineRows} />
            <ComponentGrid
              label="Engine"
              names={engine?.name ? [engine.name] : []}
              images={componentImages.engine}
            />
          </Section>
        )}

        {sensorRows.length > 0 && (
          <Section title="Sensors & avionics" icon={LuRadar}>
            <SpecGrid items={sensorRows} />
            <ComponentGrid
              label="Radar"
              names={radar?.name ? [radar.name] : []}
              images={componentImages.radar}
            />
            {avionics?.navigationSystems && avionics.navigationSystems.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Navigation
                </h3>
                <ChipList items={avionics.navigationSystems} />
              </div>
            )}
            {avionics?.communicationSystems && avionics.communicationSystems.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Communications
                </h3>
                <ChipList items={avionics.communicationSystems} />
              </div>
            )}
          </Section>
        )}

        {(ewRows.length > 0 ||
          aircraft.electronicWarfare?.systems?.length ||
          aircraft.electronicWarfare?.countermeasures?.length) && (
          <Section title="Electronic warfare" icon={LuSatelliteDish}>
            <SpecGrid items={ewRows} />
            {aircraft.electronicWarfare?.systems &&
              aircraft.electronicWarfare.systems.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Systems
                  </h3>
                  <ChipList items={aircraft.electronicWarfare.systems} />
                </div>
              )}
            {aircraft.electronicWarfare?.countermeasures &&
              aircraft.electronicWarfare.countermeasures.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Countermeasures
                  </h3>
                  <ChipList items={aircraft.electronicWarfare.countermeasures} />
                </div>
              )}
          </Section>
        )}

        <Section title="Armament" icon={LuCrosshair}>
          <SpecGrid items={armamentRows} />
          {WEAPON_CATEGORIES.map(({ key, label }) => (
            <ComponentGrid
              key={key}
              label={label}
              names={armament?.[key] as string[] | undefined}
              images={componentImages[key]}
            />
          ))}
        </Section>

        {stealthRows.length > 0 && (
          <Section title="Signature" icon={LuEyeOff}>
            <SpecGrid items={stealthRows} />
          </Section>
        )}

        {aircraft.variants && aircraft.variants.length > 0 && (
          <Section title="Variants" icon={LuLayers}>
            <ComponentGrid
              label={`${aircraft.variants.length} variants`}
              names={aircraft.variants}
              images={componentImages.variants}
            />
          </Section>
        )}

        {(productionRows.length > 0 || operational?.operators?.length) && (
          <Section title="Service & production" icon={LuGlobe}>
            <SpecGrid items={productionRows} />
            {operational?.operators && operational.operators.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Operators ({operational.operators.length})
                </h3>
                <ChipList items={operational.operators} />
              </div>
            )}
          </Section>
        )}

        {videoId && (
          <Section title="Footage" icon={LuCpu}>
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-[#0a0a0a]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${aircraft.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Section>
        )}

        {aircraft.sources && aircraft.sources.length > 0 && (
          <Section title="Sources" icon={LuBomb}>
            <ul className="grid gap-2">
              {aircraft.sources.map((source) => (
                <li key={source}>
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 break-all text-sm text-muted-foreground transition hover:text-primary"
                  >
                    <LuExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {related.length > 0 && (
          <Section title="More aircraft" icon={LuPlane}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <AircraftCard
                  key={item._id}
                  aircraft={item}
                  basePath={basePath}
                  index={index}
                />
              ))}
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}
