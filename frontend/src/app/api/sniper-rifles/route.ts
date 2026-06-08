import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SniperRifle } from '@/models/SniperRifle';

export async function GET() {
  try {
    await connectDB();
    const sniperRifles = await SniperRifle.find({}).limit(100);
    return NextResponse.json({ success: true, data: sniperRifles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sniper rifles:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
