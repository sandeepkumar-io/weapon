import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FighterJet } from '@/models/FighterJet';

export const dynamic = 'force-dynamic';

/**
 * Fields the catalog cards and filters need. The heavy parts of a record —
 * component images, weapon lists, avionics, EW, sources — are left to the
 * per-aircraft endpoint so the list response stays small.
 */
const LIST_PROJECTION = {
  id: 1,
  slug: 1,
  name: 1,
  description: 1,
  manufacturer: 1,
  originCountry: 1,
  datasetCountries: 1,
  aircraftType: 1,
  roles: 1,
  generation: 1,
  generationTier: 1,
  status: 1,
  statusGroup: 1,
  introducedYear: 1,
  firstFlightDate: 1,
  crew: 1,
  dimensions: 1,
  weights: 1,
  performance: 1,
  engine: 1,
  'radar.name': 1,
  'armament.hardpoints': 1,
  'armament.internalGun': 1,
  stealth: 1,
  'operational.operators': 1,
  'operational.numberBuilt': 1,
  'operational.unitCostUsd': 1,
  'media.imageUrls': 1,
  generatedImages: 1,
  variants: 1,
} as const;

export async function GET() {
  try {
    await connectDB();

    const aircraft = await FighterJet.find({}, LIST_PROJECTION)
      .sort({ name: 1 })
      .limit(500)
      .lean();

    const data = aircraft.map((item) => ({ ...item, _id: String(item._id) }));

    return NextResponse.json({ success: true, count: data.length, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fighter jets:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
