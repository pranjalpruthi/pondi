import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { Calendar, Clock, X, ExternalLink, Loader2, ListChecks, Tags, Sparkles } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button" // For link styling
import { useTheme } from "@/components/theme-provider"

// Assuming types are similar to VaishnavCalendar and can be imported or defined
// For simplicity, defining crucial ones here. Ideally, import from a shared types file.
interface AstroDetailInfo {
  tithi_name: string;
  masa_name: string;
  // Add other relevant fields if needed for popover
}
interface FastingInfo {
  is_fasting_day: boolean;
  description: string;
  subject?: string;
}
interface RawEvent {
  text: string;
  prio: number; // Used by getEventStyle
  dispItem: number; // Used by getEventStyle
  fasttype: number; // Used by getEventStyle
  fastsubject?: string; // Used by getEventStyle
}
interface CalendarDay {
  date_str: string; // "YYYY-MM-DD"
  astro_details: AstroDetailInfo;
  fasting_info: FastingInfo;
  events: string[];
  raw_events: RawEvent[];
  ekadasi_parana_details: string | null;
}
interface CalendarResponse {
  data: CalendarDay[];
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

const dailySchedule: DailySchedule[] = [
  { time: '4:30 AM', activity: 'Mangal Aarati', description: 'Early morning worship' },
  { time: '7:15 AM', activity: 'Darshan Aarati', description: 'Morning darshan ceremony' },
  { time: '7:20 AM', activity: 'Guru Puja', description: 'Worship of Srila Prabhupada' },
  { time: '8:00 AM', activity: 'Bhagvatam Discourse', description: 'Morning scripture class' },
  { time: '12:00 PM', activity: 'Temple Closes', description: 'Afternoon closing' },
  { time: '5:30 PM', activity: 'Gaura Arati', description: 'Evening worship ceremony' },
  { time: '6:30 PM', activity: 'Temple Closes', description: 'Final closing (may vary based on circumstances)' }
]


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
    // Add more conditions as needed or a default
    return { dot: 'bg-gray-400', text: 'text-gray-500 dark:text-gray-400' };
};

const getFastBreakingTimeDetails = (day: CalendarDay): string | null => {
  const description = day.fasting_info.description.toLowerCase();
  // Simplified version for popover, assuming astro_details might not be fully populated or needed here
  if (description.includes("ekadasi fasting")) {
    return "Parana (break fast) window will be on the next day.";
  }
  // Add other conditions if needed, e.g., fast till noon/sunset/moonrise
  // For this component, we might not have detailed astro_details.noon_time etc.
  // So, keeping it simple.
  return null; 
};


