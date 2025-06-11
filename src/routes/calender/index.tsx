import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, Fragment, useCallback } from 'react' // Added Fragment and useCallback
import { motion, AnimatePresence } from 'motion/react'
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Loader2,
  Info,
  CalendarDays,
  Sun,
  Moon,
  Sparkles,
  AlertTriangle,
  Eye,
  ListChecks,
  Orbit,
  CalendarCheck2,
  AlertOctagon,
  Disc3,
  Star,
  Link2,
  CalendarClock,
  GitCompareArrows,
  Percent,
  Clock,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  ArrowUpFromDot, // For Moonrise
  ArrowDownToDot, // For Moonset
  Tags,
  UtensilsCrossed,
  Replace as SankrantiIcon,
  Award as MahadvadasiIcon,
  Eraser as KsayaTithiIcon,
  PlusCircle as VriddhiDayIcon,
  XCircle, // For clearing search
} from 'lucide-react'
import {  IconSearch } from '@tabler/icons-react'; // Example Tabler icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useGeolocation } from '@/components/cuicui/hooks/use-geolocation'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils' // Assuming you have a cn utility
import { Progress } from '@/components/ui/progress';

// Component for the initial full-page loader (similar to home page)
const InitialPageLoader = () => (
  <div className="fixed inset-0 flex flex-col justify-center items-center h-screen w-screen bg-background z-[9999] text-center">
    <img src="/assets/iskmj.jpg" alt="ISKM Logo" className="w-24 h-24 rounded-full mb-6 animate-pulse" />
    <p className="text-xl font-semibold text-primary">Hare Kṛṣṇa Hare Kṛṣṇa</p>
    <p className="text-xl font-semibold text-primary">Kṛṣṇa Kṛṣṇa Hare Hare</p>
    <p className="text-xl font-semibold text-primary">Hare Rāma Hare Rāma</p>
    <p className="text-xl font-semibold text-primary">Rāma Rāma Hare Hare</p>
  </div>
);

// Helper function to determine fast breaking time details
const getFastBreakingTimeDetails = (day: CalendarDay): string | null => {
  // This function is typically called when day.fasting_info.is_fasting_day is true.
  // It provides additional context based on the fast description.

  const description = day.fasting_info.description.toLowerCase();
  const astro = day.astro_details;

  if (description.includes("ekadasi fasting")) {
    // This is the Ekadasi day itself. Parana is next day.
    // Ekadasi parana details are shown separately if 'ekadasi_parana_details' field is present for the day.
    return "Parana (break fast) window will be on the next day.";
  }
  if (description.includes("fast till noon")) {
    return `Fast breaking: after noon (${astro.noon_time})`;
  }
  if (description.includes("fast till sunset")) {
    return `Fast breaking: after sunset (${astro.sunset_time})`;
  }
  if (description.includes("fast till moonrise")) {
    return astro.moonrise_time && astro.moonrise_time !== "N/A" 
      ? `Fast breaking: after moonrise (${astro.moonrise_time})`
      : "Fast breaking: after moonrise (specific time N/A)";
  }
  // For "Fast today" or other general descriptions where specific times aren't cued,
  // the main description itself is the guide.
  return null; 
};

export const Route = createFileRoute('/calender/')({
  component: VaishnavCalendar,
})

// Helper function to generate a subtle gradient for Apple-like UI
const getAppleTintBackground = (theme: string | undefined) => {
  if (theme === 'dark') {
    return 'bg-gradient-to-br from-zinc-800/50 via-zinc-900/60 to-zinc-950/70';
  }
  return 'bg-gradient-to-br from-slate-50/50 via-gray-100/60 to-stone-100/70';
};

// Types for API response
interface AstroDetailInfo {
  tithi_name: string;
  tithi_elapse_percent: number;
  naksatra_name: string;
  naksatra_elapse_percent: number;
  yoga_name: string;
  rasi_name_sun: string; // Sun's Rasi
  rasi_name_moon: string; // Moon's Rasi
  masa_name: string; // Vaishnava month
  gaurabda_year: number;
  paksa_name: string;
  sunrise_time: string; // HH:MM:SS
  sunset_time: string; // HH:MM:SS
  noon_time: string; // HH:MM:SS
  arunodaya_time: string; // HH:MM:SS
  moonrise_time: string; // HH:MM:SS or "N/A"
  moonset_time: string; // HH:MM:SS or "N/A"
  tithi_start_time?: string | null; // Added: Optional
  tithi_end_time?: string | null;   // Added: Optional
  naksatra_start_time?: string | null; // Added: Optional
  naksatra_end_time?: string | null; // Added: Optional
}

interface FastingInfo {
  is_fasting_day: boolean;
  type_id: number;
  description: string;
  subject: string;
}

interface RawEvent {
  text: string;
  dispItem: number;
  spec: number;
  prio: number;
  fasttype: number;
  fastsubject: string;
}

interface CoreEventDetail {
  type: number; // Event type ID
  type_name: string; // e.g., "Tithi Pratipat starts", "Naksatra Rohini ends"
  data: number; // e.g., Tithi number, Naksatra number
  time: string; // HH:MM:SS of the event
  dst_applied: boolean; // If DST was applied to this event's time
}

interface CalendarDay {
  date_str: string; // "YYYY-MM-DD"
  weekday_name: string; // e.g., "Monday"
  astro_details: AstroDetailInfo;
  fasting_info: FastingInfo;
  events: string[]; // Formatted event descriptions for display
  raw_events: RawEvent[]; // Structured event data
  core_events_detailed?: CoreEventDetail[]; // Optional: Precise timings for astronomical events
  ekadasi_parana_details: string | null;
  sankranti_today_info: string | null;
  mahadvadasi: string | null;
  ksaya_tithi: string | null;
  vriddhi_day_no: number | null;
}

interface CalendarResponse {
  data: CalendarDay[];
  node_debug_logs?: string[]; // Optional debug logs
  node_error?: any; // Optional structured error
  debug_stderr?: string | null; // Optional raw error output
}

// Types for Location Search API
interface LocationDetail {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone_name: string; // e.g., "Asia/Calcutta"
}

interface LocationSearchResponse {
  locations?: LocationDetail[] | null; // Make locations optional and nullable
  node_debug_logs?: string[];
  node_error?: any;
  debug_stderr?: string | null;
}


// Types for calendar grid cells
interface CalendarGridDayBase {
  day: string
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
}

interface CalendarGridDayPrevNext extends CalendarGridDayBase {
  type: 'prevMonth' | 'nextMonth'
}

interface CalendarGridDayCurrent extends CalendarGridDayBase {
  type: 'currentMonth'
  calendarDay: CalendarDay
  hasEvents: boolean
  isFastingDay: boolean
}

type CalendarGridCell = CalendarGridDayPrevNext | CalendarGridDayCurrent

// Helper function to parse "YYYY-MM-DD" string as a local Date at noon
const parseLocalDateStr = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Create date in local timezone, ensuring time is set to noon
  // This helps avoid off-by-one day issues with toLocaleDateString in some environments/timezones.
  // Month is 0-indexed in JavaScript Date constructor (0 for January, 11 for December)
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

