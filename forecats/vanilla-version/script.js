// DOM Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const geoBtn = document.getElementById('geo-btn');
const loadingSkeleton = document.getElementById('loading-skeleton');
const weatherContent = document.getElementById('weather-content');

// New UI Elements
const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const currentTempEl = document.getElementById('current-temp');
const weatherDescEl = document.getElementById('weather-desc');
const feelsLikeEl = document.getElementById('feels-like');
const mainIconContainer = document.getElementById('main-icon-container');

// Details
const detailHumidity = document.getElementById('detail-humidity');
const detailWind = document.getElementById('detail-wind');
const detailVisibility = document.getElementById('detail-visibility');
const detailPressure = document.getElementById('detail-pressure');
const detailSunrise = document.getElementById('detail-sunrise');
const detailSunset = document.getElementById('detail-sunset');

const dailyForecastList = document.getElementById('daily-forecast-list');
const nearbyCitiesGrid = document.getElementById('nearby-cities-grid');

// State
let hourlyChartInstance = null;

// Constants
const DEFAULT_LOCATION = { lat: 40.7128, lon: -74.006, name: "New York" };
const MAJOR_CITIES = [
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Berlin", country: "DE", lat: 52.5200, lon: 13.4050 },
  { name: "Mumbai", country: "IN", lat: 19.0760, lon: 72.8777 }
];

// Weather Memes & Gen Z Humor
const WEATHER_MEMES = {
    rain: [
        "POV: You just washed your car 🚗💦",
        "It's giving main character crying in the rain energy",
        "The universe said 'no outdoor plans today bestie'",
        "Rain rain go away, I have zero umbrellas anyway ☂️",
        "This is my villain origin story",
        "Me: plans outdoor activity. God: 🌧️ and I took that personally"
    ],
    snow: [
        "It's giving Frozen vibes ❄️✨",
        "POV: Elsa had a bad day",
        "Do you wanna build a snowman? No? Me neither it's freezing",
        "When life gives you snow, call in sick",
        "Main character walking in snow aesthetic unlocked",
        "The hot cocoa is calling my name rn"
    ],
    hot: [
        "It's giving global warming",
        "POV: You're an ice cream cone 🍦",
        "Too hot to exist tbh",
        "The sun woke up and chose violence",
        "Melting. Literally melting. Send help. 🫠",
        "AC or death, no in between"
    ],
    cold: [
        "It's giving freezer vibes 🥶",
        "Why do I live where the air hurts my face?",
        "Bestie it's too cold for this",
        "POV: You regret every life choice that led you here",
        "My bones are literally ice",
        "Hibernation mode: ACTIVATED"
    ],
    cloudy: [
        "It's giving indie movie protagonist energy ☁️",
        "The vibe is immaculate ngl",
        "Main character weather fr fr",
        "God's mood: meh",
        "Aesthetic but make it gloomy",
        "The clouds said no thoughts, head empty"
    ],
    storm: [
        "NATURE IS SCREAMING ⚡",
        "Thor is having a moment",
        "POV: The sky is going through something",
        "It's giving apocalypse vibes",
        "The universe said STAY INSIDE",
        "Zeus woke up on the wrong side of the cloud"
    ],
    clear: [
        "It's giving touch grass energy 🌱",
        "No excuses, go outside bestie",
        "POV: Perfect day to romanticize your life",
        "Main character weather has entered the chat",
        "The universe said GO BE HAPPY ✨",
        "It's a good day to not be sad"
    ],
    windy: [
        "POV: You just straightened your hair 💨",
        "Mother Nature said let me mess up your fit real quick",
        "The wind is not it today",
        "It's giving hair disaster era",
        "The universe really said good luck walking",
        "When the wind has beef with your hairstyle"
    ]
};

function getWeatherMeme(weatherCode, temp) {
    let category = 'clear';
    
    // Determine category based on weather code
    if (weatherCode >= 61 && weatherCode <= 67 || weatherCode >= 80 && weatherCode <= 82) {
        category = 'rain';
    } else if (weatherCode >= 71 && weatherCode <= 77 || weatherCode >= 85 && weatherCode <= 86) {
        category = 'snow';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        category = 'storm';
    } else if (temp > 28) {
        category = 'hot';
    } else if (temp < 0) {
        category = 'cold';
    } else if (weatherCode >= 2 && weatherCode <= 3) {
        category = 'cloudy';
    } else if (weatherCode === 0 || weatherCode === 1) {
        category = 'clear';
    }
    
    // Add windy memes if wind conditions
    const memes = WEATHER_MEMES[category];
    return memes[Math.floor(Math.random() * memes.length)];
}