export function TempleEvents({ open, onOpenChange }: TempleEventsProps) {
  const { theme } = useTheme();
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState(new Date().getDate())
  const [activeMonthDate, setActiveMonthDate] = useState(new Date())

  const [monthCalendarData, setMonthCalendarData] = useState<CalendarDay[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  
  const [selectedDayForPopover, setSelectedDayForPopover] = useState<CalendarDay | null>(null);
  // Use a map to manage popover states for each day to avoid issues with a single state
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<string, boolean>>({});


  // Fetch daily schedule (existing logic)
  const { data: schedule } = useQuery({
    queryKey: ['templeSchedule'],
    queryFn: async () => dailySchedule,
    staleTime: Infinity
  })

  // Fetch monthly calendar data for Pondicherry
  useEffect(() => {
    const fetchMonthData = async () => {
      setCalendarLoading(true);
      setCalendarError(null);
      const year = activeMonthDate.getFullYear();
      const month = activeMonthDate.getMonth() + 1; // API expects 1-indexed month
      try {
        const response = await fetch(`/api/calendar?location_city=Pondicherry&year=${year}&month=${month}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch temple calendar: ${response.statusText}`);
        }
        const result: CalendarResponse = await response.json();
        setMonthCalendarData(result.data || []);
      } catch (err) {
        setCalendarError(err instanceof Error ? err.message : "Unknown error fetching calendar data");
        setMonthCalendarData([]);
      } finally {
        setCalendarLoading(false);
      }
    };
    fetchMonthData();
  }, [activeMonthDate]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonthName = activeMonthDate.toLocaleString('default', { month: 'long' })
  const currentYear = activeMonthDate.getFullYear()

  const getDaysInMonthCount = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }
  const daysInMonthCount = getDaysInMonthCount(activeMonthDate)
  const firstDayOfMonthWeekday = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), 1).getDay();


  const handleDayClick = (dayNumber: number) => {
    setSelectedDayOfMonth(dayNumber);
    const clickedDate = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), dayNumber);
    const dateStr = getLocalDateStringYYYYMMDD(clickedDate);
    const dayData = monthCalendarData.find(d => d.date_str === dateStr);
    if (dayData) {
      setSelectedDayForPopover(dayData);
      setPopoverOpenStates(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
    } else {
      setSelectedDayForPopover(null); // No specific data, clear popover
      setPopoverOpenStates(prev => ({ ...prev, [dateStr]: false })); // Ensure it's closed
    }
  };
  
  const handlePopoverOpenChange = (dateStr: string, isOpen: boolean) => {
    setPopoverOpenStates(prev => ({ ...prev, [dateStr]: isOpen }));
    if (!isOpen && selectedDayForPopover?.date_str === dateStr) {
      // If closing the popover for the currently selected day, clear it
      // This helps if the popover is closed by clicking outside
      setSelectedDayForPopover(null);
    }
  };


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto z-[100] pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "relative z-50 w-full max-w-4xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl min-h-[60vh] sm:min-h-0 border",
              theme === 'dark' ? 'bg-zinc-900/80 border-zinc-700/70' : 'bg-white/80 border-gray-200/70',
              "backdrop-blur-xl" 
            )}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full shadow-md">
                  <div className={cn("rounded-full p-1.5", theme === 'dark' ? 'bg-zinc-800' : 'bg-white')}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Calendar Section */}
              <div className={cn(theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-100/50', 'p-3 rounded-lg shadow-inner space-y-4 md:space-y-5')}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-sky-600 dark:text-sky-400">{currentMonthName} {currentYear}</h3>
                  <div className="flex gap-1 sm:gap-2">
                    <Button variant="outline" size="icon" onClick={() => setActiveMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="h-8 w-8 sm:h-9 sm:w-9">←</Button>
                    <Button variant="outline" size="icon" onClick={() => setActiveMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="h-8 w-8 sm:h-9 sm:w-9">→</Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm font-medium text-center text-muted-foreground">
                  {daysOfWeek.map(day => <div key={day} className="py-1.5">{day.substring(0,3)}</div>)}
                </div>

                {calendarLoading && <div className="flex justify-center items-center h-32"><Loader2 className="h-6 w-6 animate-spin text-sky-500"/></div>}
                {calendarError && <div className="text-red-500 text-sm p-2 text-center">{calendarError}</div>}
                {!calendarLoading && !calendarError && (
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonthWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonthCount }).map((_, index) => {
                      const dayNumber = index + 1;
                      const currentDateObj = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), dayNumber);
                      const dateStr = getLocalDateStringYYYYMMDD(currentDateObj);
                      const dayData = monthCalendarData.find(d => d.date_str === dateStr);
                      const hasEventsOrFasting = dayData && (dayData.events.length > 0 || dayData.raw_events.length > 0 || dayData.fasting_info.is_fasting_day || dayData.ekadasi_parana_details);
                      
                      return (
                        <Popover key={dateStr} open={popoverOpenStates[dateStr]} onOpenChange={(isOpen) => handlePopoverOpenChange(dateStr, isOpen)}>
                          <PopoverTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDayClick(dayNumber)}
                              className={cn(
                                "h-9 sm:h-10 md:h-11 text-sm rounded-md flex items-center justify-center relative transition-all duration-150 ease-out",
                                selectedDayOfMonth === dayNumber 
                                  ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold shadow-md ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-zinc-800"
                                  : (theme === 'dark' ? "bg-zinc-700/50 hover:bg-zinc-600/70" : "bg-gray-100/70 hover:bg-gray-200/90"),
                                dayData?.fasting_info.is_fasting_day && selectedDayOfMonth !== dayNumber && (theme === 'dark' ? "ring-1 ring-pink-600/70" : "ring-1 ring-pink-400/70"),
                                new Date().getFullYear() === activeMonthDate.getFullYear() && new Date().getMonth() === activeMonthDate.getMonth() && dayNumber === new Date().getDate() && "font-bold ring-2 ring-amber-500"
                              )}
                            >
                              {dayNumber}
                              {hasEventsOrFasting && (
                                <span className={cn(
                                  "absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full",
                                  dayData?.fasting_info.is_fasting_day ? "bg-pink-500" : "bg-sky-500"
                                )}/>
                              )}
                            </motion.button>
                          </PopoverTrigger>
                          {selectedDayForPopover && selectedDayForPopover.date_str === dateStr && (
                            <PopoverContent 
                              side="bottom" 
                              align="center" 
                              className={cn("w-64 md:w-72 p-0 shadow-xl z-[110] rounded-lg border", theme === 'dark' ? 'bg-zinc-800/95 border-zinc-700/80' : 'bg-white/95 border-gray-300/80', "backdrop-blur-md")}
                            >
                              <div className={cn("p-3 border-b", theme === 'dark' ? 'border-zinc-700' : 'border-gray-200')}>
                                <h4 className="font-semibold text-sm">{formatDateDisplay(selectedDayForPopover.date_str)}</h4>
                                <p className="text-xs text-muted-foreground">{selectedDayForPopover.astro_details.tithi_name}, {selectedDayForPopover.astro_details.masa_name} Masa</p>
                              </div>
                              <div className="p-3 max-h-40 overflow-y-auto space-y-2 text-xs styled-scrollbar">
                                {selectedDayForPopover.fasting_info.is_fasting_day && (
                                  <Alert variant="default" className={cn("p-2 text-xs", theme === 'dark' ? 'bg-pink-900/60 border-pink-700/50 text-pink-300' : 'bg-pink-50/80 border-pink-200/70 text-pink-700')}>
                                    <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                                    <AlertTitle className="font-semibold">{selectedDayForPopover.fasting_info.description}</AlertTitle>
                                    {selectedDayForPopover.fasting_info.subject && <AlertDescription className="opacity-80">{selectedDayForPopover.fasting_info.subject}</AlertDescription>}
                                    {getFastBreakingTimeDetails(selectedDayForPopover) && <AlertDescription className="mt-0.5 opacity-90">{getFastBreakingTimeDetails(selectedDayForPopover)}</AlertDescription>}
                                  </Alert>
                                )}
                                {selectedDayForPopover.ekadasi_parana_details && (
                                  <Alert variant="default" className={cn("p-2 text-xs mt-1", theme === 'dark' ? 'bg-green-900/60 border-green-700/50 text-green-300' : 'bg-green-50/80 border-green-200/70 text-green-700')}>
                                    <ListChecks className="h-3.5 w-3.5 text-green-500" />
                                    <AlertTitle className="font-semibold">Ekadasi Parana</AlertTitle>
                                    <AlertDescription>{selectedDayForPopover.ekadasi_parana_details}</AlertDescription>
                                  </Alert>
                                )}
                                {(selectedDayForPopover.events.length > 0 || selectedDayForPopover.raw_events.length > 0) && (
                                  <div className="space-y-1 pt-1">
                                    <h5 className="text-xs font-medium text-muted-foreground">Events:</h5>
                                    {selectedDayForPopover.raw_events.map((event, idx) => (
                                        <div key={`re-${idx}`} className="flex items-start gap-1.5">
                                            <div className={cn("h-1.5 w-1.5 rounded-full mt-1 flex-shrink-0", getEventStyle(event).dot)}></div>
                                            <p className={cn(getEventStyle(event).text)}>{event.text}</p>
                                        </div>
                                    ))}
                                    {selectedDayForPopover.events.filter(e => !selectedDayForPopover.raw_events.some(re => re.text === e)).map((event, idx) => ( // Avoid duplicates if raw_events already cover formatted events
                                        <div key={`e-${idx}`} className="flex items-start gap-1.5">
                                            <Tags className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0"/>
                                            <p className="text-muted-foreground">{event}</p>
                                        </div>
                                    ))}
                                  </div>
                                )}
                                {!selectedDayForPopover.fasting_info.is_fasting_day && !selectedDayForPopover.ekadasi_parana_details && selectedDayForPopover.events.length === 0 && selectedDayForPopover.raw_events.length === 0 && (
                                  <p className="text-muted-foreground text-center py-2">No specific events or observances.</p>
                                )}
                              </div>
                            </PopoverContent>
                          )}
                        </Popover>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Daily Schedule Section (Existing) */}
              <div className={cn(theme === 'dark' ? 'bg-zinc-800/50' : 'bg-slate-100/50', 'p-3 rounded-lg shadow-inner space-y-4 md:space-y-5')}>
                <h3 className="text-lg sm:text-xl font-semibold text-[#ffc547] dark:text-[#ffc547]">Daily Activities</h3>
                <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto pr-2 styled-scrollbar-thin">
                  {schedule?.map((item, index) => (
                    <motion.div
                      key={item.time}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.07, type: 'spring', stiffness: 200, damping: 20 } }}
                      className={cn("flex gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-colors", theme === 'dark' ? 'hover:bg-zinc-700/60' : 'hover:bg-gray-200/60')}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-[80px] sm:min-w-[90px] text-[#e94a9c] dark:text-[#e94a9c]">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="text-sm sm:text-base font-medium">{item.time}</span>
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100">{item.activity}</h4>
                        {item.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer Link */}
            <div className="mt-6 md:mt-8 text-center">
              <Link to="/calender" className={cn(
                  "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm",
                  "text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-900"
                )}
                onClick={() => onOpenChange(false)} // Close modal on link click
              >
                <ExternalLink className="h-4 w-4 mr-2"/>
                View Full Vaishnava Calendar
              </Link>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
