import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&prop=pageimages&piprop=original&format=json&origin=*`;

    const response = await fetch(wikiUrl);
    const data = await response.json();

    const pages = data?.query?.pages;

    if (!pages) {
      return NextResponse.json({
        imageUrl: null,
      });
    }

    const firstPage = Object.values(pages)[0] as any;

    return NextResponse.json({
      imageUrl: firstPage?.original?.source || null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        imageUrl: null,
      },
      { status: 500 }
    );
  }
}