// Weather-Based Spotify Playlists
const WEATHER_PLAYLISTS = {
    rain: [
        { name: "Rainy Day Vibes", id: "37i9dQZF1DWXe9gFZP0gtP", mood: "Cozy rainy vibes 🌧️" },
        { name: "Peaceful Piano", id: "37i9dQZF1DX4sWSpwq3LiO", mood: "Chill rain sounds 🎹" },
        { name: "Jazz Vibes", id: "37i9dQZF1DX0SM0LYsmbMT", mood: "Smooth jazz for rain ☕" }
    ],
    snow: [
        { name: "Winter Acoustic", id: "37i9dQZF1DX0k6W0yGRYyT", mood: "Cozy winter feels ❄️" },
        { name: "Chill Vibes", id: "37i9dQZF1DX889U0CL85jj", mood: "Snowy serenity ⛄" },
        { name: "Peaceful Piano", id: "37i9dQZF1DX4sWSpwq3LiO", mood: "Calm snow day 🎹" }
    ],
    hot: [
        { name: "Summer Hits", id: "37i9dQZF1DXbLMw3ry7d7k", mood: "Hot girl summer ☀️" },
        { name: "Beach Vibes", id: "37i9dQZF1DX3Ogo9pFvBkY", mood: "Beach party energy 🏖️" },
        { name: "Tropical House", id: "37i9dQZF1DX8mBRYewE6or", mood: "Island vibes 🌴" }
    ],
    cold: [
        { name: "Dark & Stormy", id: "37i9dQZF1DX3LyU0mhfqgP", mood: "Moody cold vibes 🥶" },
        { name: "Indie Folk", id: "37i9dQZF1DX2Nc3B70tvx0", mood: "Cozy fireplace feels 🔥" },
        { name: "Lo-fi Beats", id: "37i9dQZF1DWWQRwui0ExPn", mood: "Study in the cold 📚" }
    ],
    cloudy: [
        { name: "Indie Vibes", id: "37i9dQZF1DX2sUQwD7tbmL", mood: "Main character energy ☁️" },
        { name: "Chill Hits", id: "37i9dQZF1DX4WYpdgoIcn6", mood: "Cloudy day mood 🌥️" },
        { name: "Alternative", id: "37i9dQZF1DX9GRpeH4CL0S", mood: "Moody vibes 🎸" }
    ],
    storm: [
        { name: "Rock Classics", id: "37i9dQZF1DWXRqgorJj26U", mood: "Storm energy ⚡" },
        { name: "Epic Gaming", id: "37i9dQZF1DX4o1oenSJRJd", mood: "Dramatic vibes 🎮" },
        { name: "Power Workout", id: "37i9dQZF1DX70RN3TfWWJh", mood: "Thunder power 💪" }
    ],
    clear: [
        { name: "Good Vibes", id: "37i9dQZF1DX3rxVfibe1L0", mood: "Happy sunny day ✨" },
        { name: "Feel Good", id: "37i9dQZF1DWSf2RDTDayIx", mood: "Main character moment 🌟" },
        { name: "Happy Hits", id: "37i9dQZF1DXdPec7aLTmlC", mood: "Pure joy 😊" }
    ]
};

function getWeatherPlaylist(weatherCode, temp) {
    let category = 'clear';
    
    if (weatherCode >= 61 && weatherCode <= 67 || weatherCode >= 80 && weatherCode <= 82) {
        category = 'rain';
    } else if (weatherCode >= 71 && weatherCode <= 77 || weatherCode >= 85 && weatherCode <= 86) {
        category = 'snow';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        category = 'storm';
    } else if (temp > 28) {
        category = 'hot';
    } else if (temp < 0) {
        category = 'cold';
    } else if (weatherCode >= 2 && weatherCode <= 3) {
        category = 'cloudy';
    } else if (weatherCode === 0 || weatherCode === 1) {
        category = 'clear';
    }
    
    const playlists = WEATHER_PLAYLISTS[category];
    return playlists[Math.floor(Math.random() * playlists.length)];
}

