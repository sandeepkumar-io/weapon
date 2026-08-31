import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JetEngine } from '@/models/JetEngine';

export const dynamic = 'force-dynamic';

/** Small projection for the "more engines" cards shown under a dossier. */
const RELATED_PROJECTION = {
  id: 1,
  slug: 1,
  name: 1,
  description: 1,
  manufacturer: 1,
  originCountry: 1,
  engineType: 1,
  engineTypeGroup: 1,
  generationTier: 1,
  statusGroup: 1,
  applications: 1,
  thrust: 1,
  performance: 1,
  'nozzle.thrustVectoring': 1,
  'media.imageUrls': 1,
  generatedImages: 1,
} as const;

/**
 * Returns one engine plus a few related ones. Related engines are picked from
 * the same engine family first, then the same origin country, so the strip
 * under the dossier stays relevant even for one-off powerplants.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    await connectDB();

    const engine = await JetEngine.findOne({ $or: [{ slug }, { id: slug }] }).lean();

    if (!engine) {
      return NextResponse.json(
        { success: false, error: `Engine "${slug}" not found` },
        { status: 404 },
      );
    }

    const related = await JetEngine.find(
      {
        _id: { $ne: engine._id },
        $or: [
          { engineTypeGroup: engine.engineTypeGroup },
          { originCountry: engine.originCountry },
        ],
      },
      RELATED_PROJECTION,
    )
      .limit(8)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: { ...engine, _id: String(engine._id) },
        related: related.map((item) => ({ ...item, _id: String(item._id) })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching engine:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
