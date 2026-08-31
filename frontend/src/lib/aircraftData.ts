import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'aircraft_data');
const COMPONENT_IMAGE_FILE = 'component_images.json';

/** Component image categories shared by the datasets and the global lookup. */
const COMPONENT_CATEGORIES = [
  'engine',
  'radar',
  'variants',
  'airToAirMissiles',
  'airToGroundMissiles',
  'antiShipMissiles',
  'guidedBombs',
  'unguidedBombs',
  'rockets',
  'otherWeapons',
] as const;

type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];
type ComponentImages = Partial<Record<ComponentCategory, Record<string, string>>>;

export interface RawAircraft {
  name: string;
  slug: string;
  description: string;
  manufacturer: string;
  designer: string;
  originCountry: string;
  aircraftType: string;
  roles: string[];
  generation: string;
  status: string;
  firstFlightDate: string;
  introducedYear: number;
  crew: number;
  dimensions: Record<string, number | null>;
  weights: Record<string, number | null>;
  performance: Record<string, number | null>;
  engine: Record<string, string | number | null>;
  radar: Record<string, string | number | null>;
  electronicWarfare: Record<string, unknown>;
  armament: Record<string, unknown>;
  avionics: Record<string, unknown>;
  stealth: Record<string, unknown>;
  operational: Record<string, unknown>;
  media: { imageUrls: string[]; videoUrl: string; componentImages: ComponentImages };
  variants: string[];
  sources: string[];
  lastVerifiedAt: string;
  scrapingStatus: string;
}

/** A raw record plus the dataset (country file) it was read from. */
interface SourcedAircraft {
  country: string;
  dataset: string;
  aircraft: RawAircraft;
}

/**
 * "4++", "4+ generation" and "4.5-generation" all describe the same tier.
 * Returns a short label used for the catalog generation filter.
 */
export function normalizeGeneration(raw: string): string {
  const value = (raw || '').toLowerCase();

  if (/(4\.5|4\+)/.test(value)) return '4.5';
  if (/3\.5/.test(value)) return '3.5';
  if (/\b6(th)?\b/.test(value)) return '6th';
  if (/\b5(th)?\b/.test(value)) return '5th';
  if (/\b4(th)?\b/.test(value)) return '4th';
  if (/\b3(rd)?\b/.test(value) || value.includes('third')) return '3rd';
  if (/\b2(nd)?\b/.test(value) || value.includes('second')) return '2nd';
  if (/\b1(st)?\b/.test(value) || value.includes('first')) return '1st';
  return 'Unclassified';
}

/** Collapses the free-text `status` values into three buckets for filtering. */
export function normalizeStatus(raw: string): string {
  const value = (raw || '').toLowerCase();
  if (value.includes('retired')) return 'Retired';
  if (value.includes('development')) return 'In development';
  return 'In service';
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')) as T;
}

/** Every `*_fighter_jet_data.json` file, flattened to one entry per aircraft. */
function readDatasets(): SourcedAircraft[] {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith('.json') && file !== COMPONENT_IMAGE_FILE)
    .sort();

  return files.flatMap((file) => {
    const dataset = readJson<{ country: string; aircraft: RawAircraft[] }>(file);
    return (dataset.aircraft || []).map((aircraft) => ({
      country: dataset.country,
      dataset: file,
      aircraft,
    }));
  });
}

/** The global `component_images.json` lookup: category -> component name -> url. */
function readComponentImages(): ComponentImages {
  try {
    return readJson<{ components: ComponentImages }>(COMPONENT_IMAGE_FILE).components || {};
  } catch {
    return {};
  }
}

const uniqueStrings = (values: unknown[]): string[] =>
  Array.from(new Set(values.filter((v): v is string => typeof v === 'string' && v.trim() !== '')));

