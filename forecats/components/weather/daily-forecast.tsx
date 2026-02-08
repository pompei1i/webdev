"use client"

import { Droplets, Wind } from "lucide-react"
import { WeatherIcon } from "./weather-icons"
import type { DailyForecast as DailyForecastType } from "@/lib/weather-types"

interface DailyForecastProps {
  data: DailyForecastType[]
}

export function DailyForecast({ data }: DailyForecastProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">10-Day Forecast</h2>
      <div className="space-y-2">
        {data.map((day, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
          >
            <div className="w-16 text-sm font-medium">
              {index === 0 ? "Today" : day.day}
            </div>
            
            <div className="flex items-center gap-2 w-20">
              <WeatherIcon iconCode={day.weather.icon} size={24} />
              {day.pop > 0 && (
                <span className="text-xs text-blue-400">{day.pop}%</span>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-muted-foreground w-10 text-right">{day.temp_min}°</span>
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden relative">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                  style={{
                    left: `${((day.temp_min + 10) / 50) * 100}%`,
                    right: `${100 - ((day.temp_max + 10) / 50) * 100}%`,
                  }}
                />
              </div>
              <span className="font-medium w-10">{day.temp_max}°</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-400" />
                {day.humidity}%
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-sky-400" />
                {day.wind_speed} km/h
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
