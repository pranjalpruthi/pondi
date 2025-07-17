import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { Calendar, Clock, X, ExternalLink, Loader2, ListChecks, Sparkles, GitCompareArrows } from "lucide-react"
import { IconBrandGoogle, IconBrandApple } from '@tabler/icons-react';
import { FlipButton } from "@/components/animate-ui/buttons/flip"
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, memo, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMediaQuery } from "@uidotdev/usehooks";
import ShimmerText from "@/components/ui/shimmer-text";

// Types
interface AstroDetailInfo {
  tithi_name: string;
  masa_name: string;
  sunrise_time?: string;
}
interface FastingInfo {
  is_fasting_day: boolean;
  description: string;
  subject?: string;
}
interface RawEvent {
  text: string;
  prio: number;
  dispItem: number;
  fasttype: number;
  fastsubject?: string;
}
interface CalendarDay {
  date_str: string;
  astro_details: AstroDetailInfo;
  fasting_info: FastingInfo;
  events: string[];
  raw_events: RawEvent[];
  core_events_detailed?: CoreEventDetail[]; // Added for astro event timeline
  ekadasi_parana_details: string | null;
}
interface CalendarResponse {
  data: CalendarDay[];
}
// Copied from calender/index.tsx for Astro Events Timeline
interface CoreEventDetail {
  type: number; // Event type ID
  type_name: string; // e.g., "Tithi Pratipat starts", "Naksatra Rohini ends"
  data: number; // e.g., Tithi number, Naksatra number
  time: string; // HH:MM:SS of the event
  dst_applied: boolean; // If DST was applied to this event's time
}
interface TempleEventsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  _onSoundPlay?: () => void
}
type DailySchedule = {
  time: string
  activity: string
  description?: string
}

// Constants & Helpers
const dailySchedule: DailySchedule[] = [
  { time: '4:30 AM', activity: 'Mangal Aarati', description: 'Early morning worship' },
  { time: '7:15 AM', activity: 'Darshan Aarati', description: 'Morning darshan ceremony' },
  { time: '7:20 AM', activity: 'Guru Puja', description: 'Worship of Srila Prabhupada' },
  { time: '8:00 AM', activity: 'Bhagvatam Discourse', description: 'Morning scripture class' },
  { time: '12:00 PM', activity: 'Darshan Closes', description: 'Darshan of the Deities concludes for the morning; temple reopens in the evening.' },
  { time: '5:30 PM', activity: 'Gaura Arati', description: 'Evening worship ceremony' },
  { time: '6:30 PM', activity: 'Darshan Closes', description: 'Darshan of the Deities concludes; temple may remain open for other activities.' }
];

const prabhupadaQuotes = [
  "Chanting is the waxing of the moon that spreads the white lotus of good fortune for all living entities.",
  "A grain of devotion is more valuable than tons of faithlessness.",
  "Religion without philosophy is sentiment, or sometimes fanaticism, while philosophy without religion is mental speculation.",
  "You are not your body. You are the spiritual soul, part and parcel of God.",
  "The purpose of our life is to go back home, back to Godhead.",
  "When you are confused, chant Hare Krishna and you will get the answer.",
  "Our only business is to love God, not to ask God for our daily bread."
];

const getRandomQuote = () => prabhupadaQuotes[Math.floor(Math.random() * prabhupadaQuotes.length)];

const parseLocalDateStr = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const getLocalDateStringYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = parseLocalDateStr(dateStr);
  return date.toLocaleDateString('en-US', options || { weekday: 'short', month: 'short', day: 'numeric' });
};

const getEventStyle = (event: RawEvent, isFastingDay: boolean): { dot: string, text: string } => {
    const lightText = isFastingDay ? 'text-rose-900/90' : 'text-sky-900/90';
    const darkText = isFastingDay ? 'dark:text-rose-300' : 'dark:text-sky-300';

    if (event.fasttype > 0 || event.text.toLowerCase().includes('ekadasi')) {
      return { dot: 'bg-rose-500/80 dark:bg-rose-400/80', text: `${lightText} ${darkText}` };
    }
    if (event.dispItem === 17 && event.text.toLowerCase().includes('break fast')) {
        return { dot: 'bg-green-500', text: `text-green-900/90 dark:text-green-300` };
    }
    if (event.dispItem === 17) { 
        return { dot: 'bg-red-500', text: `text-red-900/90 dark:text-red-300` };
    }
    if (event.prio <= 100) return { dot: 'bg-sky-500/80 dark:bg-sky-400/80', text: `${lightText} ${darkText}` };
    return { dot: 'bg-gray-500', text: 'text-gray-800/70 dark:text-gray-400' };
};

