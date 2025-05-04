import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Clock, X } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useState } from "react"

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
  { time: '4:30 AM', activity: 'Mangala Arati', description: 'Early morning worship' },
  { time: '7:15 AM', activity: 'Guru Puja', description: 'Worship of Srila Prabhupada' },
  { time: '7:30 AM', activity: 'Srimad Bhagavatam Class', description: 'Morning scripture class' },
  { time: '8:30 AM', activity: 'Morning Darshan', description: 'Temple opens for visitors' },
  { time: '12:30 PM', activity: 'Raj Bhog Arati', description: 'Midday offering' },
  { time: '4:30 PM', activity: 'Evening Darshan', description: 'Temple opens for evening visitors' },
  { time: '6:30 PM', activity: 'Gaura Arati', description: 'Evening worship ceremony' },
  { time: '7:00 PM', activity: 'Bhagavad Gita Class', description: 'Evening scripture class' },
  { time: '8:30 PM', activity: 'Sayana Arati', description: 'Final evening worship' }
]

export function TempleEvents({ open, onOpenChange }: TempleEventsProps) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [activeMonth, setActiveMonth] = useState(new Date())

  // Use React Query to fetch and cache the schedule
  const { data: schedule } = useQuery({
    queryKey: ['templeSchedule'],
    queryFn: async () => dailySchedule,
    staleTime: Infinity
  })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = activeMonth.toLocaleString('default', { month: 'long' })
  const currentYear = activeMonth.getFullYear()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(activeMonth)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-10 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-50 w-full max-w-4xl rounded-xl bg-card p-3 sm:p-4 md:p-8 lg:p-10 shadow-lg min-h-[50vh] sm:min-h-0 md:min-h-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Temple Schedule</h2>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1 sm:p-1.5 md:p-2 hover:bg-accent"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </button>
            </div>

            {/* Calendar and Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Calendar Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium">{currentMonth} {currentYear}</h3>
                  <div className="flex gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={() => setActiveMonth(new Date(activeMonth.setMonth(activeMonth.getMonth() - 1)))}
                      className="p-1.5 sm:p-2 md:p-3 hover:bg-accent rounded-lg"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setActiveMonth(new Date(activeMonth.setMonth(activeMonth.getMonth() + 1)))}
                      className="p-1.5 sm:p-2 md:p-3 hover:bg-accent rounded-lg"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-xs sm:text-sm md:text-base font-medium text-muted-foreground">
                  {days.map(day => (
                    <div key={day} className="h-6 sm:h-8 md:h-10 flex items-center justify-center">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {Array.from({ length: daysInMonth }).map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(index + 1)}
                      className={cn(
                        "h-8 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg rounded-lg flex items-center justify-center",
                        selectedDay === index + 1 && "bg-primary text-primary-foreground",
                        "hover:bg-accent"
                      )}
                    >
                      {index + 1}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Daily Schedule Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-base sm:text-lg md:text-xl font-medium">Daily Activities</h3>
                <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 scrollbar-thin">
                  {schedule?.map((item, index) => (
                    <motion.div
                      key={item.time}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.05 }
                      }}
                      className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-[90px] sm:min-w-[100px] md:min-w-[120px] text-primary">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        <span className="text-sm sm:text-base md:text-lg font-medium">{item.time}</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-medium">{item.activity}</h3>
                        {item.description && (
                          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 