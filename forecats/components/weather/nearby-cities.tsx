"use client"

import { WeatherIcon } from "./weather-icons"
import type { NearbyCity } from "@/lib/weather-types"

interface NearbyCitiesProps {
  data: NearbyCity[]
  onSelectCity: (city: NearbyCity) => void
}

export function NearbyCities({ data, onSelectCity }: NearbyCitiesProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Other Cities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((city, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectCity(city)}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors text-left"
          >
            <div>
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {city.weather.description}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WeatherIcon iconCode={city.weather.icon} size={28} />
              <span className="text-xl font-semibold">{city.temp}°</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