function renderSpotifyPlayer(weatherCode, temp) {
    const playlist = getWeatherPlaylist(weatherCode, temp);
    const playerContainer = document.getElementById('spotify-player');
    const moodLabel = document.getElementById('playlist-mood');
    
    moodLabel.textContent = playlist.mood;
    
    playerContainer.innerHTML = `
        <iframe 
            style="border-radius:12px" 
            src="https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
        </iframe>
    `;
}


const WEATHER_CODES = {
  0: { main: "Clear", description: "Clear sky", icon: "sun", color: "#f59e0b" },
  1: { main: "Clear", description: "Mainly clear", icon: "sun", color: "#f59e0b" },
  2: { main: "Clouds", description: "Partly cloudy", icon: "cloud-sun", color: "#0ea5e9" },
  3: { main: "Clouds", description: "Overcast", icon: "cloud", color: "#64748b" },
  45: { main: "Fog", description: "Foggy", icon: "cloud-fog", color: "#64748b" },
  48: { main: "Fog", description: "Depositing rime fog", icon: "cloud-fog", color: "#64748b" },
  51: { main: "Drizzle", description: "Light drizzle", icon: "cloud-drizzle", color: "#0ea5e9" },
  53: { main: "Drizzle", description: "Moderate drizzle", icon: "cloud-drizzle", color: "#0ea5e9" },
  55: { main: "Drizzle", description: "Dense drizzle", icon: "cloud-drizzle", color: "#0ea5e9" },
  56: { main: "Drizzle", description: "Freezing drizzle", icon: "cloud-drizzle", color: "#0ea5e9" },
  57: { main: "Drizzle", description: "Dense freezing drizzle", icon: "cloud-drizzle", color: "#0ea5e9" },
  61: { main: "Rain", description: "Slight rain", icon: "cloud-rain", color: "#3b82f6" },
  63: { main: "Rain", description: "Moderate rain", icon: "cloud-rain", color: "#3b82f6" },
  65: { main: "Rain", description: "Heavy rain", icon: "cloud-rain", color: "#3b82f6" },
  66: { main: "Rain", description: "Freezing rain", icon: "snowflake", color: "#06b6d4" },
  67: { main: "Rain", description: "Heavy freezing rain", icon: "snowflake", color: "#06b6d4" },
  71: { main: "Snow", description: "Slight snow", icon: "snowflake", color: "#06b6d4" },
  73: { main: "Snow", description: "Moderate snow", icon: "snowflake", color: "#06b6d4" },
  75: { main: "Snow", description: "Heavy snow", icon: "snowflake", color: "#06b6d4" },
  77: { main: "Snow", description: "Snow grains", icon: "snowflake", color: "#06b6d4" },
  80: { main: "Rain", description: "Slight showers", icon: "cloud-rain", color: "#3b82f6" },
  81: { main: "Rain", description: "Moderate showers", icon: "cloud-rain", color: "#3b82f6" },
  82: { main: "Rain", description: "Violent showers", icon: "cloud-lightning", color: "#6366f1" },
  85: { main: "Snow", description: "Slight snow showers", icon: "snowflake", color: "#06b6d4" },
  86: { main: "Snow", description: "Heavy snow showers", icon: "snowflake", color: "#06b6d4" },
  95: { main: "Thunderstorm", description: "Thunderstorm", icon: "cloud-lightning", color: "#6366f1" },
  96: { main: "Thunderstorm", description: "Thunderstorm with hail", icon: "cloud-lightning", color: "#6366f1" },
  99: { main: "Thunderstorm", description: "Thunderstorm with heavy hail", icon: "cloud-lightning", color: "#6366f1" },
};

function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { main: "Unknown", description: "Unknown", icon: "cloud", color: "#64748b" };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// Map
let mapInstance = null;

function renderMap(lat, lon) {
    if (!mapInstance) {
         // Initialize Leaflet
         const link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
         document.head.appendChild(link);
         
         const script = document.createElement('script');
         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
         script.onload = () => {
             initMap(lat, lon);
         };
         document.head.appendChild(script);
    } else {
        mapInstance.setView([lat, lon], 10);
    }
}

function initMap(lat, lon) {
    if (mapInstance) return;
    mapInstance = L.map('map-container', { zoomControl: true, attributionControl: false }).setView([lat, lon], 10);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapInstance);
    
    // Add marker
    L.marker([lat, lon]).addTo(mapInstance);
}

