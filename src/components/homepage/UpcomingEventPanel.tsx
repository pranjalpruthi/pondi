import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Sparkles, Calendar, MapPin, CalendarPlus, Newspaper, X } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { cn } from '@/lib/utils';
import { FlipButton } from '@/components/animate-ui/buttons/flip';

const eventDate = new Date("2025-08-16T15:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface UpcomingEventPanelProps {
  onClose: () => void;
}

export const UpcomingEventPanel = React.memo<UpcomingEventPanelProps>(({ onClose }) => {
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

  const eventDetails = useMemo(() => {
    const eventDateStr = "Saturday, 16th August 2025";
    const eventTimeStr = "3:00 PM onwards";
    const venueName = "Jayaram Thirumana Nilayam, Puducherry";
    const venueMapLink = "https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7";

    const fullDescription = `Join us for the divine appearance day of Lord Sri Krishna.

Date: ${eventDateStr}
Time: ${eventTimeStr}
Venue: ${venueName}
Google Maps: ${venueMapLink}

Event details: https://pudhuvai.vrindavanam.org.in/fests/invite

Stay connected with us:
Facebook: https://facebook.com/iskm.pondy
Telegram: https://t.me/ISKMVaishnavasanga
Instagram: https://instagram.com/iskm_pondy
YouTube: https://www.youtube.com/@ISKMPondy
WhatsApp: https://wa.me/918056626108`;

    return {
      title: "Śrī Kṛṣṇa Janmāṣṭamī Grand Festival",
      start: "20250816T150000",
      end: "20250817T000000",
      description: fullDescription,
      location: venueName
    };
  }, []);

  const googleCalendarUrl = useMemo(() =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`,
    [eventDetails]
  );

  if (timeLeft.isExpired) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[420px] max-h-[calc(100vh-180px)] bg-gray-50 dark:bg-black p-4">
            <h3 className="font-bold text-xl text-indigo-900 dark:text-white mb-2">
                The Śrī Kṛṣṇa Janmāṣṭamī festival has concluded.
            </h3>
            <p className="text-muted-foreground">We hope you joined us in the grand celebration. Stay tuned for future events!</p>
            <Button variant="outline" className="mt-4">View Festival Gallery</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[420px] max-h-[calc(100vh-180px)] bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="p-3 border-b dark:border-zinc-700 border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-0.5 rounded-full shadow-md">
              <div className={cn("rounded-full p-1", "bg-white dark:bg-zinc-800")}>
                <Sparkles className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Grand Festival
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            aria-label="Close panel"
            className="w-9 h-9 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 group"
          >
            <X className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 styled-scrollbar">
        <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-2xl shadow-lg border border-black/10 dark:border-white/10 p-5 relative overflow-hidden">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" alt="Party Popper" width="80" height="80" className="absolute -top-2 -right-2 transform rotate-12 opacity-50" />
            
            <h3 className="font-bold text-2xl text-indigo-900 dark:text-white mb-3">
                Śrī Kṛṣṇa Janmāṣṭamī
            </h3>
            
            <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300 mb-5">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>16 AUG 2025</span>
                </div>
                <a href="https://maps.app.goo.gl/k5wX9LMEtFX7UraEA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group" aria-label="View event location on Google Maps">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="group-hover:underline">Jayaram Thirumana Nilayam</span>
                </a>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 mb-5">
                <NumberFlowGroup>
                    <div
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                        className="flex items-baseline justify-center font-bold text-3xl sm:text-4xl text-gray-800 dark:text-white"
                    >
                        {timeLeft.days > 0 && (
                            <>
                                <NumberFlow trend={-1} value={timeLeft.days} />
                                <span className="text-lg sm:text-xl font-normal mx-1.5 sm:mx-2">d</span>
                            </>
                        )}
                        <NumberFlow trend={-1} value={timeLeft.hours} format={{ minimumIntegerDigits: 2 }} />
                        <span className="text-lg sm:text-xl font-normal mx-1 sm:mx-1.5">:</span>
                        <NumberFlow
                            trend={-1}
                            value={timeLeft.minutes}
                            digits={{ 1: { max: 5 } }}
                            format={{ minimumIntegerDigits: 2 }}
                        />
                        <span className="text-lg sm:text-xl font-normal mx-1 sm:mx-1.5">:</span>
                        <NumberFlow
                            trend={-1}
                            value={timeLeft.seconds}
                            digits={{ 1: { max: 5 } }}
                            format={{ minimumIntegerDigits: 2 }}
                        />
                    </div>
                </NumberFlowGroup>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Link to="/fests/invite" onClick={onClose} className="w-full">
                        <FlipButton
                          frontContent={
                            <div className="flex items-center justify-center gap-1.5 text-xs">
                              <Newspaper className="h-3.5 w-3.5" />
                              View Invitation
                            </div>
                          }
                          backContent={<span className="font-bold">Open Page</span>}
                          className="w-full px-4 text-xs h-9 rounded-full font-bold shadow-md select-none"
                          frontClassName="bg-blue-500 text-white"
                          backClassName="bg-blue-600 text-white"
                          from="top"
                        />
                    </Link>
                    <a 
                      href={googleCalendarUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                      aria-label="Add this event to your Google Calendar"
                    >
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="w-full"
                      >
                        <FlipButton
                          frontContent={
                            <div className="flex items-center justify-center gap-1.5">
                              <CalendarPlus className="h-3.5 w-3.5" />
                              Add to Calendar
                            </div>
                          }
                          backContent={<span className="font-bold">Open Google</span>}
                          className="w-full px-4 text-xs h-9 rounded-full font-bold shadow-md select-none"
                          frontClassName="bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                          backClassName="bg-primary/90 text-primary-foreground dark:bg-secondary/90 dark:text-secondary-foreground"
                          from="top"
                        />
                      </motion.div>
                    </a>
                </div>
                <Button asChild size="sm" className="relative group w-full h-9 rounded-full text-white font-bold transition-transform duration-300 ease-in-out hover:-translate-y-0.5" aria-label="Sponsor Bhagavad Gita Seva">
                <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center">
                    <span className="animate-ping [animation-duration:1.5s] absolute inline-flex h-full w-full rounded-full bg-white/75 opacity-75"></span>
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-md transition-all duration-300 ease-in-out group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-lg"></span>
                    <span className="relative flex items-center">
                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width="20" height="20" className="mr-1.5" />
                    Sponsor Bhagavad Gītā Seva
                    </span>
                </a>
                </Button>
                <p className="text-xs text-center text-stone-600 dark:text-stone-400 mt-3 italic">
                    "The holy name... is the incarnation of Lord Kṛṣṇa."
                    <span className="opacity-80 ml-1">— CC, Ādi 17.22</span>
                </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-border/50">
        <Link to="/fests/invite" hash="register" onClick={onClose} className="w-full">
            <Button className="w-full h-12 rounded-full font-semibold shadow-md select-none bg-yellow-400 text-gray-900 hover:bg-yellow-500 relative text-base group">
                <span className="animate-ping [animation-duration:1.5s] absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 group-hover:bg-orange-500"></span>
                <span className="relative flex items-center justify-center gap-2">
                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png" alt="Diya Lamp" width="24" height="24" />
                    Secure your Free Spot
                </span>
            </Button>
        </Link>
      </div>
    </div>
  );
});
UpcomingEventPanel.displayName = 'UpcomingEventPanel';
