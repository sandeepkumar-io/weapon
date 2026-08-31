import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'engine_data');

/** Component image categories used by the engine datasets. */
const COMPONENT_CATEGORIES = ['engine', 'variants', 'applications', 'majorModules'] as const;

type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];
type ComponentImages = Partial<Record<ComponentCategory, Record<string, string>>>;

export interface RawEngine {
  name: string;
  slug: string;
  description: string;
  manufacturer: string;
  designer: string;
  originCountry: string;
  engineType: string;
  generation: string;
  status: string;
  firstRunYear: number | null;
  introducedYear: number | null;
  applications: string[];
  alsoKnownAs?: string[];
  programName?: string;
  dimensions: Record<string, number | null>;
  thrust: Record<string, number | null>;
  performance: Record<string, number | boolean | null>;
  compressor: Record<string, string | number | null>;
  combustor: Record<string, string | null>;
  turbine: Record<string, string | number | null>;
  afterburner?: Record<string, string | number | null>;
  nozzle: Record<string, string | number | boolean | null>;
  controlSystem: Record<string, string | null>;
  maintenance: Record<string, number | null>;
  operational: Record<string, unknown>;
  parts?: Record<string, unknown>;
  materials?: Record<string, unknown>;
  technology?: Record<string, unknown>;
  development?: Record<string, unknown>;
  media: { imageUrls: string[]; videoUrl: string; componentImages: ComponentImages };
  variants: string[];
  sources: string[];
  lastVerifiedAt: string;
  scrapingStatus: string;
}

/** A raw record plus the dataset (country file) it was read from. */
interface SourcedEngine {
  country: string;
  dataset: string;
  engine: RawEngine;
}

/**
 * "5th Generation", "5th-gen" and "Gen 5" all describe the same tier.
 * Returns a short label used for the catalog generation filter.
 */
export function normalizeGeneration(raw: string): string {
  const value = (raw || '').toLowerCase();

  if (/(4\.5|4\+)/.test(value)) return '4.5';
  if (/\b6(th)?\b/.test(value)) return '6th';
  if (/\b5(th)?\b/.test(value)) return '5th';
  if (/\b4(th)?\b/.test(value)) return '4th';
  if (/\b3(rd)?\b/.test(value) || value.includes('third')) return '3rd';
  if (/\b2(nd)?\b/.test(value) || value.includes('second')) return '2nd';
  if (/\b1(st)?\b/.test(value) || value.includes('first')) return '1st';
  return 'Unclassified';
}

/** Collapses the free-text `status` values into four buckets for filtering. */
export function normalizeStatus(raw: string): string {
  const value = (raw || '').toLowerCase();
  if (value.includes('retired') || value.includes('out of service')) return 'Retired';
  if (value.includes('development') || value.includes('testing')) return 'In development';
  if (value.includes('production')) return 'In production';
  return 'In service';
}

/**
 * Collapses `engineType` ("Afterburning turbofan", "Low-bypass turbofan", ...)
 * into the family the filter dropdown offers.
 */
export function normalizeEngineType(raw: string): string {
  const value = (raw || '').toLowerCase();
  if (value.includes('turbofan')) return 'Turbofan';
  if (value.includes('turbojet')) return 'Turbojet';
  if (value.includes('turboprop')) return 'Turboprop';
  if (value.includes('turboshaft')) return 'Turboshaft';
  if (value.includes('scramjet')) return 'Scramjet';
  if (value.includes('ramjet')) return 'Ramjet';
  if (value.includes('rocket')) return 'Rocket';
  if (value.includes('piston')) return 'Piston';
  return 'Other';
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')) as T;
}

/** Every `*_jet_engine_data.json` file, flattened to one entry per engine. */
function readDatasets(): SourcedEngine[] {
  if (!fs.existsSync(DATA_DIR)) return [];

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort();

  return files.flatMap((file) => {
    const dataset = readJson<{ country: string; engines: RawEngine[] }>(file);
    return (dataset.engines || []).map((engine) => ({
      country: dataset.country,
      dataset: file,
      engine,
    }));
  });
}

const uniqueStrings = (values: unknown[]): string[] =>
  Array.from(new Set(values.filter((v): v is string => typeof v === 'string' && v.trim() !== '')));

/** Richer record wins when the same engine appears in several datasets. */
function pickRichest(entries: SourcedEngine[]): SourcedEngine {
  return entries.reduce((best, entry) =>
    JSON.stringify(entry.engine).length > JSON.stringify(best.engine).length ? entry : best,
  );
}

export interface EngineDocument extends Omit<RawEngine, 'media'> {
  id: string;
  datasetCountries: string[];
  generationTier: string;
  statusGroup: string;
  engineTypeGroup: string;
  media: { imageUrls: string[]; videoUrl: string; componentImages: ComponentImages };
  /** Alias of `media.imageUrls`, kept for the shared card/carousel components. */
  generatedImages: string[];
}

/**
 * Reads every dataset and returns one document per engine, ready to insert.
 * Duplicates across country files are merged: the richest record is the base,
 * with operators, applications, images and dataset countries unioned across
 * all copies.
 */
export function loadEngineDocuments(): EngineDocument[] {
  const grouped = new Map<string, SourcedEngine[]>();

  for (const entry of readDatasets()) {
    const slug = entry.engine.slug;
    if (!slug) continue;
    grouped.set(slug, [...(grouped.get(slug) || []), entry]);
  }

  const documents = Array.from(grouped.entries()).map(([slug, entries]) => {
    const base = pickRichest(entries);
    const engine = base.engine;

    const componentImages = entries.reduce<ComponentImages>((acc, entry) => {
      for (const category of COMPONENT_CATEGORIES) {
        const images = entry.engine.media?.componentImages?.[category];
        if (images) acc[category] = { ...(acc[category] || {}), ...images };
      }
      return acc;
    }, {});

    const imageUrls = uniqueStrings(entries.flatMap((entry) => entry.engine.media?.imageUrls || []));
    const operators = uniqueStrings(
      entries.flatMap((entry) => (entry.engine.operational?.operators as string[]) || []),
    );
    const applications = uniqueStrings(entries.flatMap((entry) => entry.engine.applications || []));

    return {
      ...engine,
      id: slug,
      slug,
      applications,
      datasetCountries: uniqueStrings(entries.map((entry) => entry.country)).sort(),
      generationTier: normalizeGeneration(engine.generation),
      statusGroup: normalizeStatus(engine.status),
      engineTypeGroup: normalizeEngineType(engine.engineType),
      operational: { ...engine.operational, operators },
      media: {
        imageUrls,
        videoUrl: engine.media?.videoUrl || '',
        componentImages,
      },
      generatedImages: imageUrls,
    } as EngineDocument;
  });

  return documents.sort((a, b) => a.name.localeCompare(b.name));
}
