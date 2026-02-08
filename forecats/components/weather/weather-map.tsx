"use client"

import React from "react"

import { useState } from "react"
import { Map, Thermometer, CloudRain, Wind, Cloud } from "lucide-react"

interface WeatherMapProps {
  lat: number
  lon: number
}

type MapLayer = "temp" | "precipitation" | "wind" | "clouds"

const layers: { id: MapLayer; label: string; icon: React.ReactNode }[] = [
  { id: "temp", label: "Temperature", icon: <Thermometer className="h-4 w-4" /> },
  { id: "precipitation", label: "Rain", icon: <CloudRain className="h-4 w-4" /> },
  { id: "wind", label: "Wind", icon: <Wind className="h-4 w-4" /> },
  { id: "clouds", label: "Clouds", icon: <Cloud className="h-4 w-4" /> },
]

const layerCodes: Record<MapLayer, string> = {
  temp: "temp_new",
  precipitation: "precipitation_new",
  wind: "wind_new",
  clouds: "clouds_new",
}

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("temp")
  const zoom = 6

  // Calculate tile coordinates from lat/lon
  const n = Math.pow(2, zoom)
  const x = Math.floor(((lon + 180) / 360) * n)
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n
  )

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || ""
  const tileUrl = apiKey
    ? `https://tile.openweathermap.org/map/${layerCodes[activeLayer]}/${zoom}/${x}/${y}.png?appid=${apiKey}`
    : null

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Map className="h-5 w-5" />
          Weather Map
        </h2>
        <div className="flex gap-1">
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeLayer === layer.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              {layer.icon}
              <span className="hidden sm:inline">{layer.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/30">
        {tileUrl ? (
          <>
            {/* Base map */}
            <img
              src={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`}
              alt="Base map"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Weather layer overlay */}
            <img
              src={tileUrl || "/placeholder.svg"}
              alt={`${activeLayer} layer`}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            {/* Center marker */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground shadow-lg" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Map requires API key</p>
              <p className="text-sm">Add NEXT_PUBLIC_OPENWEATHERMAP_API_KEY</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
        </span>
        <span className="capitalize">{activeLayer} layer</span>
      </div>
    </div>
  )
}
