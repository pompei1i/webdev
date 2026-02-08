"use client"

import React from "react"
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, MapPin } from "lucide-react"
import { LargeWeatherIcon } from "./weather-icons"

interface CurrentWeatherProps {
  data: {
    location: {
      name: string
      country: string
      localtime: string
    }
    current: {
      temp: number
      feels_like: number
      humidity: number
      wind_speed: number
      pressure: number
      visibility: number
      weather: {
        main: string
        description: string
        icon: string
      }
      sunrise: string
      sunset: string
      is_day?: boolean
    }
  }
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const { location, current } = data
  const isDay = current.is_day !== false

  return (
    <div className="glass-card-strong rounded-3xl p-8 md:p-10 relative overflow-hidden">
      {/* Subtle background gradient based on time of day */}
      <div 
        className={`absolute inset-0 opacity-40 ${
          isDay 
            ? "bg-gradient-to-br from-amber-200/50 via-sky-100/30 to-blue-200/50" 
            : "bg-gradient-to-br from-indigo-900/50 via-slate-800/30 to-purple-900/50"
        }`}
      />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left side - Location and temp */}
          <div className="flex-1">
            {/* Location */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Current Location</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
                {location.name}{location.country && `, ${location.country}`}
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">{location.localtime}</p>
            </div>
            
            {/* Temperature display */}
            <div className="flex items-start gap-6">
              <div className="font-display">
                <span className="text-8xl md:text-9xl font-light tracking-tighter leading-none">
                  {current.temp}
                </span>
                <span className="text-4xl md:text-5xl font-light text-muted-foreground align-top">°C</span>
              </div>
              <div className="pt-4">
                <p className="text-xl md:text-2xl font-semibold capitalize mb-1">{current.weather.description}</p>
                <p className="text-muted-foreground">Feels like {current.feels_like}°C</p>
              </div>
            </div>
          </div>

          {/* Right side - Weather icon */}
          <div className="flex justify-center lg:justify-end lg:pt-8">
            <div className="relative">
              <div className={`absolute inset-0 blur-3xl opacity-30 ${
                isDay ? "bg-amber-300" : "bg-indigo-400"
              }`} />
              <LargeWeatherIcon iconCode={current.weather.icon} />
            </div>
          </div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mt-10 pt-8 border-t border-foreground/10">
          <WeatherDetail
            icon={<Droplets className="h-5 w-5 text-sky-500" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <WeatherDetail
            icon={<Wind className="h-5 w-5 text-teal-500" />}
            label="Wind"
            value={`${current.wind_speed} km/h`}
          />
          <WeatherDetail
            icon={<Eye className="h-5 w-5 text-slate-500" />}
            label="Visibility"
            value={`${current.visibility} km`}
          />
          <WeatherDetail
            icon={<Gauge className="h-5 w-5 text-emerald-500" />}
            label="Pressure"
            value={`${current.pressure} hPa`}
          />
          <WeatherDetail
            icon={<Sunrise className="h-5 w-5 text-amber-500" />}
            label="Sunrise"
            value={current.sunrise}
          />
          <WeatherDetail
            icon={<Sunset className="h-5 w-5 text-orange-500" />}
            label="Sunset"
            value={current.sunset}
          />
        </div>
      </div>
    </div>
  )
}

function WeatherDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
      <div className="p-2 rounded-lg bg-background/50">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
