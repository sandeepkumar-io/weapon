import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Rifle } from '@/models/Rifle';

export async function GET() {
  try {
    await connectDB();
    const rifles = await Rifle.find({}).limit(500);
    return NextResponse.json({ success: true, data: rifles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rifles:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
