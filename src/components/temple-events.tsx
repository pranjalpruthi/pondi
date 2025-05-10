import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
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
  { time: '4:30 AM', activity: 'Mangal Aarati', description: 'Early morning worship' },
  { time: '7:15 AM', activity: 'Darshan Aarati', description: 'Morning darshan ceremony' },
  { time: '7:20 AM', activity: 'Guru Puja', description: 'Worship of Srila Prabhupada' },
  { time: '8:00 AM', activity: 'Bhagvatam Discourse', description: 'Morning scripture class' },
  { time: '12:00 PM', activity: 'Temple Closes', description: 'Afternoon closing' },
  { time: '5:30 PM', activity: 'Gaura Arati', description: 'Evening worship ceremony' },
  { time: '6:30 PM', activity: 'Temple Closes', description: 'Final closing (may vary based on circumstances)' }
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
          className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-10 overflow-y-auto z-[100] pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with theme gradient */}
          <motion.div
            className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-50 w-full max-w-4xl rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 sm:p-4 md:p-8 lg:p-10 shadow-lg min-h-[50vh] sm:min-h-0 md:min-h-0 border border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-1">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#e94a9c]" />
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text">Temple Schedule</h2>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Calendar and Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Calendar Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-[#0a84ff] dark:text-[#0a84ff]">{currentMonth} {currentYear}</h3>
                  <div className="flex gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={() => setActiveMonth(new Date(activeMonth.setMonth(activeMonth.getMonth() - 1)))}
                      className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setActiveMonth(new Date(activeMonth.setMonth(activeMonth.getMonth() + 1)))}
                      className="p-1.5 sm:p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
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
                        selectedDay === index + 1 
                          ? "bg-gradient-to-r from-[#e94a9c] to-[#ffc547] text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      )}
                    >
                      {index + 1}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Daily Schedule Section */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-[#ffc547] dark:text-[#ffc547]">Daily Activities</h3>
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
                      className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/70 backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-[90px] sm:min-w-[100px] md:min-w-[120px] text-[#e94a9c] dark:text-[#e94a9c]">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        <span className="text-sm sm:text-base md:text-lg font-medium">{item.time}</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white">{item.activity}</h3>
                        {item.description && (
                          <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">{item.description}</p>
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