// Helper function to format a Date object to "YYYY-MM-DD" string in local time
const getLocalDateStringYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format date for display
const formatDateDisplay = (
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = parseLocalDateStr(dateStr); // Use the new helper
  return date.toLocaleDateString(
    'en-US',
    options || {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  )
}

// Calendar component
function VaishnavCalendar() {
  const { theme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today's date for accurate comparison

  const { isSoundEnabled } = useSoundSettings();
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playPopOn] = useSound('/sounds/pop-on.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playPopOff] = useSound('/sounds/pop-off.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playSwitchOn] = useSound('/sounds/switch-on.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });
  const [playSwitchOff] = useSound('/sounds/switch-off.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Load for 1 second, similar to home page

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const safePlayHover = useCallback(() => { if (isSoundEnabled) playHover(); }, [isSoundEnabled, playHover]);
  const safePlayClick = useCallback(() => { if (isSoundEnabled) playClick(); }, [isSoundEnabled, playClick]);
  const safePlayPopOn = useCallback(() => { if (isSoundEnabled) playPopOn(); }, [isSoundEnabled, playPopOn]);
  const safePlayPopOff = useCallback(() => { if (isSoundEnabled) playPopOff(); }, [isSoundEnabled, playPopOff]);
  const safePlaySwitchOn = useCallback(() => { if (isSoundEnabled) playSwitchOn(); }, [isSoundEnabled, playSwitchOn]);
  const safePlaySwitchOff = useCallback(() => { if (isSoundEnabled) playSwitchOff(); }, [isSoundEnabled, playSwitchOff]);


  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  ) // Start with the 1st of the current month
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Location State
  const [locationCity, setLocationCity] = useState("Pondicherry") // Default city for calendar
  const [manualLocationInput, setManualLocationInput] = useState("Pondicherry"); // User's text input for location
  const [locationSearchResults, setLocationSearchResults] = useState<LocationDetail[]>([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(null);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null); // Added state for coordinates


  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [todayInfo, setTodayInfo] = useState<CalendarDay | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar'); // For toggling view

  const [pageHeaderDetails, setPageHeaderDetails] = useState<{
    gaurabdaYear: number;
    gregorianYear: number;
    currentVaishnavaMasa: string;
    currentGregorianMonthName: string;
  } | null>(null);

  const geolocation = useGeolocation()
  const popoverOpenStates = useRef<{ [key: string]: boolean }>({});

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  
    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  };


  // Fetch Location Data
  const fetchLocations = async (query: string) => {
    if (!query || query.length < 2) { // Don't search for very short queries
      setLocationSearchResults([]);
      setShowLocationResults(false);
      return;
    }
    setIsLocationSearching(true);
    setLocationSearchError(null);
    setShowLocationResults(true); // Show results container (even if it's just a loader initially)
    try {
      const response = await fetch(`/api/search-locations?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        // Attempt to get more detailed error information
        const responseText = await response.text();
        let errorDetail = `Failed to fetch locations: ${response.status}`;
        try {
          const errorJson = JSON.parse(responseText);
          errorDetail += ` - ${JSON.stringify(errorJson.detail || errorJson.node_error || errorJson.error || errorJson)}`;
        } catch (e) {
          // If parsing the error response as JSON fails, use the raw text
          errorDetail += ` - Server response: ${responseText.substring(0, 200)}...`; // Show a snippet
        }
        throw new Error(errorDetail);
      }

      // Get raw text first to help debug if JSON parsing fails
      const resultText = await response.text();
      let result: LocationSearchResponse;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error("VaishnavCalendar: Failed to parse location search response JSON. Raw text:", resultText);
        throw new Error(`Failed to parse server response for locations. Raw data: ${resultText.substring(0, 200)}...`);
      }
      
      if (result.locations && Array.isArray(result.locations) && result.locations.length > 0) {
        setLocationSearchResults(result.locations);
        setLocationSearchError(null); 
      } else if (result.locations && Array.isArray(result.locations) && result.locations.length === 0) {
        setLocationSearchResults([]);
        setLocationSearchError("No locations found for your query.");
      } else {
        // Covers result.locations being null, undefined, or not an array (though JSON.parse should ensure it's valid JSON structure)
        setLocationSearchResults([]);
        if (result.node_error) {
            const errorMessage = typeof result.node_error === 'object' ? JSON.stringify(result.node_error) : String(result.node_error);
            setLocationSearchError(`API Error: ${errorMessage}`);
        } else if (!result.locations) { 
            setLocationSearchError("No locations data received or invalid response structure from API.");
        } else {
            // This case should ideally not be hit if API guarantees locations is array or null
            setLocationSearchError("Received an unexpected structure for locations.");
        }
      }
    } catch (err) {
      // This will catch errors from fetch itself, !response.ok block, or JSON.parse
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while searching locations.';
      console.error("VaishnavCalendar: fetchLocations error:", errorMessage, err);
      setLocationSearchError(errorMessage);
      setLocationSearchResults([]);
    } finally {
      setIsLocationSearching(false);
    }
  };

  const debouncedFetchLocations = useRef(debounce(fetchLocations, 300)).current;

  // Fetch calendar data
  const fetchCalendarData = async (
    year: number,
    month: number, // 1-indexed month
    city?: string, // Optional city
    coords?: { latitude: number; longitude: number } | null // Optional coordinates
  ) => {
    setLoading(true)
    setError(null)
    if (!(year === today.getFullYear() && month === today.getMonth() + 1)) {
      setTodayInfo(null); // Clear today's info if not viewing current month
    }

    let apiUrl = '';
    if (coords && coords.latitude && coords.longitude) {
      // If we have coordinates, use the dedicated coordinates endpoint
      apiUrl = `/api/calendar-by-coordinates?latitude=${coords.latitude}&longitude=${coords.longitude}&year=${year}&month=${month}`;
      console.log("Using coordinates API:", apiUrl);
    } else if (city) {
      apiUrl = `/api/calendar?location_city=${encodeURIComponent(city)}&year=${year}&month=${month}`;
      console.log("Using city API:", apiUrl);
    } else {
      setError("No location information provided (city or coordinates).");
      setLoading(false);
      setCalendarData([]);
      setTodayInfo(null);
      setSelectedDay(null);
      return;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        let errorBodyMessage = `Status: ${response.status}`
        try {
          const errorData = await response.json()
          errorBodyMessage += `, Body: ${JSON.stringify(errorData.node_error || errorData.debug_stderr || errorData)}`
        } catch (e) {
          /* ignore */
        }
        throw new Error(`Failed to fetch calendar data: ${errorBodyMessage}`)
      }
      const result: CalendarResponse = await response.json()
      setCalendarData(result.data)

      const isCurrentMonthView = year === today.getFullYear() && month === today.getMonth() + 1
      if (isCurrentMonthView && result.data.length > 0) {
        const todayDateStr = getLocalDateStringYYYYMMDD(today); 
        const foundTodayInfo = result.data.find(day => day.date_str === todayDateStr)
        if (foundTodayInfo) {
          setTodayInfo(foundTodayInfo)
          if (!selectedDay || selectedDay.date_str !== todayDateStr) {
            setSelectedDay(foundTodayInfo)
          }
        } else {
           setTodayInfo(null); 
        }
      } else if (result.data.length > 0) {
        const currentSelectedDate = selectedDay ? parseLocalDateStr(selectedDay.date_str) : null; 
        if (!currentSelectedDate || currentSelectedDate.getFullYear() !== year || currentSelectedDate.getMonth() + 1 !== month) {
            setSelectedDay(result.data[0]);
        }
      } else {
        setSelectedDay(null); 
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setCalendarData([])
      setTodayInfo(null)
      setSelectedDay(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch data whenever currentDate, locationCity, or locationCoords change
    fetchCalendarData(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      locationCoords ? undefined : locationCity, // Pass city only if not using coords
      locationCoords // Pass coords if available
    );
  }, [currentDate, locationCity, locationCoords]); // Added locationCoords to dependencies

  useEffect(() => {
    if (calendarData && calendarData.length > 0) {
      const firstDayData = calendarData[0];
      setPageHeaderDetails({
        gaurabdaYear: firstDayData.astro_details.gaurabda_year,
        gregorianYear: currentDate.getFullYear(),
        currentVaishnavaMasa: firstDayData.astro_details.masa_name,
        currentGregorianMonthName: currentDate.toLocaleString('default', { month: 'long' }),
      });
    } else {
      setPageHeaderDetails(null);
    }
  }, [calendarData, currentDate]);

  // Simplified reverse geocoding function that doesn't rely on the search API
  const reverseGeocodeCoordinates = async (lat: number, lon: number): Promise<string> => {
    console.log(`Using coordinates directly: ${lat}, ${lon}`);
    
    // Instead of trying to reverse geocode through our API, let's use a more reliable approach
    try {
      // First attempt: Try to get a nearby city name using a simple heuristic
      // This is a simplified approach - in a production app, you might use a proper geocoding service
      // For now, we'll just return a generic name that indicates we're using their location
      return "Your Location"; // Generic name that indicates we're using coordinates
      
      // Note: In a production app, you could implement a more robust solution:
      // 1. Use a dedicated geocoding service like Google Maps, MapBox, etc.
      // 2. Cache common coordinate-to-city mappings
      // 3. Implement a fallback mechanism with progressively wider search areas
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw new Error(`Could not determine city name from coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle geolocation result after user requests it
  useEffect(() => {
    if (geolocation.data) {
      const coords = {
        latitude: geolocation.data.latitude,
        longitude: geolocation.data.longitude,
      };
      setLocationCoords(coords);
      reverseGeocodeCoordinates(coords.latitude, coords.longitude)
        .then(city => {
          setLocationCity(city);
          setManualLocationInput(city);
        })
        .catch(() => {
          setLocationCity("Your Location");
          setManualLocationInput("Your Location");
        });
      setShowLocationResults(false);
    }
    if (geolocation.error) {
      alert(`Error getting location: ${geolocation.error.message}. Please select a city manually or check permissions.`);
      setLocationCity("Mayapur");
      setManualLocationInput("Mayapur");
      setLocationCoords(null);
      safePlayPopOff(); // Sound for error/fallback
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geolocation.data, geolocation.error, safePlayPopOn, safePlayPopOff]);

  const handleManualLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setManualLocationInput(newQuery);
    // safePlayPfff(); // Subtle typing feedback
    setLocationSearchResults([]);
    setShowLocationResults(false);
    setLocationSearchError(null);
    if (newQuery.trim() === "") {
      setLocationSearchResults([]);
      setShowLocationResults(false);
      setLocationSearchError(null);
    } else {
      debouncedFetchLocations(newQuery);
    }
  };

  const handleLocationResultSelect = (selectedLocation: LocationDetail) => {
    setLocationCity(selectedLocation.city);
    setManualLocationInput(selectedLocation.city); 
    setLocationSearchResults([]); 
    setShowLocationResults(false); 
    setLocationCoords(null); 
    safePlayPopOn(); // Sound for selection
    if (locationInputRef.current) {
      locationInputRef.current.blur(); 
    }
  };
  
  const handleUseCurrentLocationClick = () => {
    setShowLocationResults(false);
    setLocationSearchError(null);
    setLocationCity("Fetching location...");
    setManualLocationInput("Fetching location...");
    geolocation.getLocation();
    safePlayClick(); // Sound for button click
  };

  const clearLocationSearch = () => {
    setManualLocationInput("");
    setLocationSearchResults([]);
    setShowLocationResults(false);
    setLocationSearchError(null);
    setLocationCoords(null); 
    safePlayPopOff(); // Sound for clearing
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  };

  // Hide location results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest('.location-results-dropdown')) {
        setShowLocationResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navigateMonth = (direction: 'next' | 'prev') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setDate(1) 
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    });
    if (direction === 'next') safePlayPopOn(); else safePlayPopOff();
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventStyle = (event: RawEvent): { dot: string, text: string } => {
    if (event.fasttype > 0 || event.text.toLowerCase().includes('ekadasi')) {
      return { dot: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400' };
    }
    if (event.dispItem === 17 && event.text.toLowerCase().includes('break fast')) {
        return { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400' };
    }
    if (event.dispItem === 17) { 
        return { dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' };
    }
    if (event.prio <= 100) return { dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' };
    if (event.prio <= 200) return { dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' };
    if (event.prio <= 300) return { dot: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' };
    if (event.prio <= 400) return { dot: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' };
    
    return { dot: 'bg-gray-400', text: 'text-gray-500 dark:text-gray-400' };
  }

  const generateCalendarGrid = (): CalendarGridCell[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const grid: CalendarGridCell[] = []

    const prevMonthLastDay = new Date(year, month, 0)
    const prevMonthDaysToShow = firstDayOfMonth.getDay() 
    for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
      const day = prevMonthLastDay.getDate() - i
      grid.push({
        type: 'prevMonth',
        day: day.toString(),
        date: new Date(year, month - 1, day),
        isToday: false,
        isCurrentMonth: false,
      })
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day)
      date.setHours(0,0,0,0); // Ensure it's local midnight
      const dateStr = getLocalDateStringYYYYMMDD(date); // Use new helper
      const calendarDayData = calendarData.find(d => d.date_str === dateStr)
      const isTodayDate = date.getTime() === today.getTime()

      grid.push({
        type: 'currentMonth',
        day: day.toString(),
        date,
        isToday: isTodayDate,
        isCurrentMonth: true,
        calendarDay: calendarDayData || ({ 
          date_str: dateStr, 
          weekday_name: date.toLocaleDateString('en-US', { weekday: 'long' }),
          astro_details: { 
            tithi_name: "N/A", tithi_elapse_percent: 0, naksatra_name: "N/A", naksatra_elapse_percent: 0,
            yoga_name: "N/A", rasi_name_sun: "N/A", rasi_name_moon: "N/A", masa_name: "N/A",
            gaurabda_year: 0, paksa_name: "N/A", sunrise_time: "N/A", sunset_time: "N/A",
            noon_time: "N/A", arunodaya_time: "N/A", moonrise_time: "N/A", moonset_time: "N/A"
          },
          fasting_info: {is_fasting_day: false, type_id: 0, description:'', subject:''},
          events: [], 
          raw_events: [],
          ekadasi_parana_details: null,
          sankranti_today_info: null,
          mahadvadasi: null,
          ksaya_tithi: null,
          vriddhi_day_no: null
        } as CalendarDay),
        hasEvents: !!calendarDayData && (calendarDayData.events.length > 0 || calendarDayData.raw_events.length > 0 || calendarDayData.fasting_info.is_fasting_day),
        isFastingDay: !!calendarDayData && calendarDayData.fasting_info.is_fasting_day,
      })
    }
    
    const currentGridSize = grid.length;
    const cellsInFullGrid = Math.ceil(currentGridSize / 7) * 7;
    const actualNextMonthDaysToShow = cellsInFullGrid > currentGridSize ? cellsInFullGrid - currentGridSize : ( (prevMonthDaysToShow + lastDayOfMonth.getDate()) % 7 === 0 ? 0 : 7 - ( (prevMonthDaysToShow + lastDayOfMonth.getDate()) % 7 ) );

    for (let i = 1; i <= actualNextMonthDaysToShow; i++) {
      grid.push({
        type: 'nextMonth',
        day: i.toString(),
        date: new Date(year, month + 1, i),
        isToday: false,
        isCurrentMonth: false,
      })
    }
    return grid
  }

  const calendarGrid = generateCalendarGrid()

  const renderDayCellContent = (gridCell: CalendarGridCell) => {
    const commonCellClasses = "h-20 md:h-28 lg:h-32 rounded-lg p-1.5 md:p-2 text-left align-top transition-all duration-200 ease-out relative overflow-hidden shadow-sm";
    
    if (gridCell.type === 'currentMonth') {
      const dayData = gridCell.calendarDay;
      const isSelected = selectedDay?.date_str === dayData.date_str;

      return (
        <Popover onOpenChange={(isOpen) => popoverOpenStates.current[dayData.date_str] = isOpen}>
          <PopoverTrigger asChild>
            <motion.div
              className={cn(
                commonCellClasses,
                theme === 'dark' 
                  ? 'bg-zinc-800/70 hover:bg-zinc-700/80 border border-zinc-700/40' 
                  : 'bg-white/70 hover:bg-gray-100/80 border border-gray-200/60',
                gridCell.isToday && (theme === 'dark' ? "bg-blue-700/40 ring-2 ring-blue-500 border-blue-600" : "bg-blue-100/80 ring-2 ring-blue-500 border-blue-400"),
                dayData.fasting_info.is_fasting_day && !gridCell.isToday && (theme === 'dark' ? "bg-pink-800/30 ring-1 ring-pink-600 border-pink-700/60" : "bg-pink-50/80 ring-1 ring-pink-400 border-pink-300/60"),
                isSelected && (theme === 'dark' ? 'bg-zinc-700/80 ring-2 ring-sky-400 border-sky-500' : 'bg-gray-200/80 ring-2 ring-sky-500 border-sky-400'),
                'cursor-pointer'
              )}
              whileHover={{ scale: 1.03, boxShadow: theme === 'dark' ? "0px 6px 20px rgba(0,0,0,0.3)" : "0px 6px 20px rgba(0,0,0,0.1)" }}
              onClick={() => { setSelectedDay(dayData); safePlayClick(); }}
              onMouseEnter={safePlayHover}
              layoutId={`day-${dayData.date_str}`}
            >
              <div className="flex justify-between items-start">
                <span className={cn("text-xs md:text-sm font-medium", gridCell.isToday && "font-bold")}>
                  {gridCell.day}
                </span>
                {dayData.fasting_info.is_fasting_day && (
                   <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-pink-500 flex-shrink-0" />
                )}
              </div>
              {dayData.raw_events.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {dayData.raw_events.slice(0, 2).map((event, idx) => ( 
                    <div key={idx} className="flex items-center gap-1">
                      <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", getEventStyle(event).dot)}></div>
                      <p className="text-[9px] md:text-[10px] truncate text-muted-foreground">{event.text}</p>
                    </div>
                  ))}
                  {dayData.raw_events.length > 2 && (
                     <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">+ {dayData.raw_events.length - 2} more</p>
                  )}
                </div>
              )}
            </motion.div>
          </PopoverTrigger>
          <PopoverContent 
            className={cn(
              "w-64 md:w-72 p-0 shadow-xl z-50 rounded-lg border", 
              theme === 'dark' ? 'bg-zinc-800/95 border-zinc-700/70 backdrop-blur-sm' : 'bg-white/95 border-gray-200/80 backdrop-blur-sm'
            )} 
            side="bottom" 
            align="center" 
            avoidCollisions
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing for popover
            onCloseAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing for popover
          >
            <div className={cn("p-3 border-b", theme === 'dark' ? 'border-zinc-700' : 'border-gray-200')}>
              <h4 className="font-semibold text-sm">{formatDateDisplay(dayData.date_str, { weekday:'short', month: 'short', day: 'numeric' })}</h4>
              <p className="text-xs text-muted-foreground">{dayData.astro_details.tithi_name}, {dayData.astro_details.masa_name} Masa</p>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto space-y-2 text-xs styled-scrollbar">
              {dayData.fasting_info.is_fasting_day && (
                <Alert variant="default" className={cn("p-2 text-xs", theme === 'dark' ? 'bg-pink-900/70 border-pink-700/60 text-pink-300' : 'bg-pink-50/90 border-pink-200/80 text-pink-700')}>
                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  <AlertTitle className="font-semibold">{dayData.fasting_info.description}</AlertTitle>
                  {dayData.fasting_info.subject && <AlertDescription className="opacity-80">{dayData.fasting_info.subject}</AlertDescription>}
                  {getFastBreakingTimeDetails(dayData) && <AlertDescription className="mt-0.5 opacity-90">{getFastBreakingTimeDetails(dayData)}</AlertDescription>}
                </Alert>
              )}
              {selectedDay &&
                selectedDay.fasting_info.is_fasting_day &&
                /ekadasi/i.test(selectedDay.fasting_info.description) && (
                  <FastingProgressBar
                    prevDay={calendarData[calendarData.findIndex(d => d.date_str === selectedDay.date_str) - 1]}
                    day={selectedDay}
                    nextDay={calendarData[calendarData.findIndex(d => d.date_str === selectedDay.date_str) + 1]}
                  />
              )}
              {dayData.ekadasi_parana_details && (
                <Alert variant="default" className={cn("p-2 text-xs mt-1", theme === 'dark' ? 'bg-green-900/60 border-green-700/50 text-green-300' : 'bg-green-50/90 border-green-200/80 text-green-700')}>
                  <ListChecks className="h-3.5 w-3.5 text-green-500" />
                  <AlertTitle className="font-semibold">Ekadasi Parana</AlertTitle>
                  <AlertDescription>{dayData.ekadasi_parana_details}</AlertDescription>
                </Alert>
              )}
              {(dayData.events.length > 0 || dayData.raw_events.length > 0) && (
                 <div className="space-y-1">
                    {dayData.raw_events.map((event, idx) => (
                        <div key={`re-${idx}`} className="flex items-start gap-1.5">
                            <div className={cn("h-1.5 w-1.5 rounded-full mt-1 flex-shrink-0", getEventStyle(event).dot)}></div>
                            <p className={cn(getEventStyle(event).text)}>{event.text}</p>
                        </div>
                    ))}
                 </div>
              )}
              {!dayData.fasting_info.is_fasting_day && dayData.events.length === 0 && dayData.raw_events.length === 0 && (
                <p className="text-muted-foreground text-center py-2">No specific events.</p>
              )}
            </div>
            <div className={cn("p-2 border-t text-center", theme === 'dark' ? 'border-zinc-700' : 'border-gray-200')}>
              <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:hover:bg-sky-400/10" 
                onClick={() => { setSelectedDay(dayData); popoverOpenStates.current[dayData.date_str] = false; safePlayClick(); }}
                onMouseEnter={safePlayHover}
              >
                <Eye className="h-3 w-3 mr-1.5"/> View Full Details
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return (
      <div className={cn(commonCellClasses, theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/60' : 'bg-gray-100/90 border-gray-200/70')}
        onMouseEnter={safePlayHover} // Add hover to empty cells too for consistency
      >
        <span className="text-xs md:text-sm text-gray-400 dark:text-gray-600">{gridCell.day}</span>
      </div>
    );
  };
  
  const renderTodayHighlight = () => {
    if (!todayInfo) return null;

    const systemTodayDateStr = today.toISOString().split('T')[0];
    const isMismatch = todayInfo.date_str !== systemTodayDateStr;

    return (
        <motion.div 
            initial={{ opacity: 0, y:10 }} 
            animate={{ opacity:1, y:0 }} 
            transition={{delay: 0.3, type: "spring", stiffness: 100, damping: 18 }}
            className={cn(
              "mb-6 md:mb-8 p-4 md:p-5 rounded-xl shadow-lg", 
              getAppleTintBackground(theme),
              theme === 'dark' ? 'border border-zinc-700/60' : 'border border-gray-200/90'
            )}
        >
            <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-lg font-semibold flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2.5 text-blue-500 dark:text-blue-400"/> 
                    <span className={cn(theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
                      {isMismatch ? `Highlights for ${locationCity} on ` : "Today's Highlights "} 
                      ({formatDateDisplay(todayInfo.date_str, {month:'short', day:'numeric'})})
                    </span>
                </h2>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => { setSelectedDay(todayInfo); safePlayClick(); }}
                  onMouseEnter={safePlayHover}
                  className={cn(
                    "text-xs",
                    theme === 'dark' ? 'text-sky-400 hover:bg-sky-400/10 hover:text-sky-300' : 'text-sky-600 hover:bg-sky-500/10 hover:text-sky-700'
                  )}
                >
                  View Details
                </Button>
            </div>
            {isMismatch && (
              <Alert variant="default" className={cn("mb-2.5 p-2.5 text-xs", theme === 'dark' ? 'bg-sky-900/60 border-sky-700/50 text-sky-300' : 'bg-sky-50/90 border-sky-200/80 text-sky-700')} onMouseEnter={safePlayHover}>
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <AlertDescription>
                  Displaying highlights for {formatDateDisplay(todayInfo.date_str, { month: 'short', day: 'numeric' })} in {locationCity}. Your system's current date is {formatDateDisplay(systemTodayDateStr, { month: 'short', day: 'numeric' })}.
                  <span className="ml-1">😅 could be a little bug prabhu</span>
                </AlertDescription>
              </Alert>
            )}
            {todayInfo.fasting_info.is_fasting_day && (
                <Alert className={cn("mb-2.5 p-2.5 text-sm", theme === 'dark' ? 'bg-pink-900/70 border-pink-700/60 text-pink-300' : 'bg-pink-50/90 border-pink-200/80 text-pink-700')}>
                    <Sparkles className="h-4 w-4 flex-shrink-0"/>
                    <AlertTitle className="font-semibold">{todayInfo.fasting_info.description}</AlertTitle>
                    {todayInfo.fasting_info.subject && <AlertDescription className="opacity-80">{todayInfo.fasting_info.subject}</AlertDescription>}
                    {getFastBreakingTimeDetails(todayInfo) && <AlertDescription className="mt-0.5 opacity-90">{getFastBreakingTimeDetails(todayInfo)}</AlertDescription>}
                </Alert>
            )}
            {todayInfo.ekadasi_parana_details && (
                 <Alert className={cn("mb-2.5 p-2.5 text-sm", theme === 'dark' ? 'bg-green-900/60 border-green-700/50 text-green-300' : 'bg-green-50/90 border-green-200/80 text-green-700')}>
                    <ListChecks className="h-4 w-4 flex-shrink-0"/>
                    <AlertTitle className="font-semibold">Ekadasi Parana</AlertTitle>
                    <AlertDescription>{todayInfo.ekadasi_parana_details}</AlertDescription>
                </Alert>
            )}
            {todayInfo.raw_events.length > 0 ? (
                <ul className="space-y-1.5 text-xs list-none pl-0">
                    {todayInfo.raw_events.slice(0,3).map((event, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                           <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getEventStyle(event).dot)}></div>
                           <span className={cn(getEventStyle(event).text, 'leading-snug')}>{event.text}</span>
                        </li>
                    ))}
                    {todayInfo.raw_events.length > 3 && <li className="text-muted-foreground text-[11px] pl-4">+ {todayInfo.raw_events.length - 3} more...</li>}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-2">No special events or observances today.</p>
            )}
        </motion.div>
    );
  }

  // Add this helper inside the component or as a utility
  /**
   * Finds the next tithi transition for the day and returns its name and time.
   * @param day CalendarDay
   * @returns { nextTithiName: string, nextTithiTime: string } | null
   */
  function getNextTithiTransition(day: CalendarDay): { nextTithiName: string, nextTithiTime: string } | null {
    if (!day.core_events_detailed) return null;
    // Find the first tithi event after the current tithi
    const tithiEvent = day.core_events_detailed.find(e => e.type_name.endsWith('Tithi') && e.time && e.time !== 'N/A');
    if (tithiEvent && tithiEvent.type_name) {
      // Remove 'Tithi' from the end for display
      const tithiName = tithiEvent.type_name.replace(/ Tithi$/, '');
      return { nextTithiName: tithiName, nextTithiTime: tithiEvent.time };
    }
    return null;
  }

  // --- Fasting Progress Bar ---
  /**
   * Helper to parse time string (HH:MM or HH:MM:SS) into a Date object for a given date string (YYYY-MM-DD)
   */
  function parseTimeOnDate(dateStr: string, timeStr: string): Date | null {
    if (!dateStr || !timeStr || timeStr === 'N/A') return null;
    // Accept HH:MM or HH:MM:SS
    const match = timeStr.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    const [_, h, m, s] = match;
    return new Date(`${dateStr}T${h}:${m}:${s || '00'}`);
  }

  /**
   * Finds the fasting window (start and end Date) for a given day and next day.
   * - Start: sunrise on this day
   * - End: parana window end on next day (if available), else Dvadasi Tithi start, else fallback to tithi_end_time
   */
  function getFastingWindow(prevDay: CalendarDay | undefined, day: CalendarDay, nextDay?: CalendarDay): { start: Date, end: Date } | null {
    // Start: Ekadasi Tithi start from prevDay
    let start: Date | null = null;
    if (prevDay?.core_events_detailed) {
      const ekadasiStart = prevDay.core_events_detailed.find(e => e.type_name === 'Ekadasi Tithi');
      if (ekadasiStart) {
        start = parseTimeOnDate(day.date_str, ekadasiStart.time);
      }
    }
    // Fallback to sunrise on this day if not found
    if (!start) {
      start = parseTimeOnDate(day.date_str, day.astro_details.sunrise_time);
    }
    let end: Date | null = null;
    // 1. Try ekadasi_parana_details on next day (parse end time)
    if (nextDay?.ekadasi_parana_details) {
      const match = nextDay.ekadasi_parana_details.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
      if (match) {
        end = parseTimeOnDate(nextDay.date_str, match[2] + ':00');
      }
    }
    // 2. Else, try Dvadasi Tithi event (on this or next day)
    if (!end) {
      const dvadasiEvent = (nextDay?.core_events_detailed || day.core_events_detailed || []).find(
        e => e.type_name === 'Dvadasi Tithi'
      );
      if (dvadasiEvent) {
        end = parseTimeOnDate(nextDay?.date_str || day.date_str, dvadasiEvent.time);
      }
    }
    // 3. Else, fallback to tithi_end_time
    if (!end && day.astro_details.tithi_end_time && day.astro_details.tithi_end_time !== 'N/A') {
      end = parseTimeOnDate(day.date_str, day.astro_details.tithi_end_time);
    }
    if (!start || !end) return null;
    return { start, end };
  }

  function getFastingProgress(window: { start: Date, end: Date }): { progress: number, status: string, timeLeft: number } {
    const now = new Date();
    if (now < window.start) return { progress: 0, status: 'Fasting not started', timeLeft: Math.round((window.start.getTime() - now.getTime()) / 60000) };
    if (now > window.end) return { progress: 1, status: 'Fasting completed', timeLeft: 0 };
    const progress = (now.getTime() - window.start.getTime()) / (window.end.getTime() - window.start.getTime());
    return { progress, status: 'Fasting in progress', timeLeft: Math.max(0, Math.round((window.end.getTime() - now.getTime()) / 60000)) };
  }

  /**
   * FastingProgressBar: Shows a real-time progress bar for the fasting window.
   * @param prevDay CalendarDay (fasting day)
   * @param day CalendarDay (fasting day)
   * @param nextDay CalendarDay (Dvadasi, for parana window)
   */
  function FastingProgressBar({ prevDay, day, nextDay }: { prevDay?: CalendarDay, day: CalendarDay, nextDay?: CalendarDay }) {
    const [, setNow] = useState(() => new Date());
    // Update every minute
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(timer);
    }, []);

    const window = getFastingWindow(prevDay, day, nextDay);
    if (!window) return null;
    const { progress, status, timeLeft } = getFastingProgress(window);

    return (
      <div className="my-4">
        <div className="flex flex-wrap justify-center gap-2 text-xs mb-2"> {/* Added flex-wrap and gap-2 */}
          <Badge variant="outline" className={cn("px-2 py-0.5", theme === 'dark' ? 'border-zinc-700 text-zinc-300' : 'border-gray-300 text-gray-700')}>
            Start: {window.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Badge>
          <Badge 
            variant={status === 'Fasting completed' ? 'default' : (status === 'Fasting in progress' ? 'secondary' : 'outline')}
            className={cn(
              "px-2 py-0.5",
              status === 'Fasting completed' ? 'bg-green-500/20 text-green-700 dark:bg-green-800/30 dark:text-green-300' :
              (status === 'Fasting in progress' ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300' :
              'bg-orange-500/20 text-orange-700 dark:bg-orange-800/30 dark:text-orange-300')
            )}
          >
            {status}
          </Badge>
          <Badge variant="outline" className={cn("px-2 py-0.5", theme === 'dark' ? 'border-zinc-700 text-zinc-300' : 'border-gray-300 text-gray-700')}>
            End: {window.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Badge>
        </div>
        <Progress value={progress * 100} className="h-2" />
        {status === 'Fasting in progress' && (
          <div className="text-xs text-center mt-1 text-muted-foreground">
            Time remaining: {timeLeft} min
          </div>
        )}
        {status === 'Fasting not started' && (
          <div className="text-xs text-center mt-1 text-muted-foreground">
            Fasting starts in {timeLeft} min
          </div>
        )}
        {status === 'Fasting completed' && (
          <div className="text-xs text-center mt-1 text-muted-foreground">
            Fasting window has ended.
          </div>
        )}
      </div>
    );
  }

  if (isPageLoading) {
    return <InitialPageLoader />;
  }

  return (
    <div className={cn("min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 pt-20 md:pt-24 pb-8 transition-colors duration-300", theme === 'dark' ? 'bg-zinc-950 text-gray-100' : 'bg-gray-50 text-gray-900')}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.header 
          className={cn(
            "mb-8 md:mb-10 p-6 md:p-8 rounded-xl shadow-lg text-center md:text-left",
            getAppleTintBackground(theme),
            theme === 'dark' ? 'border border-zinc-700/50' : 'border border-gray-200/80'
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.25 }}
          >
            Vaishnava Calendar
          </motion.h1>
          {/* --- PROMINENT BADGES FOR YEAR & MONTH --- */}
          <AnimatePresence>
            {pageHeaderDetails && (
              <motion.div
                className={cn(
                  "flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mt-3 mb-2.5 md:mb-3",
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.35 }}
              >
                <Badge
                  variant="default"
                  className={cn(
                    "text-lg md:text-xl font-bold px-4 py-2 rounded-xl shadow border-2 border-sky-500 bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-100 dark:border-sky-400",
                    "transition-colors duration-200"
                  )}
                >
                  Gaurabda {pageHeaderDetails.gaurabdaYear}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-lg md:text-xl font-bold px-4 py-2 rounded-xl shadow border-2 border-indigo-400 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-100 dark:border-indigo-400",
                    "transition-colors duration-200"
                  )}
                >
                  {pageHeaderDetails.gregorianYear}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-lg md:text-xl font-bold px-4 py-2 rounded-xl shadow border-2 border-amber-400 bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-400",
                    "transition-colors duration-200"
                  )}
                >
                  {pageHeaderDetails.currentVaishnavaMasa} / {pageHeaderDetails.currentGregorianMonthName}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          {/* --- END BADGES --- */}
          <motion.p 
            className={cn("text-sm md:text-base", theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.45 }}
          >
            Auspicious days and events, tailored to your location and time.
          </motion.p>
        </motion.header>

        {/* Controls Bar */}
        <motion.div 
          layout 
          className={cn(
            "mb-6 md:mb-8 p-4 md:p-6 rounded-2xl shadow-2xl",
            "backdrop-blur-md border-2",
            getAppleTintBackground(theme),
            theme === 'dark' ? 'border-sky-900/60' : 'border-sky-200/90'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Location Search Input */}
            <div className="sm:col-span-2 lg:col-span-2 relative">
              <label htmlFor="location-search" className="block text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-300 mb-2 uppercase flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500 dark:text-sky-300" /> Location
                {locationCity && locationCity !== "Fetching location..." && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 px-2 py-1 text-xs rounded-lg border-sky-400 bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200 dark:border-sky-500/80",
                      "transition-colors duration-200"
                    )}
                  >
                    {locationCity}
                  </Badge>
                )}
                {locationCoords && (
                  <Badge
                    variant="outline"
                    className="ml-2 px-2 py-1 text-xs rounded-lg border-amber-400 bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-500/80"
                  >
                    Using your location: {locationCoords.latitude.toFixed(2)}, {locationCoords.longitude.toFixed(2)}
                  </Badge>
                )}
              </label>
              <div className="relative flex items-center">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  ref={locationInputRef}
                  id="location-search"
                  type="text"
                  placeholder="Search city (e.g., Mayapur, London)"
                  className={cn(
                    "pl-9 pr-16 text-base rounded-lg shadow-md border-2 w-full focus:ring-2 focus:ring-sky-400 focus:border-sky-400",
                    theme === 'dark' 
                      ? 'bg-zinc-900/80 border-zinc-700 placeholder-zinc-400 focus:bg-zinc-800' 
                      : 'bg-white/90 border-sky-200 placeholder-gray-400 focus:bg-white'
                  )}
                  value={manualLocationInput}
                  onChange={handleManualLocationInputChange}
                  onFocus={() => { 
                    // safePlayPfff(); 
                    if (manualLocationInput.length > 1 && locationSearchResults.length > 0) setShowLocationResults(true);
                  }}
                  onMouseEnter={safePlayHover}
                />
                {manualLocationInput && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-9 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={clearLocationSearch} // safePlayPopOff is inside clearLocationSearch
                    onMouseEnter={safePlayHover}
                    aria-label="Clear search"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={handleUseCurrentLocationClick} // safePlayClick is inside
                    onMouseEnter={safePlayHover}
                    aria-label="Use current location"
                    title="Use current location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
              </div>

              {showLocationResults && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={cn(
                    "absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-y-auto styled-scrollbar location-results-dropdown border-2",
                    theme === 'dark' ? 'bg-zinc-900 border-sky-700' : 'bg-white border-sky-200'
                  )}
                >
                  {isLocationSearching && (
                    <div className="p-3 text-sm text-muted-foreground flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                    </div>
                  )}
                  {!isLocationSearching && locationSearchError && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-400 flex items-center">
                       <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" /> {locationSearchError}
                    </div>
                  )}
                  {!isLocationSearching && !locationSearchError && locationSearchResults.length > 0 && (
                    <ul className="py-1">
                      {locationSearchResults.map((loc, index) => (
                        <li key={`${loc.city}-${loc.country}-${index}`}>
                          <button
                            type="button"
                            className={cn(
                              "w-full text-left px-4 py-2 text-base rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors duration-150",
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            )}
                            onClick={() => handleLocationResultSelect(loc)} // safePlayPopOn is inside
                            onMouseEnter={safePlayHover}
                          >
                            {loc.city}, {loc.country}
                            <span className="text-xs text-muted-foreground ml-2">({loc.timezone_name})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                   {!isLocationSearching && !locationSearchError && locationSearchResults.length === 0 && manualLocationInput.length > 1 && (
                     <div className="p-3 text-sm text-muted-foreground">No results found. Try a broader search.</div>
                   )}
                </motion.div>
              )}
            </div>
            
            {/* Year Selector */}
            <div className="lg:col-start-3">
              <label htmlFor="year" className="block text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-300 mb-2 uppercase flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-500 dark:text-indigo-300" /> Year
              </label>
              <Select
                value={currentDate.getFullYear().toString()}
                onValueChange={(value) => {
                  setCurrentDate(new Date(parseInt(value), currentDate.getMonth(), 1));
                  safePlayClick(); // Sound for select change
                }}
              >
                <SelectTrigger 
                  id="year" 
                  onMouseEnter={safePlayHover}
                  onClick={safePlayClick} // Sound for opening select
                  className={cn(
                    "text-base rounded-lg shadow-md border-2 w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200",
                    theme === 'dark' 
                      ? 'bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800/90 data-[state=open]:bg-zinc-800/90' 
                      : 'bg-white/90 border-indigo-200 hover:bg-indigo-50 data-[state=open]:bg-indigo-50'
                  )}
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className={cn(theme === 'dark' ? 'bg-zinc-900 border-indigo-700' : 'bg-white border-indigo-200')}>
                  {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(year => (
                    <SelectItem key={year} value={year.toString()} onMouseEnter={safePlayHover} className={cn("text-sm", theme === 'dark' ? 'focus:bg-zinc-700' : 'focus:bg-gray-100')}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Selector */}
            <div>
              <label htmlFor="month" className="block text-xs font-medium text-muted-foreground mb-1.5">Month</label>
              <Select
                value={(currentDate.getMonth() + 1).toString()}
                onValueChange={(value) => {
                  setCurrentDate(new Date(currentDate.getFullYear(), parseInt(value) - 1, 1));
                  safePlayClick(); // Sound for select change
                }}
              >
                <SelectTrigger 
                  id="month" 
                  onMouseEnter={safePlayHover}
                  onClick={safePlayClick} // Sound for opening select
                  className={cn(
                    "text-sm rounded-md shadow-sm transition-colors duration-200",
                    theme === 'dark' 
                      ? 'bg-zinc-800/70 border-zinc-700 hover:bg-zinc-700/90 data-[state=open]:bg-zinc-700/90 focus:ring-sky-500' 
                      : 'bg-white/70 border-gray-300 hover:bg-gray-200/70 data-[state=open]:bg-gray-200/70 focus:ring-sky-500'
                  )}
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className={cn(theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300')}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()} onMouseEnter={safePlayHover} className={cn("text-sm", theme === 'dark' ? 'focus:bg-zinc-700' : 'focus:bg-gray-100')}>
                      {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* View Mode Toggle Button */}
            <div className="flex items-end">
                <Button 
                    variant="outline" 
                    onClick={() => {
                      const newMode = viewMode === 'calendar' ? 'list' : 'calendar';
                      setViewMode(newMode);
                      if (newMode === 'list') safePlaySwitchOn(); else safePlaySwitchOff();
                    }}
                    onMouseEnter={safePlayHover}
                    className={cn(
                      "w-full text-sm rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center",
                      theme === 'dark' 
                        ? 'bg-zinc-800/70 border-zinc-700 hover:bg-zinc-700/90 active:bg-zinc-600/80 text-zinc-300 hover:text-sky-400' 
                        : 'bg-white/70 border-gray-300 hover:bg-gray-200/70 active:bg-gray-300/70 text-gray-600 hover:text-sky-600'
                    )}
                >
                    {viewMode === 'calendar' ? <ListChecks className="h-4 w-4 mr-2 flex-shrink-0"/> : <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0"/>}
                    <span className="truncate">{viewMode === 'calendar' ? 'List View' : 'Calendar View'}</span>
                </Button>
            </div>
          </div>
        </motion.div>

        {renderTodayHighlight()}

        {/* Main Loading and Error States */}
        {loading && !error && ( // Show main loader only if not error
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-3" />
            <p className="text-lg font-medium">Loading Calendar Data...</p>
            <p className="text-sm text-muted-foreground">Fetching events for {locationCity || "selected location"}.</p>
          </div>
        )}
        {error && ( // Show error for calendar fetch
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-5 w-5"/>
            <AlertTitle>Error Loading Calendar</AlertTitle>
            <AlertDescription>{error} <br/> Please try a different location/month or check your connection.</AlertDescription>
          </Alert>
        )}
        
        {/* Calendar Grid and Details View */}
        {!loading && !error && calendarData.length > 0 && (
          <div className={cn("flex flex-col gap-6 md:gap-8", viewMode === 'calendar' && "lg:flex-row")}>
            {viewMode === 'calendar' && (
                <motion.div layout="position" className="w-full lg:w-[60%] xl:w-[65%] flex-shrink-0">
                <Card className={cn(
                  "shadow-xl",
                  getAppleTintBackground(theme),
                  theme === 'dark' ? 'border-zinc-700/60' : 'border-gray-200/90'
                )}>
                  <CardHeader className="flex flex-row items-center justify-between pt-4 pb-3 px-4 md:px-5">
                    <div className="flex items-baseline gap-2">
                      <motion.h2 layout="position" className="text-xl md:text-2xl font-semibold tracking-tight">
                        {currentDate.toLocaleString('default', { month: 'long' })}{' '}
                        <span className="text-muted-foreground">{currentDate.getFullYear()}</span>
                      </motion.h2>
                      {calendarData.length > 0 && calendarData[0].astro_details.gaurabda_year && (
                        <Badge variant="outline" className={cn("text-xs font-normal", theme === 'dark' ? 'border-sky-700 text-sky-300 bg-sky-900/30' : 'border-sky-300 text-sky-700 bg-sky-100/50')} onMouseEnter={safePlayHover}>
                          {calendarData[0].astro_details.gaurabda_year} GA
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="icon" variant="outline" onClick={() => navigateMonth('prev')} aria-label="Previous month"
                              onMouseEnter={safePlayHover}
                              className={cn(theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-800 active:bg-zinc-700' : 'border-gray-300 hover:bg-gray-100 active:bg-gray-200')}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => navigateMonth('next')} aria-label="Next month"
                              onMouseEnter={safePlayHover}
                              className={cn(theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-300 hover:bg-gray-100')}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 md:p-4">
                    <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-center text-xs font-medium text-muted-foreground mb-2 md:mb-3">
                      {daysOfWeek.map(day => (
                        <div key={day} className="py-1.5">{day}</div>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDate.toISOString()} 
                        initial={{ opacity: 0.8, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0.8, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-7 gap-1 md:gap-1.5"
                      >
                        {calendarGrid.map((gridCell, index) => (
                          <motion.div
                            key={`${gridCell.date.toISOString()}-${index}`} 
                            layout 
                          >
                           {renderDayCellContent(gridCell)}
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Selected Day Details or List View */}
            <motion.div layout="position" className={cn("w-full", viewMode === 'calendar' ? "lg:w-[40%] xl:w-[35%]" : "mt-6 md:mt-8")}>
              {selectedDay && viewMode === 'calendar' ? (
                <AnimatePresence mode="popLayout">
                  {/* ... existing selectedDay details rendering ... */}
                  <motion.div 
                    key={selectedDay.date_str}
                    initial={{ opacity: 0, scale: 0.95, y:10 }}
                    animate={{ opacity: 1, scale: 1, y:0 }}
                    exit={{ opacity: 0, scale: 0.95, y:10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "sticky top-24 rounded-xl shadow-2xl p-4 md:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto styled-scrollbar", 
                      getAppleTintBackground(theme),
                      theme === 'dark' ? 'border border-zinc-700/60' : 'border border-gray-200/90'
                    )}
                  >
                    <h3 className="text-lg md:text-xl font-semibold mb-1">{formatDateDisplay(selectedDay.date_str)}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{selectedDay.weekday_name} &bull; {selectedDay.astro_details.tithi_name} Tithi</p>
                    
                    <Separator className={cn("my-3.5", theme === 'dark' ? 'bg-zinc-700/70' : 'bg-gray-300/70')} />

                    {/* Fasting Info Alert */}
                    {selectedDay.fasting_info.is_fasting_day && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <Alert className={cn("mb-3.5 p-3 text-sm", theme === 'dark' ? 'bg-pink-900/70 border-pink-700/60 text-pink-300' : 'bg-pink-50/90 border-pink-200/80 text-pink-700')}>
                          <Sparkles className="h-4 w-4 flex-shrink-0" />
                          <AlertTitle className="font-semibold">{selectedDay.fasting_info.description}</AlertTitle>
                          {selectedDay.fasting_info.subject && <AlertDescription className="opacity-80">{selectedDay.fasting_info.subject}</AlertDescription>}
                          {getFastBreakingTimeDetails(selectedDay) && <AlertDescription className="mt-1 opacity-90">{getFastBreakingTimeDetails(selectedDay)}</AlertDescription>}
                          {selectedDay.fasting_info.type_id !== 0 && (
                            <Badge variant="outline" className={cn("mt-1.5 text-xs", theme === 'dark' ? 'border-pink-700/80 text-pink-400 bg-pink-900/50' : 'border-pink-300/80 text-pink-600 bg-pink-100/50')}>
                              Type ID: {selectedDay.fasting_info.type_id}
                            </Badge>
                          )}
                        </Alert>
                      </motion.div>
                    )}
                    
                    {selectedDay &&
                      selectedDay.fasting_info.is_fasting_day &&
                      /ekadasi/i.test(selectedDay.fasting_info.description) && (
                        <FastingProgressBar
                          prevDay={calendarData[calendarData.findIndex(d => d.date_str === selectedDay.date_str) - 1]}
                          day={selectedDay}
                          nextDay={calendarData[calendarData.findIndex(d => d.date_str === selectedDay.date_str) + 1]}
                        />
                    )}
                    
                    {/* Ekadasi Parana Alert */}
                    {selectedDay.ekadasi_parana_details && (
                       <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Alert className={cn("mb-3.5 p-3 text-sm", theme === 'dark' ? 'bg-green-900/60 border-green-700/50 text-green-300' : 'bg-green-50/90 border-green-200/80 text-green-700')}>
                          <ListChecks className="h-4 w-4 flex-shrink-0" />
                          <AlertTitle className="font-semibold">Ekadasi Parana</AlertTitle>
                          <AlertDescription>{selectedDay.ekadasi_parana_details}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {/* Enhanced Info Cards Section */}
                    <div className="space-y-3.5 text-sm">
                      {/* Astronomical Panorama Card */}
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Card className={cn(theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700/50' : 'bg-slate-100/80 border-slate-200/90')}>
                          <CardHeader className="py-2.5 px-3.5">
                            <CardTitle className="text-lg flex items-center"> {/* Increased font size to text-lg */}
                              <Orbit className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400"/>Astronomical Panorama
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm px-3.5 pb-3 space-y-2.5"> {/* Increased font size to text-sm */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                              <div className="flex items-center">
                                <Disc3 className="h-4 w-4 mr-1.5 text-muted-foreground"/> {/* Increased icon size */}
                                <span>Tithi: <strong>{selectedDay.astro_details.tithi_name}</strong></span>
                                <Badge variant={selectedDay.astro_details.paksa_name === 'Gaura' ? 'default' : 'secondary'} className={cn("ml-1.5 text-[10px] px-1.5 py-0.5 leading-tight", selectedDay.astro_details.paksa_name === 'Gaura' ? 'bg-yellow-400/80 text-yellow-900 dark:bg-yellow-500/70 dark:text-yellow-100' : 'bg-sky-400/80 text-sky-900 dark:bg-sky-500/70 dark:text-sky-100')}>{selectedDay.astro_details.paksa_name}</Badge> {/* Adjusted badge size */}
                              </div>
                              <div className="flex items-center"><Percent className="h-4 w-4 mr-1.5 text-muted-foreground"/>Tithi Elapsed: {selectedDay.astro_details.tithi_elapse_percent.toFixed(1)}%</div> {/* Increased icon size */}
                              
                              <div className="flex items-center"><Star className="h-4 w-4 mr-1.5 text-muted-foreground"/>Nakshatra: <strong>{selectedDay.astro_details.naksatra_name}</strong></div> {/* Increased icon size */}
                              <div className="flex items-center"><Percent className="h-4 w-4 mr-1.5 text-muted-foreground"/>Nakshatra Elapsed: {selectedDay.astro_details.naksatra_elapse_percent.toFixed(1)}%</div> {/* Increased icon size */}

                              <div className="flex items-center"><Link2 className="h-4 w-4 mr-1.5 text-muted-foreground"/>Yoga: <strong>{selectedDay.astro_details.yoga_name}</strong></div> {/* Increased icon size */}
                              <div className="flex items-center"><CalendarClock className="h-4 w-4 mr-1.5 text-muted-foreground"/>Masa: <strong>{selectedDay.astro_details.masa_name}</strong> ({selectedDay.astro_details.gaurabda_year})</div> {/* Increased icon size */}
                              
                              <div className="flex items-center"><Sun className="h-4 w-4 mr-1.5 text-yellow-500"/>Sun Rashi: {selectedDay.astro_details.rasi_name_sun}</div> {/* Increased icon size */}
                              <div className="flex items-center"><Moon className="h-4 w-4 mr-1.5 text-sky-400"/>Moon Rashi: {selectedDay.astro_details.rasi_name_moon}</div> {/* Increased icon size */}
                            </div>
                            <Separator className={cn("my-2", theme === 'dark' ? 'bg-zinc-700/80' : 'bg-slate-300/80')} />
                            {(() => {
                              const { tithi_start_time, tithi_end_time, naksatra_start_time, naksatra_end_time } = selectedDay.astro_details;
                              const showTithiRange = tithi_start_time && tithi_end_time && tithi_start_time !== tithi_end_time && tithi_start_time !== "N/A" && tithi_end_time !== "N/A";
                              const showTithiSingle = tithi_start_time && tithi_start_time !== "N/A" && (!tithi_end_time || tithi_end_time === "N/A" || tithi_start_time === tithi_end_time);
                              const showNakshatraRange = naksatra_start_time && naksatra_end_time && naksatra_start_time !== naksatra_end_time && naksatra_start_time !== "N/A" && naksatra_end_time !== "N/A";
                              const showNakshatraSingle = naksatra_start_time && naksatra_start_time !== "N/A" && (!naksatra_end_time || naksatra_end_time === "N/A" || naksatra_start_time === naksatra_end_time);
                              if (showTithiRange || showTithiSingle || showNakshatraRange || showNakshatraSingle) {
                                return <>
                                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-muted-foreground/90">
                                    <p>Tithi: {selectedDay.astro_details.tithi_name}</p>
                                    {getNextTithiTransition(selectedDay) && (
                                      <p>
                                        {getNextTithiTransition(selectedDay)?.nextTithiName} starts: {getNextTithiTransition(selectedDay)?.nextTithiTime}
                                      </p>
                                    )}
                                    {showNakshatraRange && <><p>Nak. Starts: {naksatra_start_time}</p><p>Nak. Ends: {naksatra_end_time}</p></>}
                                    {showNakshatraSingle && <p>Nakshatra: {naksatra_start_time}</p>}
                                  </div>
                                  <Separator className={cn("my-2", theme === 'dark' ? 'bg-zinc-700/80' : 'bg-slate-300/80')} />
                                </>;
                              }
                              return null;
                            })()}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              <p><SunriseIcon className="inline h-4 w-4 mr-1 opacity-70"/>Sunrise: {selectedDay.astro_details.sunrise_time} {/* Increased icon size */}</p>
                              <p><SunsetIcon className="inline h-4 w-4 mr-1 opacity-70"/>Sunset: {selectedDay.astro_details.sunset_time} {/* Increased icon size */}</p>
                              <p><Clock className="inline h-4 w-4 mr-1 opacity-70"/>Arunodaya: {selectedDay.astro_details.arunodaya_time} {/* Increased icon size */}</p>
                              <p><Clock className="inline h-4 w-4 mr-1 opacity-70"/>Noon: {selectedDay.astro_details.noon_time} {/* Increased icon size */}</p>
                              {selectedDay.astro_details.moonrise_time && selectedDay.astro_details.moonrise_time !== "N/A" && (
                                <p><ArrowUpFromDot className="inline h-4 w-4 mr-1 opacity-70"/>Moonrise: {selectedDay.astro_details.moonrise_time} {/* Increased icon size */}</p>
                              )}
                              {selectedDay.astro_details.moonset_time && selectedDay.astro_details.moonset_time !== "N/A" && (
                                <p><ArrowDownToDot className="inline h-4 w-4 mr-1 opacity-70"/>Moonset: {selectedDay.astro_details.moonset_time} {/* Increased icon size */}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Events & Observances Card */}
                      {(selectedDay.raw_events.length > 0 || selectedDay.events.length > 0) && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
                          <Card className={cn(theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700/50' : 'bg-slate-100/80 border-slate-200/90')}>
                            <CardHeader className="py-2.5 px-3.5">
                              <CardTitle className="text-lg flex items-center"> {/* Increased font size to text-lg */}
                                <CalendarCheck2 className="mr-2 h-5 w-5 text-green-500 dark:text-green-400"/>Events & Observances
                              </CardTitle>
                              <CardDescription className="text-sm mt-0.5">Times are for {locationCity}.</CardDescription> {/* Increased font size to text-sm */}
                            </CardHeader>
                            <CardContent className="text-sm px-3.5 pb-3"> {/* Increased font size to text-sm */}
                              {(() => {
                                // Deduplicate by event text, prefer raw_events for style if available
                                const allEventTexts = [
                                  ...selectedDay.events,
                                  ...selectedDay.raw_events.map(e => e.text)
                                ];
                                const uniqueEventTexts = Array.from(new Set(allEventTexts));
                                // For each unique event, find a matching raw_event for style, else fallback
                                return (
                                  <ul className="space-y-1.5">
                                    {uniqueEventTexts.map((eventText, idx) => {
                                      const rawEvent = selectedDay.raw_events.find(e => e.text === eventText);
                                      const dotClass = rawEvent ? getEventStyle(rawEvent).dot : getEventStyle({text:eventText, prio:250, dispItem:0} as RawEvent).dot;
                                      const textClass = rawEvent ? getEventStyle(rawEvent).text : undefined;
                                      return (
                                        <li key={idx} className="flex items-start gap-2">
                                          <div className={cn("h-2 w-2 rounded-full mt-1 flex-shrink-0", dotClass)}></div> {/* Increased dot size */}
                                          <span className={textClass}>{eventText}</span>
                                          {rawEvent && rawEvent.fastsubject && (
                                            <span className="ml-1 text-muted-foreground italic text-xs">({rawEvent.fastsubject}) {/* Increased font size to text-xs */}</span>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                      
                       {/* Core Astronomical Events Timeline */}
                      {selectedDay.core_events_detailed && selectedDay.core_events_detailed.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                          <Card className={cn(theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700/50' : 'bg-slate-100/80 border-slate-200/90')}>
                            <CardHeader className="py-2.5 px-3.5">
                              <CardTitle className="text-lg flex items-center"> {/* Increased font size to text-lg */}
                                <GitCompareArrows className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400"/>Daily Astro Events
                              </CardTitle>
                               <CardDescription className="text-sm mt-0.5">Timeline of tithi/nakshatra changes.</CardDescription> {/* Increased font size to text-sm */}
                            </CardHeader>
                            <CardContent className="text-sm px-3.5 pb-3 space-y-1.5"> {/* Increased font size to text-sm */}
                              {selectedDay.core_events_detailed.map((coreEvent, idx) => (
                                <div key={`core-${idx}`} className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1.5 text-muted-foreground flex-shrink-0"/> {/* Increased icon size */}
                                  <span className="font-medium w-16">{coreEvent.time}</span>
                                  <span className="text-muted-foreground/80">{coreEvent.type_name} {coreEvent.dst_applied ? '(DST)' : ''}</span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {/* Special Indicators Card */}
                      {(selectedDay.sankranti_today_info || selectedDay.mahadvadasi || selectedDay.ksaya_tithi || selectedDay.vriddhi_day_no !== null) && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                          <Card className={cn(theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700/50' : 'bg-slate-100/80 border-slate-200/90')}>
                            <CardHeader className="py-2.5 px-3.5">
                              <CardTitle className="text-lg flex items-center"> {/* Increased font size to text-lg */}
                                <AlertOctagon className="mr-2 h-5 w-5 text-orange-500 dark:text-orange-400"/>Special Indicators
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm px-3.5 pb-3 space-y-2.5"> {/* Increased font size to text-sm */}
                              {selectedDay.sankranti_today_info && (
                                <div className="flex items-start gap-2">
                                  <SankrantiIcon className="h-4 w-4 mt-0.5 text-sky-500"/> {/* Increased icon size */}
                                  <Badge variant="outline" className={cn("border-sky-500/60 text-sky-600 dark:text-sky-400 dark:border-sky-500/70 dark:bg-sky-800/30")}>Sankranti</Badge>
                                  <span className="text-sm text-muted-foreground block whitespace-normal break-words">{selectedDay.sankranti_today_info}</span> {/* Increased font size to text-sm */}
                                </div>
                              )}
                              {selectedDay.mahadvadasi && (
                                <div className="flex items-start gap-2">
                                  <MahadvadasiIcon className="h-4 w-4 mt-0.5 text-rose-500"/> {/* Increased icon size */}
                                  <Badge variant="outline" className={cn("border-rose-500/60 text-rose-600 dark:text-rose-400 dark:border-rose-500/70 dark:bg-rose-800/30")}>Mahadvadasi</Badge>
                                  <span className="text-sm text-muted-foreground block whitespace-normal break-words">{selectedDay.mahadvadasi}</span> {/* Increased font size to text-sm */}
                                </div>
                              )}
                              {selectedDay.ksaya_tithi && (
                                <div className="flex items-start gap-2">
                                  <KsayaTithiIcon className="h-4 w-4 mt-0.5 text-amber-500"/> {/* Increased icon size */}
                                  <Badge variant="outline" className={cn("border-amber-500/60 text-amber-600 dark:text-amber-400 dark:border-amber-500/70 dark:bg-amber-800/30")}>Kshaya Tithi</Badge>
                                  <span className="text-sm text-muted-foreground block whitespace-normal break-words">{selectedDay.ksaya_tithi}</span> {/* Increased font size to text-sm */}
                                </div>
                              )}
                              {selectedDay.vriddhi_day_no !== null && (
                                <div className="flex items-start gap-2">
                                  <VriddhiDayIcon className="h-4 w-4 mt-0.5 text-purple-500"/> {/* Increased icon size */}
                                  <Badge variant="outline" className={cn("border-purple-500/60 text-purple-600 dark:text-purple-400 dark:border-purple-500/70 dark:bg-purple-800/30")}>Vriddhi Day</Badge>
                                  <span className="text-sm text-muted-foreground block whitespace-normal break-words">{selectedDay.vriddhi_day_no}</span> {/* Increased font size to text-sm */}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : viewMode === 'list' && calendarData.length > 0 ? (
                // ENHANCED TABLE-BASED LIST VIEW
                (() => {
                  const groupedByMasa: { [masaName: string]: CalendarDay[] } = calendarData.reduce((acc, day) => {
                    const masa = day.astro_details.masa_name || "Unknown Masa";
                    if (!acc[masa]) {
                      acc[masa] = [];
                    }
                    acc[masa].push(day);
                    return acc;
                  }, {} as { [masaName: string]: CalendarDay[] });

                  return (
                    <div className="space-y-10">
                      {Object.entries(groupedByMasa).map(([masaName, daysInMasa], masaIdx) => (
                        <motion.div 
                          key={masaName} 
                          className={cn(
                            "p-4 sm:p-5 md:p-6 rounded-2xl shadow-2xl overflow-hidden", // Added overflow-hidden
                            getAppleTintBackground(theme),
                            theme === 'dark' ? 'border border-zinc-700/60' : 'border border-gray-200/80'
                          )}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 20, delay: masaIdx * 0.1 }}
                        >
                          <h2 className={cn(
                            "text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center pb-3",
                            theme === 'dark' ? 'border-b border-zinc-700/70 text-sky-300' : 'border-b border-gray-300/70 text-sky-700'
                          )}>
                            {masaName} Masa
                            {daysInMasa.length > 0 && daysInMasa[0].astro_details.gaurabda_year && 
                              <span className="text-xl font-semibold text-muted-foreground ml-2"> (Gaurabda {daysInMasa[0].astro_details.gaurabda_year})</span>
                            }
                          </h2>
                           <div className="text-center text-xs sm:text-sm text-muted-foreground mb-4 md:mb-6">
                              <MapPin className="inline h-3.5 w-3.5 mr-1 opacity-80"/> Location: {locationCity}
                           </div>
                          <div className="overflow-x-auto styled-scrollbar rounded-lg"> {/* Added rounded-lg here */}
                            <table className="w-full min-w-[800px] text-xs"> {/* Changed to text-xs */}
                              <thead 
                                className={cn(
                                  "sticky top-0 z-10", // Sticky header
                                  theme === 'dark' ? 'bg-zinc-800/90 backdrop-blur-sm' : 'bg-gray-200/90 backdrop-blur-sm'
                                )}
                              >
                                <tr>
                                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[160px]"><CalendarDays className="inline h-4 w-4 mr-1.5 opacity-70"/>Date</th>
                                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Disc3 className="inline h-4 w-4 mr-1.5 opacity-70"/>Tithi</th>
                                  <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[50px]"><GitCompareArrows className="inline h-4 w-4 opacity-70"/>P</th>
                                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Star className="inline h-4 w-4 mr-1.5 opacity-70"/>Nakshatra</th>
                                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Link2 className="inline h-4 w-4 mr-1.5 opacity-70"/>Yoga</th>
                                  <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[70px]"><UtensilsCrossed className="inline h-4 w-4 opacity-70"/>Fast</th>
                                </tr>
                              </thead>
                              <tbody className={cn(theme === 'dark' ? 'divide-y divide-zinc-700/50' : 'divide-y divide-gray-200/70')}>
                                {daysInMasa.map((day, dayIdx) => {
                                  const hasDetails = day.events.length > 0 || 
                                                     day.fasting_info.is_fasting_day || // Show details if any fasting, not just non-Ekadasi
                                                     day.ekadasi_parana_details || 
                                                     day.sankranti_today_info || 
                                                     day.mahadvadasi || 
                                                     day.ksaya_tithi || 
                                                     day.vriddhi_day_no !== null || // Check for null explicitly
                                                     (day.core_events_detailed && day.core_events_detailed.length > 0);

                                  return (
                                  <Fragment key={day.date_str}>
                                    <motion.tr 
                                      layout
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ type: "spring", stiffness: 200, damping: 25, delay: dayIdx * 0.04 }}
                                      className={cn(
                                        dayIdx % 2 === 0 ? (theme === 'dark' ? 'bg-zinc-800/40 hover:bg-zinc-800/60' : 'bg-white/40 hover:bg-gray-50/60') 
                                                        : (theme === 'dark' ? 'bg-zinc-800/60 hover:bg-zinc-800/80' : 'bg-gray-100/60 hover:bg-gray-200/60'),
                                        "transition-colors duration-150"
                                      )}
                                    >
                                      <motion.td layout="position" className="py-3 px-3 align-middle font-medium">
                                        <div className="flex items-center gap-2">
                                          <CalendarDays className={cn("h-4 w-4 flex-shrink-0", theme === 'dark' ? 'text-sky-400' : 'text-sky-600')} />
                                          <Badge 
                                            variant="outline" 
                                            className={cn(
                                              "text-xs font-semibold px-2 py-0.5 rounded-md",
                                              theme === 'dark' ? 'border-sky-700 text-sky-300 bg-sky-900/30' : 'border-sky-300 text-sky-700 bg-sky-100/50'
                                            )}
                                          >
                                            {formatDateDisplay(day.date_str, { day: 'numeric', month: 'short'})}
                                          </Badge>
                                          <span className="ml-1.5 text-xs text-muted-foreground">{day.weekday_name.substring(0,3)}</span>
                                        </div>
                                      </motion.td>
                                      <motion.td layout="position" className="py-3 px-3 align-middle">
                                        <div className="flex items-center gap-1.5">
                                          <Disc3 className="h-3.5 w-3.5 opacity-70 flex-shrink-0"/> {day.astro_details.tithi_name}
                                        </div>
                                      </motion.td>
                                      <motion.td layout="position" className="py-3 px-3 align-middle text-center">
                                        {day.astro_details.paksa_name.charAt(0).toUpperCase() === 'G' ? 
                                          <Sun className="h-4 w-4 mx-auto text-yellow-500"/> : 
                                          <Moon className="h-4 w-4 mx-auto text-sky-400"/> }
                                      </motion.td>
                                      <motion.td layout="position" className="py-3 px-3 align-middle">
                                        <div className="flex items-center gap-1.5">
                                          <Star className="h-3.5 w-3.5 opacity-70 flex-shrink-0"/> {day.astro_details.naksatra_name}
                                        </div>
                                      </motion.td>
                                      <motion.td layout="position" className="py-3 px-3 align-middle">
                                        <div className="flex items-center gap-1.5">
                                          <Link2 className="h-3.5 w-3.5 opacity-70 flex-shrink-0"/> {day.astro_details.yoga_name}
                                        </div>
                                      </motion.td>
                                      <motion.td layout="position" className="py-3 px-3 align-middle text-center">
                                        {day.fasting_info.is_fasting_day && (
                                          day.fasting_info.description.toLowerCase().includes("ekadasi") ?
                                          <Sparkles className="h-4 w-4 mx-auto text-pink-500" /> :
                                          <UtensilsCrossed className="h-4 w-4 mx-auto text-orange-500" />
                                        )}
                                      </motion.td>
                                    </motion.tr>
                                    
                                    {hasDetails && (
                                      <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2, delay: dayIdx * 0.04 + 0.05 }}
                                        className={cn(
                                          dayIdx % 2 === 0 ? (theme === 'dark' ? 'bg-zinc-800/40' : 'bg-white/40') 
                                                          : (theme === 'dark' ? 'bg-zinc-800/60' : 'bg-gray-100/60')
                                        )}
                                      >
                                        <motion.td layout="position" colSpan={6} className="px-3 py-2.5 pb-3 text-xs">
                                          <div className="pl-6 md:pl-8 space-y-1.5">
                                            {day.fasting_info.is_fasting_day && (
                                                <Alert variant="default" className={cn("p-2 text-xs mb-1", theme === 'dark' ? 'bg-pink-900/70 border-pink-700/60 text-pink-300' : 'bg-pink-50/90 border-pink-200/80 text-pink-700')}>
                                                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                                                  <AlertTitle className="font-semibold">{day.fasting_info.description}</AlertTitle>
                                                  {day.fasting_info.subject && <AlertDescription className="opacity-80">{day.fasting_info.subject}</AlertDescription>}
                                                  {getFastBreakingTimeDetails(day) && <AlertDescription className="mt-0.5 opacity-90">{getFastBreakingTimeDetails(day)}</AlertDescription>}
                                                </Alert>
                                            )}
                                            {day.ekadasi_parana_details && (
                                              <Alert variant="default" className={cn("p-2 text-xs mb-1", theme === 'dark' ? 'bg-green-900/60 border-green-700/50 text-green-300' : 'bg-green-50/90 border-green-200/80 text-green-700')}>
                                                <ListChecks className="h-3.5 w-3.5 text-green-500" />
                                                <AlertTitle className="font-semibold">Ekadasi Parana</AlertTitle>
                                                <AlertDescription>{day.ekadasi_parana_details}</AlertDescription>
                                              </Alert>
                                            )}
                                            {day.raw_events.length > 0 && (
                                              <div className="space-y-1">
                                                {day.raw_events.map((event, idx) => (
                                                  <div key={`re-${idx}`} className="flex items-start gap-1.5">
                                                      <div className={cn("h-1.5 w-1.5 rounded-full mt-1 flex-shrink-0", getEventStyle(event).dot)}></div>
                                                      <p className={cn(getEventStyle(event).text)}>{event.text}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            {day.events.length > 0 && day.raw_events.length === 0 && ( // Fallback if raw_events are empty but events exist
                                              <div className="space-y-1">
                                                {day.events.map((event, idx) => (
                                                  <div key={`evt-${day.date_str}-${idx}`} className="flex items-start gap-2 text-muted-foreground">
                                                    <Tags className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-70"/> {event}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            
                                            {/* Special Indicators */}
                                            {day.sankranti_today_info && <div className="flex items-center gap-2"><SankrantiIcon className="h-3.5 w-3.5 text-sky-500 flex-shrink-0"/><strong>Sankranti:</strong> {day.sankranti_today_info}</div>}
                                            {day.mahadvadasi && <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400"><MahadvadasiIcon className="h-3.5 w-3.5 flex-shrink-0"/><strong>Mahadvadasi:</strong> {day.mahadvadasi}</div>}
                                            {day.ksaya_tithi && <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500"><KsayaTithiIcon className="h-3.5 w-3.5 flex-shrink-0"/><strong>Kshaya Tithi:</strong> {day.ksaya_tithi}</div>}
                                            {day.vriddhi_day_no !== null && <div className="flex items-center gap-2 text-purple-600 dark:text-purple-500"><VriddhiDayIcon className="h-3.5 w-3.5 flex-shrink-0"/><strong>Vriddhi Day No:</strong> {day.vriddhi_day_no}</div>}
                                            
                                            {/* Astro Times */}
                                            {(day.astro_details.arunodaya_time !== "N/A" || day.astro_details.sunrise_time !== "N/A" || day.astro_details.noon_time !== "N/A" || day.astro_details.sunset_time !== "N/A" || day.astro_details.moonrise_time !== "N/A" || day.astro_details.moonset_time !== "N/A") && (
                                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-muted-foreground/90 mt-1 pt-1 border-t border-dashed border-gray-300/50 dark:border-zinc-700/50">
                                                {day.astro_details.arunodaya_time !== "N/A" && <span className="flex items-center gap-1"><Clock className="h-3 w-3 opacity-70"/>Arunodaya: {day.astro_details.arunodaya_time}</span>}
                                                {day.astro_details.sunrise_time !== "N/A" && <span className="flex items-center gap-1"><SunriseIcon className="h-3 w-3 opacity-70"/>Sunrise: {day.astro_details.sunrise_time}</span>}
                                                {day.astro_details.noon_time !== "N/A" && <span className="flex items-center gap-1"><Sun className="h-3 w-3 opacity-70"/>Noon: {day.astro_details.noon_time}</span>}
                                                {day.astro_details.sunset_time !== "N/A" && <span className="flex items-center gap-1"><SunsetIcon className="h-3 w-3 opacity-70"/>Sunset: {day.astro_details.sunset_time}</span>}
                                                {day.astro_details.moonrise_time !== "N/A" && <span className="flex items-center gap-1"><ArrowUpFromDot className="h-3 w-3 opacity-70"/>Moonrise: {day.astro_details.moonrise_time}</span>}
                                                {day.astro_details.moonset_time !== "N/A" && <span className="flex items-center gap-1"><ArrowDownToDot className="h-3 w-3 opacity-70"/>Moonset: {day.astro_details.moonset_time}</span>}
                                              </div>
                                            )}

                                            {/* Core Events Detailed */}
                                            {day.core_events_detailed && day.core_events_detailed.length > 0 && (
                                              <div className="mt-1 pt-1 border-t border-dashed border-gray-300/50 dark:border-zinc-700/50 text-muted-foreground/80">
                                                <p className="font-medium text-muted-foreground mb-0.5">Key Astro Timings:</p>
                                                {day.core_events_detailed.map((ce, idx) => (
                                                  <div key={`core-evt-${day.date_str}-${idx}`} className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 opacity-60 flex-shrink-0"/>
                                                    <span>{ce.time} - {ce.type_name} {ce.dst_applied ? "(DST)" : ""}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </motion.td>
                                      </motion.tr>
                                    )}
                                  </Fragment>
                                )})}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      ))}
                      {Object.keys(groupedByMasa).length === 0 && (
                        <motion.p 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-center text-muted-foreground py-12 text-lg"
                        >
                          <CalendarDays className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70"/>
                          No calendar data available for this month.
                        </motion.p>
                      )}
                    </div>
                  );
                })()
              ) : ( // Placeholder when no day is selected in calendar view OR list view has no data (covered by outer check)
                <div className={cn("flex flex-col items-center justify-center h-64 rounded-xl text-center", theme === 'dark' ? 'bg-zinc-900 border-zinc-700/50' : 'bg-white border-gray-200/80')}>
                  <Info className="h-10 w-10 text-muted-foreground mb-3"/>
                  <p className="font-medium">Select a day</p>
                  <p className="text-sm text-muted-foreground">Click on a day in the calendar to see its details.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
        {/* No Data State for Calendar */}
        {!loading && !error && calendarData.length === 0 && (
            <div className={cn("flex flex-col items-center justify-center h-64 rounded-xl text-center", theme === 'dark' ? 'bg-zinc-900 border-zinc-700/50' : 'bg-white border-gray-200/80')}>
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4"/>
                <p className="text-lg font-medium">No Calendar Data</p>
                <p className="text-sm text-muted-foreground">Could not find calendar information for {locationCity || "the selected location"} for this month.</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different location or month.</p>
            </div>
        )}
      </div>
    </div>
  );
}
