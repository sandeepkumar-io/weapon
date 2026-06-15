import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bomber } from '@/models/Bomber';

export async function GET() {
  try {
    await connectDB();
    const bombers = await Bomber.find({}).limit(1000);
    return NextResponse.json({ success: true, data: bombers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bombers:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
