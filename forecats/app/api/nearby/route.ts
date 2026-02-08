import { NextRequest, NextResponse } from "next/server"

// Major cities with their coordinates
const MAJOR_CITIES = [
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
  { name: "Los Angeles", country: "US", lat: 34.0522, lon: -118.2437 },
  { name: "Berlin", country: "DE", lat: 52.52, lon: 13.405 },
  { name: "Toronto", country: "CA", lat: 43.6532, lon: -79.3832 },
  { name: "Mumbai", country: "IN", lat: 19.076, lon: 72.8777 },
  { name: "Seoul", country: "KR", lat: 37.5665, lon: 126.978 },
]

// Weather code to description mapping
const weatherCodes: Record<number, { main: string; description: string; icon: string }> = {
  0: { main: "Clear", description: "Clear sky", icon: "01d" },
  1: { main: "Clear", description: "Mainly clear", icon: "01d" },
  2: { main: "Clouds", description: "Partly cloudy", icon: "02d" },
  3: { main: "Clouds", description: "Overcast", icon: "04d" },
  45: { main: "Fog", description: "Foggy", icon: "50d" },
  48: { main: "Fog", description: "Depositing rime fog", icon: "50d" },
  51: { main: "Drizzle", description: "Light drizzle", icon: "09d" },
  53: { main: "Drizzle", description: "Moderate drizzle", icon: "09d" },
  55: { main: "Drizzle", description: "Dense drizzle", icon: "09d" },
  61: { main: "Rain", description: "Slight rain", icon: "10d" },
  63: { main: "Rain", description: "Moderate rain", icon: "10d" },
  65: { main: "Rain", description: "Heavy rain", icon: "10d" },
  71: { main: "Snow", description: "Slight snow", icon: "13d" },
  73: { main: "Snow", description: "Moderate snow", icon: "13d" },
  75: { main: "Snow", description: "Heavy snow", icon: "13d" },
  95: { main: "Thunderstorm", description: "Thunderstorm", icon: "11d" },
}

function getWeatherInfo(code: number) {
  return weatherCodes[code] || { main: "Unknown", description: "Unknown", icon: "01d" }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get("lat") || "0")
  const lon = parseFloat(searchParams.get("lon") || "0")

  try {
    // Sort cities by distance and get nearest 6
    const citiesWithDistance = MAJOR_CITIES.map(city => ({
      ...city,
      distance: calculateDistance(lat, lon, city.lat, city.lon),
    }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6)

    // Build latitude and longitude arrays for bulk request
    const lats = citiesWithDistance.map(c => c.lat).join(",")
    const lons = citiesWithDistance.map(c => c.lon).join(",")

    // Fetch weather for all cities in one request using Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,is_day&timezone=auto`
    const res = await fetch(weatherUrl)
    const data = await res.json()

    // Handle both single and multiple city responses
    const weatherArray = Array.isArray(data) ? data : [data]

    const nearbyCities = citiesWithDistance.map((city, index) => {
      const cityWeather = weatherArray[index]
      if (!cityWeather || !cityWeather.current) {
        return null
      }
      
      const isDay = cityWeather.current.is_day === 1
      const weatherInfo = getWeatherInfo(cityWeather.current.weather_code)
      
      return {
        name: city.name,
        country: city.country,
        temp: Math.round(cityWeather.current.temperature_2m),
        weather: {
          ...weatherInfo,
          icon: isDay ? weatherInfo.icon : weatherInfo.icon.replace("d", "n"),
        },
        distance: city.distance,
      }
    }).filter((city): city is NonNullable<typeof city> => city !== null)

    return NextResponse.json(nearbyCities)
  } catch (error) {
    console.error("Nearby cities API error:", error)
    return NextResponse.json({ error: "Failed to fetch nearby cities" }, { status: 500 })
  }
}
