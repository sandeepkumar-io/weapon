import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AirToAirMissile } from '@/models/AirToAirMissile';

export async function GET() {
  try {
    await connectDB();
    const missiles = await AirToAirMissile.find({}).limit(500);
    return NextResponse.json({ success: true, data: missiles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching air-to-air missiles:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
