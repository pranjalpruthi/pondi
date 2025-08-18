import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from "@/hooks/use-mobile";

// --- MOBILE EVENT CARD COMPONENT ---
interface MobileEventCardProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  };
  isEventCardVisible: boolean;
  isDockOpen: boolean;
  isClipsPanelActive: boolean;
  locationPathname: string;
}

export const MobileEventCard = ({ 
  timeLeft, 
  isEventCardVisible, 
  isDockOpen, 
  isClipsPanelActive, 
  locationPathname 
}: MobileEventCardProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isMobile && !isDockOpen && !isClipsPanelActive && locationPathname !== '/fests/invite' && isEventCardVisible && (
        <motion.div
          layoutId="event-card"
          className="absolute bottom-full right-2 sm:right-4 mb-2 w-48 pointer-events-auto"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2, ease: 'easeOut' } }}
          onClick={() => navigate({ to: '/fests/invite' })}
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-200 to-pink-300 text-pink-800 shadow-md cursor-pointer relative overflow-hidden">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" alt="Party Popper" width="40" height="40" className="absolute -top-1 -right-1 transform rotate-12 opacity-30" />
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="secondary" className="text-blue-600 bg-white/90 text-[0.6rem] px-1.5 py-0.5 font-bold">
                HAPPY
              </Badge>
            </div>
            <p className="font-bold text-sm leading-tight mb-2">Śrī Kṛṣṇa Janmāṣṭamī</p>
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
              <div className="flex justify-center">
                <a
                  href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width={14} height={14} />
                  Sponsor
                </a>
              </div>
            ) : (
              <div className="flex items-baseline justify-center font-bold text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {timeLeft.days > 0 && (
                  <>
                    <NumberFlow trend={-1} value={timeLeft.days} />
                    <span className="text-xs font-normal mx-1">d</span>
                  </>
                )}
                <NumberFlow trend={-1} value={timeLeft.hours} format={{ minimumIntegerDigits: 2 }} />
                <span className="text-xs font-normal mx-0.5">:</span>
                <NumberFlow trend={-1} value={timeLeft.minutes} format={{ minimumIntegerDigits: 2 }} />
                <span className="text-xs font-normal mx-0.5">:</span>
                <NumberFlow trend={-1} value={timeLeft.seconds} format={{ minimumIntegerDigits: 2 }} />
              </div>
            )}
            <motion.div
              className="mt-2 text-center text-[0.7rem] font-bold text-yellow-900 bg-gradient-to-r from-yellow-400 to-amber-500 py-1 rounded-lg shadow-inner"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              View Invitation
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- DESKTOP FESTIVAL BAR COMPONENT ---
interface DesktopFestivalBarProps {
  isMobile: boolean;
  locationPathname: string;
  handleGetPassClick: () => void;
}

export const DesktopFestivalBar = ({ 
  isMobile, 
  locationPathname, 
  handleGetPassClick 
}: DesktopFestivalBarProps) => {
  return (
    <AnimatePresence>
      {!isMobile && locationPathname !== '/fests/invite' && (
        <motion.div
          layout
          className="relative mx-auto flex justify-center container px-2 sm:px-4 pointer-events-auto group mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, delay: 0.2 } }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
        >
          <div className={cn(
            "flex items-center justify-between w-full sm:max-w-fit max-w-md bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md transition-all duration-200 gap-2",
            "p-1.5 rounded-xl"
          )}>
            <Link to="/fests/invite" onClick={handleGetPassClick} className="font-bold text-sm pl-1 text-left flex-grow overflow-hidden">
              🎉 Happy Śrī Kṛṣṇa Janmāṣṭamī
            </Link>

            <div className="flex-shrink-0 flex items-center gap-1.5">
              <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 relative group">
                <span className={cn(
                  "relative rounded-full font-bold shadow-lg select-none bg-green-500 text-white transition-all duration-200 ring-2 ring-transparent group-hover:ring-green-400 flex items-center gap-1",
                  "px-4 py-2 text-sm"
                )}>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width={16} height={16} />
                  Sponsor
                </span>
              </a>
              <motion.div
                className="flex-shrink-0 relative group"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Link to="/fests/invite" onClick={handleGetPassClick}>
                  <span className={cn(
                    "relative rounded-full font-bold shadow-lg select-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-200 ring-2 ring-transparent group-hover:ring-blue-400 flex items-center gap-1",
                    "px-4 py-2 text-sm"
                  )}>
                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png" alt="Diya Lamp" width={18} height={18} />
                    View Invitation
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- USAGE EXAMPLE ---
/*
// To use these components in the future, import them and use like this:

import { MobileEventCard, DesktopFestivalBar } from '@/components/event-banners/festival-banners';

// In your component:
<MobileEventCard
  timeLeft={timeLeft}
  isEventCardVisible={isEventCardVisible}
  isDockOpen={isDockOpen}
  isClipsPanelActive={isClipsPanelActive}
  locationPathname={location.pathname}
/>

<DesktopFestivalBar
  isMobile={isMobile}
  locationPathname={location.pathname}
  handleGetPassClick={handleGetPassClick}
/>
*/