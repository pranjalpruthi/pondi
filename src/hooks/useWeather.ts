import { useQuery } from '@tanstack/react-query';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weathercode: number;
    is_day: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
}

interface DailyForecast {
  date: string;
  day: string;
  weatherCode: number;
  maxTempRaw: number;
  minTempRaw: number;
  tempUnit: string;
}

interface WeatherResponse {
  data: OpenMeteoResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentTemperatureRaw: number | null;
  currentTemperatureUnit: string | null;
  currentHumidityRaw: number | null;
  currentHumidityUnit: string | null;
  currentWindSpeedRaw: number | null;
  currentWindSpeedUnit: string | null;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  forecast: DailyForecast[];
}

// Weather code mapping to descriptions
const weatherCodeMap: Record<number, string> = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  56: 'light freezing drizzle',
  57: 'dense freezing drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  66: 'light freezing rain',
  67: 'heavy freezing rain',
  71: 'slight snow fall',
  73: 'moderate snow fall',
  75: 'heavy snow fall',
  77: 'snow grains',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  82: 'violent rain showers',
  85: 'slight snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with slight hail',
  99: 'thunderstorm with heavy hail'
};

// Pondicherry coordinates
const PONDICHERRY_LAT = 11.9416;
const PONDICHERRY_LON = 79.8083;

export function useWeather(): WeatherResponse {
  const { data, isLoading, isError, error } = useQuery<OpenMeteoResponse, Error>({
    queryKey: ['weather', 'pondicherry'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${PONDICHERRY_LAT}&longitude=${PONDICHERRY_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,is_day&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=7`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  // Process the data for easy consumption
  const currentTemperatureRaw = data?.current?.temperature_2m ?? null;
  const currentTemperatureUnit = data?.current_units?.temperature_2m ?? null;
    
  const currentHumidityRaw = data?.current?.relative_humidity_2m ?? null;
  const currentHumidityUnit = data?.current_units?.relative_humidity_2m ?? null;
    
  const currentWindSpeedRaw = data?.current?.wind_speed_10m ?? null;
  const currentWindSpeedUnit = data?.current_units?.wind_speed_10m ?? null;
    
  const weatherCode = data?.current?.weathercode ?? -1;
  const weatherDescription = weatherCode >= 0 ? weatherCodeMap[weatherCode] || 'unknown' : '';
  const isDay = data?.current?.is_day === 1;

  // Process weekly forecast data
  const forecast: DailyForecast[] = [];
  if (data?.daily) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < data.daily.time.length; i++) {
      const date = new Date(data.daily.time[i]);
      forecast.push({
        date: data.daily.time[i],
        day: days[date.getDay()],
        weatherCode: data.daily.weathercode[i],
        maxTempRaw: Math.round(data.daily.temperature_2m_max[i]),
        minTempRaw: Math.round(data.daily.temperature_2m_min[i]),
        tempUnit: data.daily_units.temperature_2m_max, // Assuming max and min units are the same
      });
    }
  }

  return {
    data: data || null,
    isLoading,
    isError,
    error,
    currentTemperatureRaw,
    currentTemperatureUnit,
    currentHumidityRaw,
    currentHumidityUnit,
    currentWindSpeedRaw,
    currentWindSpeedUnit,
    weatherCode,
    weatherDescription,
    isDay,
    forecast
  };
}
