import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FighterJet } from '@/models/FighterJet';

export const dynamic = 'force-dynamic';

/** Small projection for the "more aircraft" cards shown under a dossier. */
const RELATED_PROJECTION = {
  id: 1,
  slug: 1,
  name: 1,
  description: 1,
  originCountry: 1,
  generationTier: 1,
  roles: 1,
  statusGroup: 1,
  performance: 1,
  stealth: 1,
  'media.imageUrls': 1,
  generatedImages: 1,
} as const;

/**
 * Returns one aircraft plus a few related ones. Related aircraft are picked
 * from the same generation first, then the same origin country, so the strip
 * under the dossier stays relevant even for one-off airframes.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    await connectDB();

    const aircraft = await FighterJet.findOne({
      $or: [{ slug }, { id: slug }],
    }).lean();

    if (!aircraft) {
      return NextResponse.json(
        { success: false, error: `Aircraft "${slug}" not found` },
        { status: 404 },
      );
    }

    const related = await FighterJet.find(
      {
        _id: { $ne: aircraft._id },
        $or: [
          { generationTier: aircraft.generationTier },
          { originCountry: aircraft.originCountry },
        ],
      },
      RELATED_PROJECTION,
    )
      .limit(8)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: { ...aircraft, _id: String(aircraft._id) },
        related: related.map((item) => ({ ...item, _id: String(item._id) })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
