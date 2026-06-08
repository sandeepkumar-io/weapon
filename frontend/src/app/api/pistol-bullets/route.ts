import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PistolBullet } from '@/models/PistolBullet';

export async function GET() {
  try {
    await connectDB();
    const pistolBullets = await PistolBullet.find({}).limit(500);
    return NextResponse.json({ success: true, data: pistolBullets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pistol bullets:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
