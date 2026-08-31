import { getImageUrlForRifle } from './imageGenerator';

export interface AircraftPerformance {
  maximumSpeedKmh?: number | null;
  maximumSpeedMach?: number | null;
  combatRadiusKm?: number | null;
  ferryRangeKm?: number | null;
  serviceCeilingM?: number | null;
  rateOfClimbMPerSecond?: number | null;
}

export interface AircraftEngine {
  name?: string;
  manufacturer?: string;
  type?: string;
  count?: number | null;
  dryThrustKNEach?: number | null;
  afterburningThrustKNEach?: number | null;
}

export interface AircraftStealth {
  stealthCapability?: boolean;
  radarCrossSectionSqM?: number | null;
  internalWeaponsBay?: boolean;
}

/** Shape returned by `GET /api/fighter-jets` (the projected list). */
export interface AircraftListItem {
  _id: string;
  id: string;
  slug: string;
  name: string;
  description: string;
  manufacturer?: string;
  originCountry?: string;
  datasetCountries?: string[];
  aircraftType?: string;
  roles?: string[];
  generation?: string;
  generationTier?: string;
  status?: string;
  statusGroup?: string;
  introducedYear?: number | null;
  firstFlightDate?: string;
  crew?: number | null;
  dimensions?: { lengthM?: number | null; wingspanM?: number | null; heightM?: number | null };
  weights?: {
    emptyWeightKg?: number | null;
    maximumTakeoffWeightKg?: number | null;
    maximumPayloadKg?: number | null;
  };
  performance?: AircraftPerformance;
  engine?: AircraftEngine;
  radar?: { name?: string };
  armament?: { hardpoints?: number | null; internalGun?: { name?: string; caliberMm?: number | null } };
  stealth?: AircraftStealth;
  operational?: { operators?: string[]; numberBuilt?: number | null; unitCostUsd?: number | null };
  media?: { imageUrls?: string[] };
  generatedImages?: string[];
  variants?: string[];
}

/** Shape returned by `GET /api/fighter-jets/[slug]` (the full document). */
export interface AircraftDetailItem extends AircraftListItem {
  designer?: string;
  radar?: { name?: string; manufacturer?: string; type?: string; rangeKm?: number | null };
  electronicWarfare?: {
    systems?: string[];
    radarWarningReceiver?: string;
    missileApproachWarningSystem?: string;
    countermeasures?: string[];
  };
  armament?: {
    internalGun?: { name?: string; caliberMm?: number | null };
    hardpoints?: number | null;
    maximumExternalStoresKg?: number | null;
    airToAirMissiles?: string[];
    airToGroundMissiles?: string[];
    antiShipMissiles?: string[];
    guidedBombs?: string[];
    unguidedBombs?: string[];
    rockets?: string[];
    otherWeapons?: string[];
  };
  avionics?: {
    flightControlSystem?: string;
    navigationSystems?: string[];
    communicationSystems?: string[];
    helmetMountedDisplay?: string;
    infraredSearchAndTrack?: string;
  };
  operational?: {
    operators?: string[];
    numberBuilt?: number | null;
    unitCostUsd?: number | null;
    productionStartYear?: number | null;
    productionEndYear?: number | null;
  };
  media?: {
    imageUrls?: string[];
    videoUrl?: string;
    componentImages?: Record<string, Record<string, string>>;
  };
  sources?: string[];
  lastVerifiedAt?: string;
}

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/** `1234.5` -> `"1,235"`. Returns null for missing values so callers can fall back. */
export function formatNumber(value?: number | null, digits = 0): string | null {
  if (!isNumber(value)) return null;
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

const withUnit = (value: number | null | undefined, unit: string, digits = 0) => {
  const formatted = formatNumber(value, digits);
  return formatted ? `${formatted} ${unit}` : null;
};

export const formatKm = (value?: number | null) => withUnit(value, 'km');
export const formatMetres = (value?: number | null) => withUnit(value, 'm');
export const formatKg = (value?: number | null) => withUnit(value, 'kg');
export const formatKn = (value?: number | null) => withUnit(value, 'kN', 1);

/** Prefers Mach (comparable across aircraft), falling back to km/h. */
export function formatSpeed(performance?: AircraftPerformance): string | null {
  if (isNumber(performance?.maximumSpeedMach)) return `Mach ${performance.maximumSpeedMach}`;
  return withUnit(performance?.maximumSpeedKmh, 'km/h');
}

/** Combined afterburning thrust across all engines, e.g. `"2 x 131 kN"`. */
export function formatThrust(engine?: AircraftEngine): string | null {
  const each = isNumber(engine?.afterburningThrustKNEach)
    ? engine.afterburningThrustKNEach
    : engine?.dryThrustKNEach;
  if (!isNumber(each)) return null;

  const count = isNumber(engine?.count) && engine.count > 0 ? engine.count : 1;
  const perEngine = formatNumber(each, each % 1 === 0 ? 0 : 1);
  return count > 1 ? `${count} x ${perEngine} kN` : `${perEngine} kN`;
}

/** `23000000` -> `"$23.0M"`. */
export function formatCost(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${formatNumber(value)}`;
}

/** `"1978-03-10"` -> `"10 Mar 1978"`; passes anything unparseable straight through. */
export function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** First dataset image, falling back to a generated placeholder. */
export function aircraftImage(aircraft: AircraftListItem): string {
  return (
    aircraft.generatedImages?.[0] || aircraft.media?.imageUrls?.[0] || getImageUrlForRifle(aircraft.name)
  );
}

/** Every image for the detail carousel, in dataset order. */
export function aircraftImages(aircraft: AircraftListItem): string[] {
  const images = aircraft.generatedImages?.length
    ? aircraft.generatedImages
    : aircraft.media?.imageUrls || [];
  return images.length ? images : [getImageUrlForRifle(aircraft.name)];
}

/** Short label for the generation badge, e.g. `"4.5 GEN"`. */
export function generationLabel(tier?: string): string | null {
  if (!tier || tier === 'Unclassified') return null;
  return `${tier} gen`;
}

/** Sort helper for the tier filter, so "4.5" sits between "4th" and "5th". */
export function generationRank(tier: string): number {
  const match = tier.match(/^(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}
