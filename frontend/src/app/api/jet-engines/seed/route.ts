import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JetEngine } from '@/models/JetEngine';
import { loadEngineDocuments } from '@/lib/engineData';

export const dynamic = 'force-dynamic';

/**
 * Replaces the `jetengines` collection with the datasets in
 * `public/engine_data`.
 *
 * The collection is dropped rather than emptied so the indexes from the old
 * (flat) schema go with it — the new documents index `slug`, which the old
 * schema never had.
 */
export async function POST() {
  try {
    await connectDB();

    const documents = loadEngineDocuments();
    if (!documents.length) {
      return NextResponse.json(
        { success: false, error: 'No engines found in public/engine_data' },
        { status: 400 },
      );
    }

    const removed = await JetEngine.countDocuments();
    try {
      await JetEngine.collection.drop();
    } catch {
      // Collection did not exist yet — nothing to drop.
    }

    const inserted = await JetEngine.insertMany(documents, { ordered: false });
    await JetEngine.syncIndexes();

    return NextResponse.json(
      {
        success: true,
        message: `Removed ${removed} old records and inserted ${inserted.length} engines`,
        removed,
        inserted: inserted.length,
        countries: Array.from(new Set(documents.flatMap((doc) => doc.datasetCountries))).sort(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error seeding jet engines:', error);
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

    const documents = loadEngineDocuments();
    const stored = await JetEngine.countDocuments();

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
    console.error('Error checking engine seed status:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
