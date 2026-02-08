"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Current weather skeleton */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-6 mt-6">
              <Skeleton className="h-24 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-border/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div className="glass-card rounded-2xl p-6">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="flex gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
