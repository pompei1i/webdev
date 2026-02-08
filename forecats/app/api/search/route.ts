import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    // Use Open-Meteo Geocoding API (free, no API key needed!)
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    )
    const data = await res.json()

    if (!data.results) {
      return NextResponse.json([])
    }

    const results = data.results.map((item: Record<string, unknown>) => ({
      name: item.name,
      country: item.country_code,
      state: item.admin1,
      lat: item.latitude,
      lon: item.longitude,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search locations" }, { status: 500 })
  }
}
