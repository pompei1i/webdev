export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
    localtime: string
  }
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    wind_deg: number
    pressure: number
    visibility: number
    uv_index: number
    weather: {
      main: string
      description: string
      icon: string
    }
  }
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

export interface HourlyForecast {
  time: string
  temp: number
  weather: {
    main: string
    description: string
    icon: string
  }
  pop: number
}

export interface DailyForecast {
  date: string
  day: string
  temp_min: number
  temp_max: number
  weather: {
    main: string
    description: string
    icon: string
  }
  pop: number
  humidity: number
  wind_speed: number
}

export interface NearbyCity {
  name: string
  country: string
  temp: number
  weather: {
    main: string
    description: string
    icon: string
  }
  distance: number
}

export interface SearchResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}