const getFastBreakingTimeDetails = (day: CalendarDay): string | null => {
  const description = day.fasting_info.description.toLowerCase();
  if (description.includes("ekadasi fasting")) {
    return "Parana (break fast) window will be on the next day.";
  }
  return null; 
};

// Use the function to display additional information if available
const getAdditionalFastingInfo = (day: CalendarDay): string | null => {
  return getFastBreakingTimeDetails(day);
};

const generateCalendarLinks = (day: CalendarDay | null, prevDay?: CalendarDay, nextDay?: CalendarDay) => {
  if (!day) return { google: '#', apple: '#' };

  const title = day.fasting_info.is_fasting_day 
    ? day.fasting_info.description 
    : day.raw_events.map(e => e.text).join(', ');

  if (!title) return { google: '#', apple: '#' };

  const description = `Events for ${formatDateDisplay(day.date_str)}:\n\n` +
    day.raw_events.map(e => `- ${e.text}`).join('\n') +
    `\n\nAstro Details: ${day.astro_details.tithi_name}, ${day.astro_details.masa_name} Masa.`;
  
  const location = 'ISKCON Pondicherry';

  let startTimeISO: string | null = null;
  let endTimeISO: string | null = null;
  let startTimeForICS: string | null = null;
  let endTimeForICS: string | null = null;
  let isAllDay = true;

  const fastingWindow = /ekadasi/i.test(day.fasting_info.description) 
    ? getFastingWindow(prevDay, day, nextDay) 
    : null;

  if (fastingWindow) {
    startTimeISO = fastingWindow.start.toISOString().replace(/[:-]|\.\d{3}/g, '');
    endTimeISO = fastingWindow.end.toISOString().replace(/[:-]|\.\d{3}/g, '');
    startTimeForICS = startTimeISO.substring(0, 15) + 'Z';
    endTimeForICS = endTimeISO.substring(0, 15) + 'Z';
    isAllDay = false;
  } else {
    const date = day.date_str.replace(/-/g, '');
    startTimeISO = date;
    const nextDate = new Date(day.date_str);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = getLocalDateStringYYYYMMDD(nextDate).replace(/-/g, '');
    endTimeISO = nextDateStr;
    startTimeForICS = date;
    endTimeForICS = nextDateStr;
  }

  // Google Calendar Link
  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startTimeISO}/${endTimeISO}`,
    details: description,
    location: location,
    ctz: 'Asia/Kolkata'
  });
  const googleLink = `https://www.google.com/calendar/render?${googleParams.toString()}`;

  // Apple Calendar Link (.ics file)
  const icsStartTime = isAllDay ? `DTSTART;VALUE=DATE:${startTimeForICS}` : `DTSTART:${startTimeForICS}`;
  const icsEndTime = isAllDay ? `DTEND;VALUE=DATE:${endTimeForICS}` : `DTEND:${endTimeForICS}`;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    icsStartTime,
    icsEndTime,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const appleLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  return { google: googleLink, apple: appleLink };
};

/**
 * Helper to parse time string (HH:MM or HH:MM:SS) into a Date object for a given date string (YYYY-MM-DD)
 */
const parseTimeOnDate = (dateStr: string, timeStr: string): Date | null => {
  if (!dateStr || !timeStr || timeStr === 'N/A') return null;
  const match = timeStr.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const [_, h, m, s] = match;
  return new Date(`${dateStr}T${h}:${m}:${s || '00'}`);
};

/**
 * Finds the fasting window (start and end Date) for a given day and next day.
 * - Start: Ekadasi Tithi start from prevDay or sunrise on this day
 * - End: parana window end on next day, else Dvadasi Tithi start, else tithi_end_time
 */
