import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JetEngine } from '@/models/JetEngine';

export async function GET() {
  try {
    await connectDB();
    const jetEngines = await JetEngine.find({}).limit(500);
    return NextResponse.json({ success: true, data: jetEngines }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jet engines:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
