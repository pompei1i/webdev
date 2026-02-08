"use client"

import React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SearchResult } from "@/lib/weather-types"

interface SearchBarProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void
  onRequestGeolocation: () => void
  isLoadingLocation: boolean
}

export function SearchBar({ onSelectLocation, onRequestGeolocation, isLoadingLocation }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setResults(data)
      setIsOpen(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(value)
    }, 300)
  }

  const handleSelectResult = (result: SearchResult) => {
    onSelectLocation(result.lat, result.lon, result.name)
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            className="pl-10 pr-10 h-12 glass-input rounded-xl text-base focus-visible:ring-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          onClick={onRequestGeolocation}
          disabled={isLoadingLocation}
          variant="secondary"
          size="icon"
          className="h-12 w-12 glass-card rounded-xl shrink-0 hover:bg-primary/10 transition-colors"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-12 mt-2 glass-card-strong rounded-2xl overflow-hidden z-50">
          <ul className="divide-y divide-border/50">
            {results.map((result, index) => (
              <li key={`${result.lat}-${result.lon}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.state ? `${result.state}, ` : ""}{result.country}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
