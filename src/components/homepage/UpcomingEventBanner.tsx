import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, type Transition } from 'motion/react';
import { X, Sparkles, Calendar, MapPin, CalendarPlus } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
// --- FestivalToggleButton Component ---
interface FestivalToggleButtonProps {
  isEventBannerOpen: boolean;
  setIsEventBannerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainDockAppearanceTransition: Transition;
  isMobile: boolean;
}

export const FestivalToggleButton: React.FC<FestivalToggleButtonProps> = ({
  isEventBannerOpen,
  setIsEventBannerOpen,
  mainDockAppearanceTransition,
  isMobile,
}) => {
  // This button is now mobile-only.
  if (!isMobile) return null;

  const buttonContent = isEventBannerOpen ? 'Close' : 'Festivals';
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...mainDockAppearanceTransition, delay: 0.6 }}
      onClick={() => setIsEventBannerOpen(prev => !prev)}
      className="absolute right-4 -top-10 z-10 pointer-events-auto flex items-center justify-center h-8 px-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
      aria-label={isEventBannerOpen ? "Close Upcoming Event Banner" : "Open Upcoming Event Banner"}
    >
      {buttonContent}
    </motion.button>
  );
};
// --- End FestivalToggleButton Component ---

const eventDate = new Date("2025-08-16T15:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface UpcomingEventBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpcomingEventBanner: React.FC<UpcomingEventBannerProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  const isVisible = isOpen && !timeLeft.isExpired;

  const eventDetails = useMemo(() => ({
    title: "Śrī Kṛṣṇa Janmāṣṭamī Grand Festival",
    start: "20250816T150000",
    end: "20250817T000000",
    description: `Join us for the divine appearance day of Lord Sri Krishna. Event details: https://pondi.vercel.app/fests/invite`,
    location: "Jayamana Thirumana Nilayam, Puducherry"
  }), []);

  const googleCalendarUrl = useMemo(() =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`,
    [eventDetails]
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed top-1/2 -translate-y-1/2 right-5 w-full max-w-xs sm:max-w-sm z-50"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 0 0 rgba(251, 146, 60, 0)',
                '0 0 0 5px rgba(251, 146, 60, 0.4)',
                '0 0 0 0 rgba(251, 146, 60, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
            className="bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-5 relative overflow-hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute top-3 right-3 h-7 w-7 rounded-full text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 z-10"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </Button>

            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Ticket.png" alt="Ticket" width="80" height="80" className="absolute top-12 right-5 transform -rotate-12 opacity-80" />

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30 font-medium">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Join us for the Grand Festival
                </Badge>
                <h3 className="font-bold text-xl text-indigo-900 dark:text-white mb-2">
                  Śrī Kṛṣṇa Janmāṣṭamī
                </h3>
                
                <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>16 AUG 2025</span>
                    </div>
                    <a href="https://maps.app.goo.gl/k5wX9LMEtFX7UraEA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="group-hover:underline">Jayamana Thirumana Nilayam</span>
                    </a>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <NumberFlowGroup>
                        <div
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                            className="flex items-baseline font-semibold text-lg text-gray-800 dark:text-white"
                        >
                            {timeLeft.days > 0 && (
                                <>
                                    <NumberFlow trend={-1} value={timeLeft.days} />
                                    <span className="text-sm font-normal mx-1">d</span>
                                </>
                            )}
                            <NumberFlow trend={-1} value={timeLeft.hours} format={{ minimumIntegerDigits: 2 }} />
                            <span className="text-sm font-normal mx-0.5">:</span>
                            <NumberFlow
                                trend={-1}
                                value={timeLeft.minutes}
                                digits={{ 1: { max: 5 } }}
                                format={{ minimumIntegerDigits: 2 }}
                            />
                            <span className="text-sm font-normal mx-0.5">:</span>
                            <NumberFlow
                                trend={-1}
                                value={timeLeft.seconds}
                                digits={{ 1: { max: 5 } }}
                                format={{ minimumIntegerDigits: 2 }}
                            />
                        </div>
                    </NumberFlowGroup>
                    <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2.5 text-xs">
                            <CalendarPlus className="h-3.5 w-3.5" /> Add to Calendar
                        </Badge>
                    </a>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 italic">
                  "The holy name... is the incarnation of Lord Kṛṣṇa."
                  <span className="opacity-80 ml-1">— CC, Ādi 17.22</span>
                </p>
                <div className="flex flex-col items-center gap-2">
                  <Button asChild size="sm" className="w-full h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to="/fests/invite" onClick={onClose}>
                      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Ticket.png" alt="Ticket" width="20" height="20" className="mr-1.5" />
                      RESERVE YOUR FREE SPOT
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="w-full h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:from-green-500 hover:to-emerald-600">
                    <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width="20" height="20" className="mr-1.5" />
                      Sponsor BG Seva
                      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pleading%20Face.png" alt="Pleading Face" width="20" height="20" className="ml-1.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