// Weather Animations
function createWeatherAnimation(weatherCode) {
    const container = document.getElementById('weather-animation');
    container.innerHTML = ''; // Clear previous animations
    
    // Determine weather type from code
    if (weatherCode >= 61 && weatherCode <= 67 || weatherCode >= 80 && weatherCode <= 82) {
        // Rain
        const intensity = weatherCode >= 65 ? 'heavy' : 'normal';
        createRainAnimation(container, intensity);
    } else if (weatherCode >= 71 && weatherCode <= 77 || weatherCode >= 85 && weatherCode <= 86) {
        // Snow
        createSnowAnimation(container);
        createCloudsAnimation(container);
    } else if (weatherCode >= 95 && weatherCode <= 99) {
        // Thunderstorm
        createRainAnimation(container, 'heavy');
        createLightningAnimation(container);
        createCloudsAnimation(container);
    } else if (weatherCode === 0 || weatherCode === 1) {
        // Clear/Sunny
        createSunnyAnimation(container);
        if (weatherCode === 1) {
            createCloudsAnimation(container);
        }
    } else if (weatherCode >= 2 && weatherCode <= 3) {
        // Cloudy/Windy
        createWindAnimation(container);
        createCloudsAnimation(container);
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        // Fog
        createFogAnimation(container);
    }
}

function createRainAnimation(container, intensity = 'normal') {
    const raindrops = intensity === 'heavy' ? 80 : 60;
    for (let i = 0; i < raindrops; i++) {
        const drop = document.createElement('div');
        drop.className = intensity === 'heavy' ? 'rain heavy' : 'rain';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.height = (Math.random() * 30 + 30) + 'px';
        drop.style.animationDuration = (Math.random() * 0.3 + 0.4) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.opacity = Math.random() * 0.3 + 0.6;
        container.appendChild(drop);
    }
}

function createSnowAnimation(container) {
    const snowflakes = 60;
    for (let i = 0; i < snowflakes; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 4 + 3) + 's';
        flake.style.animationDelay = Math.random() * 3 + 's';
        const size = Math.random() * 6 + 4;
        flake.style.width = size + 'px';
        flake.style.height = size + 'px';
        flake.style.opacity = Math.random() * 0.4 + 0.5;
        container.appendChild(flake);
    }
}

function createWindAnimation(container) {
    const particles = 25;
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        const isStrong = Math.random() > 0.7;
        particle.className = isStrong ? 'wind-particle strong' : 'wind-particle';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 80 + 40) + 'px';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

function createSunnyAnimation(container) {
    const sunRay = document.createElement('div');
    sunRay.className = 'sun-ray';
    container.appendChild(sunRay);
    
    // Add heat shimmer effect
    const shimmer = document.createElement('div');
    shimmer.className = 'heat-shimmer';
    container.appendChild(shimmer);
}

function createLightningAnimation(container) {
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);
}

function createCloudsAnimation(container) {
    const clouds = 4;
    for (let i = 0; i < clouds; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = (Math.random() * 40 + 10) + '%';
        cloud.style.width = (Math.random() * 200 + 150) + 'px';
        cloud.style.height = (Math.random() * 80 + 60) + 'px';
        cloud.style.animationDuration = (Math.random() * 40 + 60) + 's';
        cloud.style.animationDelay = Math.random() * 10 + 's';
        cloud.style.left = '-20%';
        container.appendChild(cloud);
    }
}

function createFogAnimation(container) {
    const fogLayers = 3;
    for (let i = 0; i < fogLayers; i++) {
        const fog = document.createElement('div');
        fog.className = 'fog';
        fog.style.top = (i * 33) + '%';
        fog.style.animationDuration = (Math.random() * 20 + 40) + 's';
        fog.style.animationDelay = (i * 10) + 's';
        fog.style.opacity = Math.random() * 0.3 + 0.3;
        container.appendChild(fog);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    if (navigator.geolocation) {
        requestGeolocation();
    } else {
        loadWeather(DEFAULT_LOCATION);
    }

    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
    }
});

geoBtn.addEventListener('click', requestGeolocation);

