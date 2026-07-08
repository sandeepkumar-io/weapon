import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Airplane } from '@/models/Airplane';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function GET() {
  try {
    await connectDB();
    const airplanes = await Airplane.find({}).sort({ name: 1 }).limit(700).lean();
    const data = airplanes.map((airplane) => ({
      ...airplane,
      _id: String(airplane._id),
      id: slugify(airplane.id || airplane.name || String(airplane._id)),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching airplanes:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
