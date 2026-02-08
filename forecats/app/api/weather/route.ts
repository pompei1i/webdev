import { NextRequest, NextResponse } from "next/server"

// Weather code to description mapping for Open-Meteo
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
  56: { main: "Drizzle", description: "Freezing drizzle", icon: "09d" },
  57: { main: "Drizzle", description: "Dense freezing drizzle", icon: "09d" },
  61: { main: "Rain", description: "Slight rain", icon: "10d" },
  63: { main: "Rain", description: "Moderate rain", icon: "10d" },
  65: { main: "Rain", description: "Heavy rain", icon: "10d" },
  66: { main: "Rain", description: "Freezing rain", icon: "13d" },
  67: { main: "Rain", description: "Heavy freezing rain", icon: "13d" },
  71: { main: "Snow", description: "Slight snow", icon: "13d" },
  73: { main: "Snow", description: "Moderate snow", icon: "13d" },
  75: { main: "Snow", description: "Heavy snow", icon: "13d" },
  77: { main: "Snow", description: "Snow grains", icon: "13d" },
  80: { main: "Rain", description: "Slight showers", icon: "09d" },
  81: { main: "Rain", description: "Moderate showers", icon: "09d" },
  82: { main: "Rain", description: "Violent showers", icon: "09d" },
  85: { main: "Snow", description: "Slight snow showers", icon: "13d" },
  86: { main: "Snow", description: "Heavy snow showers", icon: "13d" },
  95: { main: "Thunderstorm", description: "Thunderstorm", icon: "11d" },
  96: { main: "Thunderstorm", description: "Thunderstorm with hail", icon: "11d" },
  99: { main: "Thunderstorm", description: "Thunderstorm with heavy hail", icon: "11d" },
}

function getWeatherInfo(code: number, isDay: boolean = true) {
  const info = weatherCodes[code] || { main: "Unknown", description: "Unknown", icon: "01d" }
  // Adjust icon for night time
  const icon = isDay ? info.icon : info.icon.replace("d", "n")
  return { ...info, icon }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Fetch weather from Open-Meteo (free, no API key needed!)
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast")
    weatherUrl.searchParams.set("latitude", lat)
    weatherUrl.searchParams.set("longitude", lon)
    weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m")
    weatherUrl.searchParams.set("hourly", "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day")
    weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max")
    weatherUrl.searchParams.set("timezone", "auto")
    weatherUrl.searchParams.set("forecast_days", "10")

    const weatherRes = await fetch(weatherUrl.toString())
    const weatherData = await weatherRes.json()

    if (weatherData.error) {
      return NextResponse.json({ error: weatherData.reason || "Failed to fetch weather" }, { status: 400 })
    }

    // Get location name via reverse geocoding
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
    const geoRes = await fetch(geoUrl, {
      headers: { "User-Agent": "WeatherApp/1.0" }
    })
    const geoData = await geoRes.json()
    
    const locationName = geoData.address?.city || 
                        geoData.address?.town || 
                        geoData.address?.village ||
                        geoData.address?.municipality ||
                        geoData.address?.county ||
                        "Unknown Location"
    const country = geoData.address?.country_code?.toUpperCase() || ""

    // Process current weather
    const current = weatherData.current
    const currentWeather = getWeatherInfo(current.weather_code, current.is_day === 1)

    // Process hourly forecast (next 24 hours)
    const hourly = weatherData.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time: new Date(time).toLocaleTimeString("en-US", { hour: "numeric" }),
      temp: Math.round(weatherData.hourly.temperature_2m[i]),
      weather: getWeatherInfo(weatherData.hourly.weather_code[i], weatherData.hourly.is_day[i] === 1),
      pop: weatherData.hourly.precipitation_probability[i] || 0,
    }))

    // Process daily forecast
    const daily = weatherData.daily.time.map((time: string, i: number) => ({
      date: new Date(time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      day: new Date(time).toLocaleDateString("en-US", { weekday: "short" }),
      temp_min: Math.round(weatherData.daily.temperature_2m_min[i]),
      temp_max: Math.round(weatherData.daily.temperature_2m_max[i]),
      weather: getWeatherInfo(weatherData.daily.weather_code[i]),
      pop: weatherData.daily.precipitation_probability_max[i] || 0,
      humidity: 0, // Not directly available in daily data
      wind_speed: Math.round(weatherData.daily.wind_speed_10m_max[i]),
    }))

    // Format local time
    const localTime = new Date().toLocaleString("en-US", {
      timeZone: weatherData.timezone,
      hour: "numeric",
      minute: "2-digit",
      weekday: "long",
      month: "long",
      day: "numeric"
    })

    // Format sunrise/sunset
    const sunrise = new Date(weatherData.daily.sunrise[0]).toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      timeZone: weatherData.timezone
    })
    const sunset = new Date(weatherData.daily.sunset[0]).toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      timeZone: weatherData.timezone
    })

    const response = {
      location: {
        name: locationName,
        country,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        localtime: localTime,
        timezone: weatherData.timezone,
      },
      current: {
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        wind_speed: Math.round(current.wind_speed_10m),
        wind_deg: current.wind_direction_10m,
        pressure: Math.round(current.pressure_msl),
        visibility: 10, // Open-Meteo doesn't provide visibility
        uv_index: 0,
        weather: currentWeather,
        sunrise,
        sunset,
        is_day: current.is_day === 1,
      },
      hourly,
      daily,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