const getFastingWindow = (prevDay: CalendarDay | undefined, day: CalendarDay, nextDay?: CalendarDay): { start: Date, end: Date } | null => {
  // Start: Ekadasi Tithi start from prevDay
  let start: Date | null = null;
  if (prevDay?.core_events_detailed) {
    const ekadasiStartEvent = prevDay.core_events_detailed.find(e => e.type_name === 'Ekadasi Tithi');
    if (ekadasiStartEvent && ekadasiStartEvent.time !== 'N/A') {
      // If Ekadasi starts on prevDay but spans to 'day'
      const parsedStartTime = parseTimeOnDate(prevDay.date_str, ekadasiStartEvent.time);
      const currentDaySunrise = parseTimeOnDate(day.date_str, day.astro_details?.sunrise_time || '00:00:00');
      if (parsedStartTime && currentDaySunrise && parsedStartTime < currentDaySunrise) {
         //This means Ekadasi tithi began on prevDay and continues into 'day' before sunrise of 'day'
         // For simplicity in panel, if Ekadasi tithi is active at sunrise of 'day', we consider fast from sunrise of 'day'
         // More precise would be to check if Ekadasi tithi is active at sunrise of 'day'
      }
    }
  }
  // Fallback or primary start: sunrise on the fasting day ('day')
  if (!start) {
    start = parseTimeOnDate(day.date_str, day.astro_details?.sunrise_time || '06:00:00');
  }

  let end: Date | null = null;
  // 1. Try ekadasi_parana_details on next day (parse end time of parana window)
  if (nextDay?.ekadasi_parana_details) {
    const match = nextDay.ekadasi_parana_details.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (match && match[2]) {
      end = parseTimeOnDate(nextDay.date_str, match[2] + ':00');
    }
  }
  // 2. Else, try Dvadasi Tithi event end time (effectively start of Dvadasi) on nextDay or day
  if (!end) {
    const dvadasiEvent = (nextDay?.core_events_detailed || day.core_events_detailed || []).find(
      e => e.type_name === 'Dvadasi Tithi' && e.time !== 'N/A'
    );
    if (dvadasiEvent) {
      // If Dvadasi tithi starts on 'day', use 'day.date_str'. If on 'nextDay', use 'nextDay.date_str'.
      const dateStringToUse = (nextDay?.core_events_detailed?.includes(dvadasiEvent)) ? nextDay.date_str : day.date_str;
      end = parseTimeOnDate(dateStringToUse, dvadasiEvent.time);
    }
  }
  // 3. Fallback to sunrise on nextDay if parana details are missing but it's an Ekadasi
  // This is a general fallback if other specific end times aren't found.
  if (!end && nextDay && /ekadasi/i.test(day.fasting_info.description)) {
      end = parseTimeOnDate(nextDay.date_str, nextDay.astro_details?.sunrise_time || '06:00:00');
  }
  
  // If no end could be determined (e.g. last day of data, no next day info), this might return null
  if (!start || !end) return null;
  // Ensure end is after start
  if (end <= start) {
      // If end is not after start (e.g. Dvadasi tithi ended very early or data issue),
      // provide a sensible default like end of day for 'day' or sunrise of 'nextDay'
      // For simplicity, let's try next day's sunrise as a last resort if nextDay exists
      if (nextDay) {
          const nextDaySunrise = parseTimeOnDate(nextDay.date_str, nextDay.astro_details?.sunrise_time || '06:00:00');
          if (nextDaySunrise && nextDaySunrise > start) {
              end = nextDaySunrise;
          } else {
              // If still no valid end, make it 24 hours from start (very rough fallback)
              end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
          }
      } else {
          // No next day, make it 24 hours from start
         end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      }
  }

  return { start, end };
};

const getFastingProgress = (window: { start: Date, end: Date }): { progress: number, status: string, timeLeft: number, timeLeftFormatted: string } => {
  const now = new Date();
  if (now < window.start) {
    const timeLeftMinutes = Math.round((window.start.getTime() - now.getTime()) / 60000);
    const hours = Math.floor(timeLeftMinutes / 60);
    const minutes = timeLeftMinutes % 60;
    const formatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return { progress: 0, status: 'Fasting not started', timeLeft: timeLeftMinutes, timeLeftFormatted: `Starts in: ${formatted}` };
  }
  if (now > window.end) {
    return { progress: 1, status: 'Fasting completed', timeLeft: 0, timeLeftFormatted: '' };
  }
  const progress = (now.getTime() - window.start.getTime()) / (window.end.getTime() - window.start.getTime());
  const timeLeftMinutes = Math.max(0, Math.round((window.end.getTime() - now.getTime()) / 60000));
  const hours = Math.floor(timeLeftMinutes / 60);
  const minutes = timeLeftMinutes % 60;
  const formatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  return { progress, status: 'Fasting in progress', timeLeft: timeLeftMinutes, timeLeftFormatted: `Time remaining: ${formatted}` };
};

