import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FighterJet } from '@/models/FighterJet';

export async function GET() {
  try {
    await connectDB();
    const fighterJets = await FighterJet.find({}).limit(500);
    return NextResponse.json({ success: true, data: fighterJets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fighter jets:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
