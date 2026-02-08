"use client"

import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface WeatherIconProps {
  iconCode: string
  className?: string
  size?: number
}

const iconMap: Record<string, LucideIcon> = {
  "01d": Sun,
  "01n": Moon,
  "02d": Cloud,
  "02n": Cloud,
  "03d": Cloud,
  "03n": Cloud,
  "04d": Cloud,
  "04n": Cloud,
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  "10d": CloudRain,
  "10n": CloudRain,
  "11d": CloudLightning,
  "11n": CloudLightning,
  "13d": CloudSnow,
  "13n": CloudSnow,
  "50d": CloudFog,
  "50n": CloudFog,
}

const colorMap: Record<string, string> = {
  "01d": "text-amber-400",
  "01n": "text-slate-300",
  "02d": "text-sky-400",
  "02n": "text-slate-400",
  "03d": "text-slate-400",
  "03n": "text-slate-500",
  "04d": "text-slate-500",
  "04n": "text-slate-600",
  "09d": "text-blue-400",
  "09n": "text-blue-500",
  "10d": "text-blue-500",
  "10n": "text-blue-600",
  "11d": "text-yellow-400",
  "11n": "text-yellow-500",
  "13d": "text-cyan-300",
  "13n": "text-cyan-400",
  "50d": "text-slate-400",
  "50n": "text-slate-500",
}

export function WeatherIcon({ iconCode, className = "", size = 24 }: WeatherIconProps) {
  const Icon = iconMap[iconCode] || Cloud
  const colorClass = colorMap[iconCode] || "text-slate-400"

  return <Icon className={`${colorClass} ${className}`} size={size} />
}

export function LargeWeatherIcon({ iconCode, className = "" }: { iconCode: string; className?: string }) {
  const Icon = iconMap[iconCode] || Cloud
  const colorClass = colorMap[iconCode] || "text-slate-400"

  return (
    <div className={`relative ${className}`}>
      <Icon className={`${colorClass} drop-shadow-lg`} size={120} strokeWidth={1.5} />
      {iconCode.startsWith("01d") && (
        <div className="absolute inset-0 animate-pulse opacity-30">
          <Icon className="text-amber-300" size={120} strokeWidth={1.5} />
        </div>
      )}
    </div>
  )
}

export { Wind }