function requestGeolocation() {
    setLoading(true);
    if (!navigator.geolocation) {
        loadWeather(DEFAULT_LOCATION);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            loadWeather({ lat: position.coords.latitude, lon: position.coords.longitude, name: "Current Location" });
        },
        () => {
            loadWeather(DEFAULT_LOCATION);
        },
        { timeout: 10000, maximumAge: 60000 }
    );
}

async function handleSearch(query) {
    if (!query || query.length < 2) {
        searchResults.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Sort by population (descending) - bigger cities first
            const sortedResults = data.results.sort((a, b) => {
                const popA = a.population || 0;
                const popB = b.population || 0;
                return popB - popA;
            });
            
            searchResults.innerHTML = sortedResults.map(result => `
                <div class="p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 search-result-item" 
                     data-lat="${result.latitude}" 
                     data-lon="${result.longitude}"
                     data-name="${result.name}"
                     data-country="${result.country}">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium text-slate-800">${result.name}</div>
                            <div class="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <span class="px-2 py-0.5 bg-slate-100 rounded font-mono font-bold">${result.country_code || result.country}</span>
                                ${result.admin1 ? `<span>${result.admin1}</span>` : ''}
                                ${result.population ? `<span class="text-slate-400">• ${(result.population / 1000000).toFixed(1)}M</span>` : ''}
                            </div>
                        </div>
                        <i data-lucide="map-pin" class="h-4 w-4 text-slate-400"></i>
                    </div>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
            lucide.createIcons();

            // Attach click handlers
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const lat = parseFloat(item.dataset.lat);
                    const lon = parseFloat(item.dataset.lon);
                    const name = item.dataset.name;
                    const country = item.dataset.country;
                    loadWeather({ lat, lon }, name, country);
                    searchInput.value = '';
                    searchResults.classList.add('hidden');
                });
            });
        } else {
            searchResults.innerHTML = '<div class="p-4 text-center text-slate-500 text-sm">No results found</div>';
            searchResults.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

async function loadWeather(location) {
    setLoading(true);
    
    try {
        const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
        weatherUrl.searchParams.set("latitude", location.lat);
        weatherUrl.searchParams.set("longitude", location.lon);
        weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m");
        weatherUrl.searchParams.set("hourly", "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day");
        weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max");
        weatherUrl.searchParams.set("timezone", "auto");
        weatherUrl.searchParams.set("forecast_days", "10");

        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        
        if (weatherData.error) throw new Error(weatherData.reason);

        // Reverse geo if needed
        let locationName = location.name;
        let country = "";
        if (location.name === "Current Location") {
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json&accept-language=en`, {
                     headers: { "User-Agent": "WeatherAppVanilla/1.0" }
                });
                const geoData = await geoRes.json();
                locationName = geoData.address?.city || geoData.address?.town || "Unknown Location";
                country = (geoData.address?.country_code || "").toUpperCase();
            } catch (e) {
                console.warn("Reverse geocoding failed", e);
            }
        }

        renderCurrentWeather(weatherData, locationName, country);
        renderHourlyForecast(weatherData);
        renderDailyForecast(weatherData);
        loadNearbyCities(location.lat, location.lon);
        renderMap(location.lat, location.lon);

        weatherContent.classList.remove('hidden');
    } catch (error) {
        console.error("Load weather error:", error);
    } finally {
        setLoading(false);
    }
}

function renderCurrentWeather(data, name, country) {
    const current = data.current;
    const weatherInfo = getWeatherInfo(current.weather_code);
    
    // Text Content
    cityNameEl.innerHTML = `${name} <span class="text-xl text-slate-400 font-normal">${country}</span>`;
    
    // Date
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);

    currentTempEl.textContent = `${Math.round(current.temperature_2m)}°`;
    weatherDescEl.textContent = weatherInfo.description;
    feelsLikeEl.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;

    // Icon (Large)
    mainIconContainer.innerHTML = `<i data-lucide="${weatherInfo.icon}" style="width: 140px; height: 140px; color: ${weatherInfo.color}; filter: drop-shadow(0 10px 10px ${weatherInfo.color}40);"></i>`;

    // Create weather animation
    createWeatherAnimation(current.weather_code);
    
    // Display weather meme
    const memeContainer = document.getElementById('weather-meme');
    const memeText = memeContainer.querySelector('p');
    const meme = getWeatherMeme(current.weather_code, current.temperature_2m);
    memeText.textContent = meme;
    
    // Render Spotify playlist
    renderSpotifyPlayer(current.weather_code, current.temperature_2m);

    // Details Grid
    detailHumidity.textContent = `${current.relative_humidity_2m}%`;
    detailWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    detailVisibility.textContent = `10 km`; // Open-Meteo default fallback
    detailPressure.textContent = `${Math.round(current.pressure_msl)} hPa`;
    
    // Sunrise/Sunset
    if (data.daily && data.daily.sunrise && data.daily.sunrise[0]) {
        detailSunrise.textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        detailSunset.textContent = new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    lucide.createIcons();
}

