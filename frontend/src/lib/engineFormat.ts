import { getImageUrlForRifle } from './imageGenerator';
import { formatNumber } from './aircraftFormat';

export {
  formatCost,
  formatKg,
  formatKn,
  formatMetres,
  formatNumber,
  generationLabel,
  generationRank,
} from './aircraftFormat';

export interface EngineThrust {
  dryThrustKN?: number | null;
  afterburningThrustKN?: number | null;
  thrustToWeightRatio?: number | null;
  specificFuelConsumptionDryKgPerKNPerHour?: number | null;
  specificFuelConsumptionAfterburningKgPerKNPerHour?: number | null;
}

export interface EnginePerformance {
  bypassRatio?: number | null;
  overallPressureRatio?: number | null;
  airMassFlowKgPerSecond?: number | null;
  maximumRpm?: number | null;
  supercruiseCapable?: boolean;
}

/** Shape returned by `GET /api/jet-engines` (the projected list). */
export interface EngineListItem {
  _id: string;
  id: string;
  slug: string;
  name: string;
  description: string;
  manufacturer?: string;
  originCountry?: string;
  datasetCountries?: string[];
  engineType?: string;
  engineTypeGroup?: string;
  generation?: string;
  generationTier?: string;
  status?: string;
  statusGroup?: string;
  firstRunYear?: number | null;
  introducedYear?: number | null;
  applications?: string[];
  dimensions?: { lengthM?: number | null; diameterM?: number | null; dryWeightKg?: number | null };
  thrust?: EngineThrust;
  performance?: EnginePerformance;
  nozzle?: { thrustVectoring?: boolean };
  operational?: { operators?: string[]; numberBuilt?: number | null; unitCostUsd?: number | null };
  media?: { imageUrls?: string[] };
  generatedImages?: string[];
  variants?: string[];
}

/** Shape returned by `GET /api/jet-engines/[slug]` (the full document). */
export interface EngineDetailItem extends EngineListItem {
  designer?: string;
  alsoKnownAs?: string[];
  programName?: string;
  compressor?: {
    type?: string;
    fanStages?: number | null;
    lowPressureStages?: number | null;
    highPressureStages?: number | null;
    bladeMaterial?: string;
    fanDiameterM?: number | null;
    fanBladeType?: string;
    fanBladeMaterial?: string;
    fanPressureRatio?: number | null;
  };
  combustor?: { type?: string; fuelInjectionType?: string; linerMaterial?: string };
  turbine?: {
    highPressureStages?: number | null;
    lowPressureStages?: number | null;
    inletTemperatureK?: number | null;
    bladeMaterial?: string;
    bladeCoolingType?: string;
  };
  afterburner?: {
    type?: string;
    flameHolderType?: string;
    linerMaterial?: string;
    maximumTemperatureK?: number | null;
    screechSuppression?: string;
  };
  nozzle?: {
    type?: string;
    thrustVectoring?: boolean;
    vectoringAxes?: string;
    maximumDeflectionDegrees?: number | null;
  };
  controlSystem?: { type?: string; manufacturer?: string; fadecGeneration?: string };
  maintenance?: {
    timeBetweenOverhaulHours?: number | null;
    hotSectionInspectionHours?: number | null;
    serviceLifeHours?: number | null;
    meanTimeBetweenFailuresHours?: number | null;
  };
  operational?: {
    operators?: string[];
    numberBuilt?: number | null;
    unitCostUsd?: number | null;
    productionStartYear?: number | null;
    productionEndYear?: number | null;
  };
  parts?: {
    moduleCount?: number | null;
    majorModules?: string[];
    gearboxType?: string;
    startingSystem?: string;
    fuelSystem?: string;
    lubricationSystem?: string;
    ignitionSystem?: string;
    bearingCount?: number | null;
  };
  materials?: {
    fanBladeMaterial?: string;
    compressorCaseMaterial?: string;
    turbineDiscMaterial?: string;
    thermalBarrierCoating?: string;
    compositeComponents?: string[];
    singleCrystalBlades?: boolean;
    additiveManufacturedParts?: string[];
  };
  technology?: {
    keyTechnologies?: string[];
    coolingTechnology?: string;
    healthMonitoringSystem?: string;
    adaptiveCycle?: boolean;
    stealthFeatures?: string;
    noiseReduction?: string;
  };
  development?: {
    history?: string;
    developmentStartYear?: number | null;
    developmentCostUsd?: number | null;
    certificationYear?: number | null;
    predecessorEngine?: string;
    successorEngine?: string;
    developmentPartners?: string[];
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

/** Thrust in kN, keeping one decimal only when the source value has one. */
export function formatThrustKN(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value, value % 1 === 0 ? 0 : 1)} kN`;
}

/** The figure an engine is sold on: afterburning thrust, else dry thrust. */
export function maxThrust(thrust?: EngineThrust): string | null {
  return formatThrustKN(thrust?.afterburningThrustKN ?? thrust?.dryThrustKN);
}

/** `7.9` -> `"7.9:1"` — how ratios are quoted in engine specs. */
export function formatRatio(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value, value % 1 === 0 ? 0 : 2)}:1`;
}

/** Turbine inlet / afterburner temperatures, shown in K with °C alongside. */
export function formatKelvin(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value)} K (${formatNumber(value - 273.15)} °C)`;
}

/** Specific fuel consumption, e.g. `"75.0 kg/kN·h"`. */
export function formatSfc(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value, 1)} kg/kN·h`;
}

export function formatRpm(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value)} rpm`;
}

export function formatHours(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value)} h`;
}

/** Air mass flow, e.g. `"130 kg/s"`. */
export function formatMassFlow(value?: number | null): string | null {
  if (!isNumber(value)) return null;
  return `${formatNumber(value, value % 1 === 0 ? 0 : 1)} kg/s`;
}

/** Compressor / turbine stage counts collapsed to one line, e.g. `"3 + 6"`. */
export function formatStages(...stages: (number | null | undefined)[]): string | null {
  const present = stages.filter(isNumber);
  if (!present.length || present.every((stage) => stage === 0)) return null;
  return present.join(' + ');
}

/** First dataset image, falling back to a generated placeholder. */
export function engineImage(engine: EngineListItem): string {
  return (
    engine.generatedImages?.[0] || engine.media?.imageUrls?.[0] || getImageUrlForRifle(engine.name)
  );
}

/** Every image for the detail carousel, in dataset order. */
export function engineImages(engine: EngineListItem): string[] {
  const images = engine.generatedImages?.length
    ? engine.generatedImages
    : engine.media?.imageUrls || [];
  return images.length ? images : [getImageUrlForRifle(engine.name)];
}
