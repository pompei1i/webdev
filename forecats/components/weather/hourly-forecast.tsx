"use client"

import { WeatherIcon } from "./weather-icons"
import type { HourlyForecast as HourlyForecastType } from "@/lib/weather-types"

interface HourlyForecastProps {
  data: HourlyForecastType[]
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Hourly Forecast</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
        {data.map((hour, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm text-muted-foreground">{hour.time}</span>
            <WeatherIcon iconCode={hour.weather.icon} size={28} />
            <span className="font-semibold">{hour.temp}°</span>
            {hour.pop > 0 && (
              <span className="text-xs text-blue-400">{hour.pop}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
