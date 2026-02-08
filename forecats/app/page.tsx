"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import useSWR from "swr"
import { SearchBar } from "@/components/weather/search-bar"
import { CurrentWeather } from "@/components/weather/current-weather"
import { HourlyForecast } from "@/components/weather/hourly-forecast"
import { DailyForecast } from "@/components/weather/daily-forecast"
import { NearbyCities } from "@/components/weather/nearby-cities"
import { WeatherMap } from "@/components/weather/weather-map"
import { WeatherSkeleton } from "@/components/weather/loading-skeleton"
import { CloudOff, CloudSun } from "lucide-react"
import type { NearbyCity } from "@/lib/weather-types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Default location (New York)
const DEFAULT_LOCATION = { lat: 40.7128, lon: -74.006, name: "New York" }

export default function WeatherPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Fetch weather data
  const { data: weatherData, error: weatherError, isLoading: isLoadingWeather } = useSWR(
    location ? `/api/weather?lat=${location.lat}&lon=${location.lon}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Fetch nearby cities
  const { data: nearbyCities } = useSWR(
    location ? `/api/nearby?lat=${location.lat}&lon=${location.lon}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const handleSelectLocation = useCallback((lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name })
    setLocationError(null)
  }, [])

  const handleRequestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLocation(DEFAULT_LOCATION)
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "Current Location",
        })
        setIsLoadingLocation(false)
      },
      (error) => {
        let errorMessage = "Showing New York weather"
        if (error.code === 1) {
          errorMessage = "Location access denied. Showing New York weather."
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Showing New York weather."
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Showing New York weather."
        }
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
        setLocation(DEFAULT_LOCATION)
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  const handleSelectNearbyCity = useCallback((city: NearbyCity) => {
    fetch(`/api/search?q=${encodeURIComponent(city.name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setLocation({ lat: data[0].lat, lon: data[0].lon, name: city.name })
        }
      })
  }, [])

  // Initialize with geolocation or default
  useEffect(() => {
    if (!location) {
      handleRequestGeolocation()
    }
  }, [location, handleRequestGeolocation])

  const isLoading = isLoadingWeather || (!weatherData && !weatherError)
  const hasError = weatherError || (weatherData && weatherData.error)
  const isDay = weatherData?.current?.is_day !== false

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/weather-bg.jpg"
          alt="Weather background"
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 ${
          isDay 
            ? "bg-gradient-to-b from-sky-400/20 via-transparent to-orange-200/30" 
            : "bg-gradient-to-b from-slate-900/70 via-slate-800/50 to-indigo-900/60"
        }`} />
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 glass-card rounded-2xl">
              <CloudSun className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Weatherly
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            Beautiful weather forecasts, powered by Open-Meteo
          </p>
        </header>

        {/* Search bar */}
        <div className="flex justify-center mb-10">
          <SearchBar
            onSelectLocation={handleSelectLocation}
            onRequestGeolocation={handleRequestGeolocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>

        {/* Location error message */}
        {locationError && (
          <div className="mb-8 p-4 glass-card rounded-2xl text-center text-muted-foreground max-w-md mx-auto">
            {locationError}
          </div>
        )}

        {/* Weather content */}
        {isLoading && location && <WeatherSkeleton />}

        {hasError && !isLoading && (
          <div className="glass-card-strong rounded-3xl p-12 text-center max-w-lg mx-auto">
            <CloudOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-semibold mb-2">Unable to load weather data</h2>
            <p className="text-muted-foreground">
              {weatherData?.error || "Please try again or search for a different location."}
            </p>
          </div>
        )}

        {weatherData && !weatherData.error && !isLoading && (
          <div className="space-y-8">
            {/* Current weather hero */}
            <CurrentWeather data={weatherData} />

            {/* Hourly forecast */}
            {weatherData.hourly && weatherData.hourly.length > 0 && (
              <HourlyForecast data={weatherData.hourly} />
            )}

            {/* Two-column layout for daily forecast and map */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Daily forecast */}
              {weatherData.daily && weatherData.daily.length > 0 && (
                <DailyForecast data={weatherData.daily} />
              )}

              {/* Weather map */}
              {location && (
                <WeatherMap lat={location.lat} lon={location.lon} />
              )}
            </div>

            {/* Nearby cities */}
            {nearbyCities && nearbyCities.length > 0 && (
              <NearbyCities data={nearbyCities} onSelectCity={handleSelectNearbyCity} />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass-card inline-block px-6 py-3 rounded-full">
            <p className="text-sm text-muted-foreground">
              Free weather data by <span className="font-medium text-foreground">Open-Meteo</span> - No API key required
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