function renderHourlyForecast(data) {
    const hourly = data.hourly;
    const hours = hourly.time.slice(0, 24).map(t => new Date(t).toLocaleTimeString('en-US', { hour: 'numeric' }));
    const temps = hourly.temperature_2m.slice(0, 24);
    
    const ctx = document.getElementById('hourly-chart').getContext('2d');
    
    if (hourlyChartInstance) {
        hourlyChartInstance.destroy();
    }

    hourlyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Temperature',
                data: temps,
                borderColor: '#0ea5e9',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
                    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#0f172a',
                    bodyColor: '#0f172a',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    displayColors: false,
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
                y: { display: false, min: Math.min(...temps) - 5, max: Math.max(...temps) + 5 }
            }
        }
    });
}

function renderDailyForecast(data) {
    const daily = data.daily;
    dailyForecastList.innerHTML = '';
    
    daily.time.forEach((time, i) => {
        const date = new Date(time);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const weatherInfo = getWeatherInfo(daily.weather_code[i]);
        const precipProb = daily.precipitation_probability_max?.[i] || 0;
        const precipSum = daily.precipitation_sum?.[i] || 0;
        const windSpeed = Math.round(daily.wind_speed_10m_max?.[i] || 0);
        const sunrise = daily.sunrise?.[i] ? new Date(daily.sunrise[i]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';
        const sunset = daily.sunset?.[i] ? new Date(daily.sunset[i]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';
        
        const container = document.createElement('div');
        container.className = 'forecast-day-container';
        
        // Main row
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer forecast-day-row';
        item.innerHTML = `
            <div class="w-16 font-medium text-slate-700 text-sm">${dayName}</div>
            <div class="flex items-center gap-2 w-20">
                <i data-lucide="${weatherInfo.icon}" class="h-5 w-5" style="color: ${weatherInfo.color}"></i>
                <span class="text-xs font-medium" style="color: #0ea5e9">${precipProb}%</span>
            </div>
            <div class="flex items-center gap-1 w-24 justify-center">
                <span class="font-bold text-slate-800 text-sm">${maxTemp}°</span>
                <span class="text-xs" style="color: ${maxTemp > 0 ? '#f97316' : '#06b6d4'}">●</span>
            </div>
            <div class="w-16 text-center">
                <span class="text-slate-500 text-sm">${minTemp}°</span>
            </div>
            <div class="flex items-center gap-1 w-20 justify-center">
                <i data-lucide="droplets" class="h-4 w-4" style="color: #0ea5e9"></i>
                <span class="text-xs text-slate-500">${precipProb}%</span>
            </div>
            <div class="flex items-center gap-1 w-24 justify-end">
                <i data-lucide="wind" class="h-4 w-4 text-slate-400"></i>
                <span class="text-xs text-slate-500">${windSpeed} km/h</span>
            </div>
            <div class="ml-2">
                <i data-lucide="chevron-down" class="h-4 w-4 text-slate-400 expand-icon transition-transform"></i>
            </div>
        `;
        
        // Expandable details section
        const details = document.createElement('div');
        details.className = 'forecast-details bg-slate-50 p-4 border-b border-slate-100';
        details.innerHTML = `
            <div class="mb-3">
                <h4 class="font-bold text-slate-800 mb-2">${fullDate}</h4>
                <p class="text-sm text-slate-600">${weatherInfo.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                    <i data-lucide="thermometer" class="h-4 w-4 text-orange-500"></i>
                    <span class="text-xs text-slate-600">High: <strong>${maxTemp}°C</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="thermometer" class="h-4 w-4 text-blue-500"></i>
                    <span class="text-xs text-slate-600">Low: <strong>${minTemp}°C</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="cloud-rain" class="h-4 w-4" style="color: #0ea5e9"></i>
                    <span class="text-xs text-slate-600">Precipitation: <strong>${precipSum.toFixed(1)} mm</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="droplets" class="h-4 w-4" style="color: #0ea5e9"></i>
                    <span class="text-xs text-slate-600">Chance: <strong>${precipProb}%</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="wind" class="h-4 w-4 text-slate-500"></i>
                    <span class="text-xs text-slate-600">Max Wind: <strong>${windSpeed} km/h</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="gauge" class="h-4 w-4 text-slate-500"></i>
                    <span class="text-xs text-slate-600">Weather: <strong>${weatherInfo.main}</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="sunrise" class="h-4 w-4" style="color: #f59e0b"></i>
                    <span class="text-xs text-slate-600">Sunrise: <strong>${sunrise}</strong></span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="sunset" class="h-4 w-4" style="color: #f97316"></i>
                    <span class="text-xs text-slate-600">Sunset: <strong>${sunset}</strong></span>
                </div>
            </div>
        `;
        
        // Click handler to toggle expansion with accordion behavior
        item.addEventListener('click', () => {
            const isExpanded = details.classList.contains('expanded');
            const expandIcon = item.querySelector('.expand-icon');
            
            // Close all other expanded days (accordion behavior)
            const allDays = dailyForecastList.querySelectorAll('.forecast-day-container');
            allDays.forEach(dayContainer => {
                if (dayContainer !== container) {
                    const otherDetails = dayContainer.querySelector('.forecast-details');
                    const otherIcon = dayContainer.querySelector('.expand-icon');
                    if (otherDetails && otherDetails.classList.contains('expanded')) {
                        otherDetails.classList.remove('expanded');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current day
            if (isExpanded) {
                details.classList.remove('expanded');
                expandIcon.style.transform = 'rotate(0deg)';
            } else {
                details.classList.add('expanded');
                expandIcon.style.transform = 'rotate(180deg)';
            }
        });
        
        container.appendChild(item);
        container.appendChild(details);
        dailyForecastList.appendChild(container);
    });
    lucide.createIcons();
}

async function loadNearbyCities(lat, lon) {
    // Basic logic to get nearby
    const citiesWithDistance = MAJOR_CITIES.map(city => ({
        ...city,
        // Actually, for "Other Cities" we might just want a static list or random list,
        // but sorting by distance is fine. Let's show more cities now.
        distance: calculateDistance(lat, lon, city.lat, city.lon)
    })).sort((a, b) => a.distance - b.distance).slice(0, 6); // Limit to 6 for 3x2 grid
    
    const lats = citiesWithDistance.map(c => c.lat).join(",");
    const lons = citiesWithDistance.map(c => c.lon).join(",");
    
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,is_day&timezone=auto`);
        const data = await res.json();
        const weatherArray = Array.isArray(data) ? data : [data];
        
        nearbyCitiesGrid.innerHTML = '';
        citiesWithDistance.forEach((city, index) => {
             const w = weatherArray[index];
             if (!w || !w.current) return;
             const weatherInfo = getWeatherInfo(w.current.weather_code);
             
             const div = document.createElement('div');
             // Matching reference: White card, rounded, padding, clean text
             div.className = 'bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer flex items-center justify-between border border-slate-100';
             div.innerHTML = `
                <div class="flex flex-col">
                    <h4 class="font-bold text-slate-800 text-lg mb-1 font-display">${city.name}</h4>
                    <p class="text-sm text-slate-400 font-medium">${weatherInfo.main}</p>
                </div>
                <div class="flex items-center gap-3">
                    <i data-lucide="${weatherInfo.icon}" class="h-8 w-8" style="color: ${weatherInfo.color}"></i>
                    <span class="font-bold text-2xl text-slate-800 font-display">${Math.round(w.current.temperature_2m)}°</span>
                </div>
             `;
             div.addEventListener('click', () => {
                 loadWeather({ lat: city.lat, lon: city.lon, name: city.name });
                 window.scrollTo({ top: 0, behavior: 'smooth' });
             });
             nearbyCitiesGrid.appendChild(div);
        });
        lucide.createIcons();
    } catch (e) {
        console.error("Nearby load failed", e);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        loadingSkeleton.classList.remove('hidden');
        weatherContent.classList.add('hidden');
    } else {
        loadingSkeleton.classList.add('hidden');
        // Shown by loadWeather on success
    }
}