/** The component names an aircraft references, grouped by image category. */
function componentNamesFor(aircraft: RawAircraft): Record<ComponentCategory, string[]> {
  const armament = (aircraft.armament || {}) as Record<string, unknown>;
  const pick = (key: string) => uniqueStrings((armament[key] as unknown[]) || []);

  return {
    engine: uniqueStrings([aircraft.engine?.name]),
    radar: uniqueStrings([aircraft.radar?.name]),
    variants: uniqueStrings(aircraft.variants || []),
    airToAirMissiles: pick('airToAirMissiles'),
    airToGroundMissiles: pick('airToGroundMissiles'),
    antiShipMissiles: pick('antiShipMissiles'),
    guidedBombs: pick('guidedBombs'),
    unguidedBombs: pick('unguidedBombs'),
    rockets: pick('rockets'),
    otherWeapons: pick('otherWeapons'),
  };
}

/**
 * Per-aircraft component images win; anything still missing is filled in from
 * the global lookup so armament entries rarely render without a thumbnail.
 */
function mergeComponentImages(
  aircraft: RawAircraft,
  own: ComponentImages,
  global: ComponentImages,
): ComponentImages {
  const names = componentNamesFor(aircraft);
  const merged: ComponentImages = {};

  for (const category of COMPONENT_CATEGORIES) {
    const images: Record<string, string> = { ...(own[category] || {}) };

    for (const name of names[category]) {
      const fallback = global[category]?.[name];
      if (!images[name] && fallback) images[name] = fallback;
    }

    if (Object.keys(images).length) merged[category] = images;
  }

  return merged;
}

/** Richer record wins when the same airframe appears in several datasets. */
function pickRichest(entries: SourcedAircraft[]): SourcedAircraft {
  return entries.reduce((best, entry) =>
    JSON.stringify(entry.aircraft).length > JSON.stringify(best.aircraft).length ? entry : best,
  );
}

export interface AircraftDocument extends Omit<RawAircraft, 'media'> {
  id: string;
  datasetCountries: string[];
  generationTier: string;
  statusGroup: string;
  media: { imageUrls: string[]; videoUrl: string; componentImages: ComponentImages };
  /** Alias of `media.imageUrls`, kept for the shared card/featured components. */
  generatedImages: string[];
}

/**
 * Reads every dataset and returns one document per airframe, ready to insert.
 * Duplicates across country files are merged: the richest record is the base,
 * with operators, images and dataset countries unioned across all copies.
 */
export function loadAircraftDocuments(): AircraftDocument[] {
  const globalComponentImages = readComponentImages();
  const grouped = new Map<string, SourcedAircraft[]>();

  for (const entry of readDatasets()) {
    const slug = entry.aircraft.slug;
    if (!slug) continue;
    grouped.set(slug, [...(grouped.get(slug) || []), entry]);
  }

  const documents = Array.from(grouped.entries()).map(([slug, entries]) => {
    const base = pickRichest(entries);
    const aircraft = base.aircraft;

    const ownComponentImages = entries.reduce<ComponentImages>((acc, entry) => {
      for (const category of COMPONENT_CATEGORIES) {
        const images = entry.aircraft.media?.componentImages?.[category];
        if (images) acc[category] = { ...(acc[category] || {}), ...images };
      }
      return acc;
    }, {});

    const imageUrls = uniqueStrings(
      entries.flatMap((entry) => entry.aircraft.media?.imageUrls || []),
    );
    const operators = uniqueStrings(
      entries.flatMap((entry) => (entry.aircraft.operational?.operators as string[]) || []),
    );

    return {
      ...aircraft,
      id: slug,
      slug,
      datasetCountries: uniqueStrings(entries.map((entry) => entry.country)).sort(),
      generationTier: normalizeGeneration(aircraft.generation),
      statusGroup: normalizeStatus(aircraft.status),
      operational: { ...aircraft.operational, operators },
      media: {
        imageUrls,
        videoUrl: aircraft.media?.videoUrl || '',
        componentImages: mergeComponentImages(aircraft, ownComponentImages, globalComponentImages),
      },
      generatedImages: imageUrls,
    } as AircraftDocument;
  });

  return documents.sort((a, b) => a.name.localeCompare(b.name));
}
