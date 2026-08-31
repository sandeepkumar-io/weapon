import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FighterJet } from '@/models/FighterJet';
import { loadAircraftDocuments } from '@/lib/aircraftData';

export const dynamic = 'force-dynamic';

/**
 * Replaces the `fighterjets` collection with the datasets in
 * `public/aircraft_data`.
 *
 * The collection is dropped rather than emptied so the indexes from the old
 * (flat) schema go with it — the new documents index `slug`, which the old
 * schema never had.
 */
export async function POST() {
  try {
    await connectDB();

    const documents = loadAircraftDocuments();
    if (!documents.length) {
      return NextResponse.json(
        { success: false, error: 'No aircraft found in public/aircraft_data' },
        { status: 400 },
      );
    }

    const removed = await FighterJet.countDocuments();
    try {
      await FighterJet.collection.drop();
    } catch {
      // Collection did not exist yet — nothing to drop.
    }

    const inserted = await FighterJet.insertMany(documents, { ordered: false });
    await FighterJet.syncIndexes();

    return NextResponse.json(
      {
        success: true,
        message: `Removed ${removed} old records and inserted ${inserted.length} aircraft`,
        removed,
        inserted: inserted.length,
        countries: Array.from(
          new Set(documents.flatMap((doc) => doc.datasetCountries)),
        ).sort(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error seeding aircraft:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

/** Compares what is in the database with what the dataset files hold. */
export async function GET() {
  try {
    await connectDB();

    const documents = loadAircraftDocuments();
    const stored = await FighterJet.countDocuments();

    return NextResponse.json(
      {
        success: true,
        stored,
        availableInFiles: documents.length,
        inSync: stored === documents.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error checking aircraft seed status:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
