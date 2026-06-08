import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Using Unsplash API as fallback (free, no API key required)
    const unsplashQuery = encodeURIComponent(`${query} sniper rifle weapon`);
    const unsplashUrl = `https://source.unsplash.com/800x600/?${unsplashQuery}`;

    // You can add Replicate API integration here for AI-generated images
    // For now, using Unsplash which provides high-quality real images

    return NextResponse.json(
      {
        success: true,
        imageUrl: unsplashUrl,
        source: 'unsplash',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