// Main Panel Component
export const TempleEventsPanel = memo(({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState(new Date().getDate())
  const [activeMonthDate, setActiveMonthDate] = useState(new Date())
  const [monthCalendarData, setMonthCalendarData] = useState<CalendarDay[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [displayQuote, setDisplayQuote] = useState(getRandomQuote());
  const [selectedDayForPopover, setSelectedDayForPopover] = useState<CalendarDay | null>(null);
  const [todayCalendarData, setTodayCalendarData] = useState<CalendarDay | null>(null); // For today's fasting bar
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const navigate = useNavigate({ from: '/' });
  const isMobile = useMediaQuery('(max-width: 767px)');

  const calendarLinks = useMemo(() => {
    if (!selectedDayForPopover) return { google: '#', apple: '#' };
    
    const dayIndex = monthCalendarData.findIndex(d => d.date_str === selectedDayForPopover.date_str);
    if (dayIndex === -1) return { google: '#', apple: '#' };

    const prevDay = dayIndex > 0 ? monthCalendarData[dayIndex - 1] : undefined;
    const nextDay = dayIndex < monthCalendarData.length - 1 ? monthCalendarData[dayIndex + 1] : undefined;

    return generateCalendarLinks(selectedDayForPopover, prevDay, nextDay);
  }, [selectedDayForPopover, monthCalendarData]);

  const { data: schedule } = useQuery({
    queryKey: ['templeSchedule'],
    queryFn: async () => dailySchedule,
    staleTime: Infinity
  });

  useEffect(() => {
    const fetchMonthData = async () => {
      setCalendarLoading(true);
      setDisplayQuote(getRandomQuote());
      setCalendarError(null);
      const year = activeMonthDate.getFullYear();
      const month = activeMonthDate.getMonth() + 1;
      try {
        const response = await fetch(`/api/calendar?location_city=Pondicherry&year=${year}&month=${month}`);
        if (!response.ok) throw new Error(`Failed to fetch temple calendar: ${response.statusText}`);
        const result: CalendarResponse = await response.json();
        const data = result.data || [];
        setMonthCalendarData(data);

        // Determine today's data for the header fasting progress bar
        const todayStr = getLocalDateStringYYYYMMDD(new Date());
        const currentMonthTodayData = data.find(d => d.date_str === todayStr);
        
        if (activeMonthDate.getFullYear() === new Date().getFullYear() && activeMonthDate.getMonth() === new Date().getMonth()) {
          // If viewing the current month, set todayCalendarData if found
          setTodayCalendarData(currentMonthTodayData || null);
        } else {
          // If viewing a different month, there's no "today" in this view for the header bar
          setTodayCalendarData(null);
        }
        
      } catch (err) {
        setCalendarError("We couldn't retrieve the calendar at this moment. Please try again later.");
        setMonthCalendarData([]);
        setTodayCalendarData(null);
      } finally {
        setCalendarLoading(false);
      }
    };
    fetchMonthData();
  }, [activeMonthDate]);

  // Effect to set initial selectedDayForPopover to today's data if available when component mounts or month data changes
   useEffect(() => {
    if (monthCalendarData.length > 0 && !selectedDayForPopover) {
      const todayStr = getLocalDateStringYYYYMMDD(new Date());
      const initialTodayData = monthCalendarData.find(d => d.date_str === todayStr);
      if (initialTodayData) {
        setSelectedDayForPopover(initialTodayData);
        // setSelectedDayOfMonth(new Date().getDate()); // Ensure visual selection in grid
      } else if (monthCalendarData.length > 0 && activeMonthDate.getMonth() === new Date(monthCalendarData[0].date_str).getMonth()) {
        // If today's data isn't in the current month view (or not found),
        // and we are in the month of the first available data point, select the first day of that month.
        // This handles cases where the component might load on a day not covered by the initial fetch for the *current system month*
        // but the fetched month (activeMonthDate) has data.
        // setSelectedDayForPopover(monthCalendarData[0]);
        // setSelectedDayOfMonth(parseInt(monthCalendarData[0].date_str.split('-')[2], 10));
      }
    }
  }, [monthCalendarData, selectedDayForPopover, activeMonthDate]);


  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonthName = activeMonthDate.toLocaleString('default', { month: 'long' });
  const currentYear = activeMonthDate.getFullYear();
  const daysInMonthCount = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonthWeekday = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), 1).getDay();

  const handleDayClick = (dayNumber: number) => {
    const clickedDate = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), dayNumber);
    const dateStr = getLocalDateStringYYYYMMDD(clickedDate);
    const dayData = monthCalendarData.find(d => d.date_str === dateStr);
    
    setSelectedDayOfMonth(dayNumber);

    if (dayData) {
      if (selectedDayForPopover?.date_str === dateStr) {
        setSelectedDayForPopover(null); // Toggle off if same day is clicked
      } else {
        setSelectedDayForPopover(dayData);
      }
    } else {
      setSelectedDayForPopover(null);
    }
  };
  
  const handleNavigate = () => {
    onOpenChange(false);
    navigate({ to: '/calender' });
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-[420px] max-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-slate-100 dark:bg-gradient-to-br dark:from-indigo-950/50 dark:via-black dark:to-purple-950/50">
      {/* Header */}
      <div className="p-3 border-b dark:border-zinc-800 border-gray-200 flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full shadow-md">
              <div className={cn("rounded-full p-1", "bg-white dark:bg-zinc-800")}>
                <Calendar className="h-4 w-4 text-[#e94a9c]" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Temple Events & Schedule
            </h2>
          </div>
          {/* Astro Events Popover Trigger - Styled as Pill Button */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <FlipButton
                  frontContent={
                    <div className="flex items-center justify-center gap-1.5">
                      <GitCompareArrows className="h-3.5 w-3.5" />
                      Astro Timeline
                    </div>
                  }
                  backContent={<span className="text-xs font-bold">View Details</span>}
                  className="h-8 px-16 py-1.5 text-xs rounded-full shadow-md select-none"
                  frontClassName="bg-gradient-to-r from-sky-500 to-blue-500 text-white"
                  backClassName="bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                  from="top"
                />
              </motion.div>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-96 p-0 z-50">
              <div className={cn("p-2 border-b", "border-gray-200 dark:border-zinc-700")}>
                <h4 className="font-semibold text-sm">
                  Astro Events for {selectedDayForPopover ? formatDateDisplay(selectedDayForPopover.date_str, {month: 'short', day: 'numeric'}) : "Selected Day"}
                </h4>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto space-y-2 text-sm styled-scrollbar">
                {selectedDayForPopover && selectedDayForPopover.core_events_detailed && selectedDayForPopover.core_events_detailed.length > 0 ? (
                  selectedDayForPopover.core_events_detailed.map((coreEvent, idx) => (
                    <motion.div
                      key={`core-evt-header-${idx}`} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0"/>
                      <span className="font-medium w-20 text-sm tabular-nums">{coreEvent.time}</span> {/* Ensure full time is shown */}
                      <Badge variant="outline" className={cn("text-sm ml-2 px-2 py-1 leading-tight", "border-blue-300/70 bg-blue-100/60 text-blue-700 dark:border-blue-700/60 dark:bg-blue-900/40 dark:text-blue-300")}>
                        {coreEvent.type_name} {coreEvent.dst_applied ? '(DST)' : ''}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center text-sm px-3 py-4">The Lord's energies are ever-present, though specific timings may not be detailed for today. Chant Hare Krishna and be happy!</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Fasting Progress Bar in Header for TODAY'S FAST */}
        {todayCalendarData && todayCalendarData.fasting_info.is_fasting_day && /ekadasi/i.test(todayCalendarData.fasting_info.description) && (
          (() => {
            // Find prev/next day for todayCalendarData from the full monthCalendarData
            const todayActualDateStr = todayCalendarData.date_str;
            const todayIndexInMonth = monthCalendarData.findIndex(d => d.date_str === todayActualDateStr);
            
            const prevDayOfToday = todayIndexInMonth > 0 ? monthCalendarData[todayIndexInMonth - 1] : undefined;
            const nextDayOfToday = todayIndexInMonth >= 0 && todayIndexInMonth < monthCalendarData.length - 1 ? monthCalendarData[todayIndexInMonth + 1] : undefined;
            
            const window = getFastingWindow(prevDayOfToday, todayCalendarData, nextDayOfToday);
            if (!window) return null;
            const { progress, status, timeLeftFormatted } = getFastingProgress(window);
            return (
              <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-pink-50/30 to-purple-50/30 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200/50 dark:border-pink-800/30">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("px-2.5 py-1 text-xs font-medium", "border-pink-300 text-pink-700 dark:border-pink-700 dark:text-pink-300")}>
                      Start: {window.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                    <Badge variant="outline" className={cn("px-2.5 py-1 text-xs font-medium", "border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300")}>
                      End: {window.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                  <Badge
                    variant={status === 'Fasting completed' ? 'default' : (status === 'Fasting in progress' ? 'secondary' : 'outline')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium",
                      status === 'Fasting completed' ? 'bg-green-500/20 text-green-700 dark:bg-green-800/30 dark:text-green-300' :
                      (status === 'Fasting in progress' ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300' :
                      'bg-orange-500/20 text-orange-700 dark:bg-orange-800/30 dark:text-orange-300')
                    )}
                  >
                    {status}
                  </Badge>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative h-2 mt-1 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden shadow-sm"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500"
                    animate={status === 'Fasting in progress' ? {
                      backgroundPosition: ['0% center', '100% center', '0% center'],
                    } : {}}
                    transition={status === 'Fasting in progress' ? {
                      duration: 5,
                      ease: "linear",
                      repeat: Infinity,
                    } : {}}
                    style={{
                      backgroundSize: '200% auto',
                    }}
                  />
                </motion.div>
                {(status === 'Fasting in progress' || status === 'Fasting not started') && (
                  <div className="text-xs text-center mt-1.5 text-muted-foreground font-medium">
                    {timeLeftFormatted}
                  </div>
                )}
                <div className="text-xs text-center mt-1 text-muted-foreground italic">
                  {status === 'Fasting in progress' && '"Fasting is a shield; it will protect you from the fire of hell." - Srila Prabhupada'}
                  {status === 'Fasting not started' && '"Prepare your mind for fasting, for it purifies the body and soul." - Srila Prabhupada'}
                  {status === 'Fasting completed' && '"By fasting, you have pleased the Lord; now relish His mercy." - Srila Prabhupada'}
                </div>
              </div>
            );
          })()
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-4 styled-scrollbar">
        {/* Calendar Section */}
        <div className={cn("p-3 rounded-lg shadow-inner space-y-3", "bg-slate-100/50 dark:bg-zinc-800/50")}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-sky-600 dark:text-sky-400">{currentMonthName} {currentYear}</h3>
            <div className="flex gap-1">
              <FlipButton
                frontContent="←"
                backContent="Prev"
                onClick={() => setActiveMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="h-6 w-6 text-xs"
                frontClassName="bg-outline text-foreground"
                backClassName="bg-primary text-primary-foreground"
                from="left"
              />
              <FlipButton
                frontContent="→"
                backContent="Next"
                onClick={() => setActiveMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="h-6 w-6 text-xs"
                frontClassName="bg-outline text-foreground"
                backClassName="bg-primary text-primary-foreground"
                from="right"
              />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-sm font-medium text-center text-muted-foreground">
            {daysOfWeek.map(day => <div key={day} className="py-2">{day.substring(0,2)}</div>)}
          </div>
          {calendarLoading && (
            <div className="flex flex-col justify-center items-center h-20 space-y-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-white"/>
              <ShimmerText 
                text={displayQuote} 
                className="text-xs text-center text-white bg-[linear-gradient(110deg,theme(colors.slate.50),45%,theme(colors.white),55%,theme(colors.slate.50))] dark:bg-[linear-gradient(110deg,theme(colors.slate.400),45%,theme(colors.slate.200),55%,theme(colors.slate.400))]"
              />
            </div>
          )}
          {calendarError && (
            <div className="text-white text-sm p-4 text-center rounded-md bg-gradient-to-r from-red-500 to-orange-500">
              <p className="font-semibold mb-2">🦚 The Lord's plans are mysterious.</p>
              <ShimmerText 
                text={displayQuote} 
                className="text-xs bg-[linear-gradient(110deg,theme(colors.slate.50),45%,theme(colors.white),55%,theme(colors.slate.50))] dark:bg-[linear-gradient(110deg,theme(colors.slate.400),45%,theme(colors.slate.200),55%,theme(colors.slate.400))]" 
              />
            </div>
          )}
          {!calendarLoading && !calendarError && (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonthWeekday }).map((_, i) => <div key={`empty-panel-${i}`} />)}
              {Array.from({ length: daysInMonthCount }).map((_, index) => {
                const dayNumber = index + 1;
                const currentDateObj = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), dayNumber);
                const dateStr = getLocalDateStringYYYYMMDD(currentDateObj);
                const dayData = monthCalendarData.find(d => d.date_str === dateStr);
                const hasEventsOrFasting = dayData && (dayData.events.length > 0 || dayData.raw_events.length > 0 || dayData.fasting_info.is_fasting_day || dayData.ekadasi_parana_details);
                return (
                  <motion.button
                    key={`panel-${dateStr}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                    onClick={() => handleDayClick(dayNumber)}
                    className={cn(
                      "h-8 text-sm rounded flex items-center justify-center relative transition-all duration-150 ease-out select-none",
                      selectedDayOfMonth === dayNumber
                        ? dayData?.fasting_info.is_fasting_day
                          ? "bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white font-semibold shadow-md"
                          : "bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 text-white font-semibold shadow-md"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700/60 dark:hover:bg-zinc-600/80",
                      dayData?.fasting_info.is_fasting_day && selectedDayOfMonth !== dayNumber && "ring-1 ring-pink-400/70 dark:ring-pink-600/70",
                      new Date().getFullYear() === activeMonthDate.getFullYear() && new Date().getMonth() === activeMonthDate.getMonth() && dayNumber === new Date().getDate() && selectedDayOfMonth !== dayNumber && "font-bold bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm"
                    )}
                  >
                    {dayNumber}
                    {hasEventsOrFasting && (
                      <span className={cn("absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full", dayData?.fasting_info.is_fasting_day ? "bg-pink-500" : "bg-sky-500")}/>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
          <AnimatePresence mode="wait">
            {selectedDayForPopover && (
              <motion.div
                key={selectedDayForPopover.date_str}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={cn(
                  "mt-2 rounded-lg border p-3 relative overflow-hidden",
                  selectedDayForPopover.fasting_info.is_fasting_day
                    ? "bg-rose-50 border-rose-200 dark:bg-zinc-900 dark:border-rose-700/50"
                    : "bg-sky-50 border-sky-200 dark:bg-zinc-900 dark:border-sky-700/50"
                )}
              >
                <div className={cn(
                  "p-2 border-b flex justify-between items-start", 
                  selectedDayForPopover.fasting_info.is_fasting_day 
                    ? "border-rose-200/30 dark:border-rose-700/40" 
                    : "border-sky-200/30 dark:border-sky-700/40"
                )}>
                  <div>
                    <h4 className={cn(
                      "font-semibold text-sm",
                      selectedDayForPopover.fasting_info.is_fasting_day ? "text-rose-900 dark:text-rose-200" : "text-sky-900 dark:text-sky-200"
                    )}>
                      {formatDateDisplay(selectedDayForPopover.date_str)}
                    </h4>
                    <p className={cn(
                      "text-xs",
                      selectedDayForPopover.fasting_info.is_fasting_day ? "text-rose-700/90 dark:text-rose-300/80" : "text-sky-700/90 dark:text-sky-300/80"
                    )}>
                      {selectedDayForPopover.astro_details.tithi_name}, {selectedDayForPopover.astro_details.masa_name} Masa
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant="outline" className="cursor-pointer bg-amber-100/80 dark:bg-amber-900/50 border-amber-300/70 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 font-semibold px-3 py-1 text-xs flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Remind Me
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <a href={calendarLinks.google} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        <IconBrandGoogle className="h-4 w-4 text-[#4285F4]" />
                      </a>
                      <a href={calendarLinks.apple} download={`${selectedDayForPopover?.date_str}-event.ics`} className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        <IconBrandApple className="h-4 w-4 text-black dark:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto space-y-3 text-sm styled-scrollbar">
                  {selectedDayForPopover.fasting_info.is_fasting_day && (
                    <Alert variant="default" className="p-2 text-sm bg-rose-100/50 border-rose-200/50 text-rose-900 dark:bg-rose-900/40 dark:border-rose-700/30 dark:text-rose-300"><Sparkles className="h-4 w-4 text-rose-600 dark:text-rose-400" /><AlertTitle className="font-semibold text-sm">{selectedDayForPopover.fasting_info.description}</AlertTitle></Alert>
                  )}
                  {selectedDayForPopover.ekadasi_parana_details && (
                    <Alert variant="default" className="p-2 text-sm mt-2 bg-green-100/50 border-green-200/50 text-green-900 dark:bg-green-900/40 dark:border-green-700/30 dark:text-green-300"><ListChecks className="h-4 w-4 text-green-600 dark:text-green-300" /><AlertTitle className="font-semibold text-sm">Ekadasi Parana</AlertTitle><AlertDescription className="text-sm text-green-800/90 dark:text-green-300/90">{selectedDayForPopover.ekadasi_parana_details}</AlertDescription></Alert>
                  )}
                  {getAdditionalFastingInfo(selectedDayForPopover) && !selectedDayForPopover.ekadasi_parana_details && (
                    <Alert variant="default" className="p-2 text-sm mt-2 bg-green-100/50 border-green-200/50 text-green-900 dark:bg-green-900/40 dark:border-green-700/30 dark:text-green-300"><ListChecks className="h-4 w-4 text-green-600 dark:text-green-300" /><AlertTitle className="font-semibold text-sm">Fasting Info</AlertTitle><AlertDescription className="text-sm text-green-800/90 dark:text-green-300/90">{getAdditionalFastingInfo(selectedDayForPopover)}</AlertDescription></Alert>
                  )}
                  {(selectedDayForPopover.raw_events && selectedDayForPopover.raw_events.length > 0) ? (
                    <div className="space-y-2 pt-1">
                      <h5 className={cn("text-sm font-medium", selectedDayForPopover.fasting_info.is_fasting_day ? "text-rose-800 dark:text-rose-300" : "text-sky-800 dark:text-sky-300")}>Events:</h5>
                      {selectedDayForPopover.raw_events.map((event, idx) => (
                        <div key={`dre-panel-${idx}`} className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full flex-shrink-0", getEventStyle(event, selectedDayForPopover.fasting_info.is_fasting_day).dot)}></div>
                          <span className={cn("font-medium text-sm", getEventStyle(event, selectedDayForPopover.fasting_info.is_fasting_day).text)}>
                            {event.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : !selectedDayForPopover.fasting_info.is_fasting_day && !selectedDayForPopover.ekadasi_parana_details && (
                    <p className="text-gray-700 dark:text-gray-300 text-center py-2 text-sm">A day for serene contemplation and chanting. Hare Krishna!</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Daily Schedule Section */}
        <div className={cn("p-3 rounded-lg shadow-inner space-y-3", "bg-slate-100/50 dark:bg-zinc-800/50")}>
          <h3 className="text-sm font-semibold text-[#ffc547] dark:text-[#ffc547]">Daily Activities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1.5 styled-scrollbar-thin">
            {schedule?.map((item) => {
              const isExpanded = expandedActivity === item.time;
              return (
                <motion.div
                  key={`panel-${item.time}`}
                  layout
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => setExpandedActivity(isExpanded ? null : item.time)}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200 bg-gradient-to-br cursor-pointer overflow-hidden flex flex-col justify-center items-center",
                    "hover:shadow-lg dark:hover:shadow-lg",
                    item.time.includes('4:30 AM') ? "from-purple-50 to-indigo-100 border-purple-200 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700/50" : '',
                    item.time.includes('7:15 AM') || item.time.includes('7:20 AM') ? "from-orange-50 to-amber-100 border-orange-200 dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-700/50" : '',
                    item.time.includes('8:00 AM') ? "from-amber-50 to-yellow-100 border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-700/50" : '',
                    item.time.includes('12:00 PM') ? "from-yellow-50 to-lime-100 border-yellow-200 dark:from-yellow-900/20 dark:to-lime-900/20 dark:border-yellow-700/50" : '',
                    item.time.includes('5:30 PM') ? "from-pink-50 to-rose-100 border-pink-200 dark:from-pink-900/20 dark:to-rose-900/20 dark:border-pink-700/50" : '',
                    item.time.includes('6:30 PM') ? "from-indigo-50 to-violet-100 border-indigo-200 dark:from-indigo-900/20 dark:to-violet-900/20 dark:border-indigo-700/50" : ''
                  )}
                >
                  <motion.div layout="position" className="text-center">
                    <div className={cn(
                      "flex items-center justify-center gap-1.5",
                      item.time.includes('4:30 AM') ? "text-purple-800 dark:text-purple-300" : '',
                      item.time.includes('7:15 AM') || item.time.includes('7:20 AM') ? "text-orange-800 dark:text-orange-300" : '',
                      item.time.includes('8:00 AM') ? "text-amber-800 dark:text-amber-300" : '',
                      item.time.includes('12:00 PM') ? "text-lime-800 dark:text-lime-300" : '',
                      item.time.includes('5:30 PM') ? "text-pink-800 dark:text-pink-300" : '',
                      item.time.includes('6:30 PM') ? "text-indigo-800 dark:text-indigo-300" : ''
                    )}>
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-base font-bold tabular-nums">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate">{item.activity}</h4>
                  </motion.div>
                  <AnimatePresence>
                    {isExpanded && item.description && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '8px' }}
                        exit={{ opacity: 0, height: 0, marginTop: '0px' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <p className="text-xs text-center text-gray-600 dark:text-gray-400">{item.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 p-2 border-t border-border/50">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
          onClick={handleNavigate}
        >
          <FlipButton
            frontContent={
              <div className="flex items-center justify-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                View Full Vaishnava Calendar
              </div>
            }
            backContent={<span className="text-xs font-bold">Open Calendar</span>}
            className="w-full px-4 text-xs h-8 rounded-full font-semibold shadow-md select-none"
            frontClassName="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            backClassName="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            from="bottom"
          />
        </motion.div>
      </div>
    </div>
  );
});
TempleEventsPanel.displayName = 'TempleEventsPanel';


// Wrapper Component for Modal/Drawer
export function TempleEvents({ open, onOpenChange }: TempleEventsProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <>
      {isMobile ? (
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed bottom-0 left-0 w-full h-[90vh] flex flex-col bg-gray-50 dark:bg-black z-50 pointer-events-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full shadow-md">
                    <div className={cn("rounded-full p-1", "bg-white dark:bg-zinc-800")}>
                      <Calendar className="h-4 w-4 text-[#e94a9c]" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Temple Events & Schedule
                  </h2>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-1.5 hover:bg-gray-200/70 dark:hover:bg-zinc-700/70 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <TempleEventsPanel onOpenChange={onOpenChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 flex items-start justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto z-[100] pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                <motion.div
                  className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
                  onClick={() => onOpenChange(false)}
                />
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                  "relative z-50 w-full max-w-4xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border",
                  "bg-white/90 border-gray-200/70 dark:bg-zinc-900/90 dark:border-zinc-700/80",
                  "backdrop-blur-xl"
                )}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full shadow-md">
                      <div className={cn("rounded-full p-1.5", "bg-white dark:bg-zinc-800")}>
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#e94a9c]" />
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text">
                      Temple Events & Schedule
                    </h2>
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="rounded-full p-1.5 sm:p-2 hover:bg-gray-200/70 dark:hover:bg-zinc-700/70 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="overflow-y-auto">
                    <TempleEventsPanel onOpenChange={onOpenChange} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}
