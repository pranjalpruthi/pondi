import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, MapPin, CalendarPlus, Newspaper, X, Gift } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
        <div className="flex flex-col items-center justify-center min-h-[320px] max-h-[calc(100vh-180px)] bg-gray-50 dark:bg-black p-4">
            <h3 className="font-bold text-lg text-indigo-900 dark:text-white mb-2 text-center">
                The Śrī Kṛṣṇa Janmāṣṭamī festival has concluded.
            </h3>
            <p className="text-muted-foreground text-sm text-center">We hope you joined us. Stay tuned for future events!</p>
            <Button variant="outline" size="sm" className="mt-4">View Gallery</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[320px] max-h-[calc(100vh-180px)] bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="p-2 border-b dark:border-zinc-700 border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-0.5 rounded-full shadow-sm">
              <div className={cn("rounded-full p-1", "bg-white dark:bg-zinc-800")}>
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              </div>
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Upcoming Festival
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            aria-label="Close panel"
            className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 group"
          >
            <X className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 styled-scrollbar">
        <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-gray-900 dark:via-zinc-900 dark:to-black rounded-xl shadow-lg border border-black/10 dark:border-white/10 p-4 relative overflow-hidden">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" alt="Party Popper" width="60" height="60" className="absolute -top-2 -right-2 transform rotate-12 opacity-40" />
            
            <h3 className="font-bold text-xl text-indigo-900 dark:text-white mb-2">
                Śrī Kṛṣṇa Janmāṣṭamī
            </h3>
            
            <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" />
                    <span>16 AUG 2025</span>
                </div>
                <a href="https://maps.app.goo.gl/k5wX9LMEtFX7UraEA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group" aria-label="View event location on Google Maps">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    <span className="group-hover:underline">Jayaram Thirumana Nilayam</span>
                </a>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Countdown</p>
                <NumberFlowGroup>
                    <div
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                        className="flex items-baseline justify-center font-bold text-2xl text-gray-800 dark:text-white"
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
                            format={{ minimumIntegerDigits: 2 }}
                        />
                        <span className="text-sm font-normal mx-0.5">:</span>
                        <NumberFlow
                            trend={-1}
                            value={timeLeft.seconds}
                            format={{ minimumIntegerDigits: 2 }}
                        />
                    </div>
                </NumberFlowGroup>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex flex-wrap justify-center gap-2 w-full">
                    <Link to="/fests/invite" onClick={onClose}>
                        <Badge className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/80 border-blue-500/30">
                          <Newspaper className="h-3 w-3 mr-1" />
                          Invitation
                        </Badge>
                    </Link>
                    <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                      <Badge className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/80 border-green-500/30">
                        <CalendarPlus className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Badge>
                    </a>
                    <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer">
                      <Badge className="cursor-pointer bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/50 dark:text-pink-200 dark:hover:bg-pink-900/80 border-pink-500/30">
                        <Gift className="h-3 w-3 mr-1" />
                        Sponsor Seva
                      </Badge>
                    </a>
                </div>
                <p className="text-[0.7rem] text-center text-stone-600 dark:text-stone-400 mt-2 italic">
                    "The holy name... is the incarnation of Lord Kṛṣṇa."
                    <span className="opacity-80 ml-1">— CC, Ādi 17.22</span>
                </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-2 border-t border-border/50">
        <Link to="/fests/invite" hash="register" onClick={onClose} className="w-full">
            <Button className="w-full h-10 rounded-full font-semibold shadow-md select-none bg-yellow-400 text-gray-900 hover:bg-yellow-500 relative text-sm group">
                <span className="animate-ping [animation-duration:1.5s] absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 group-hover:bg-orange-500"></span>
                <span className="relative flex items-center justify-center gap-2">
                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png" alt="Diya Lamp" width="20" height="20" />
                    Secure your Free Spot
                </span>
            </Button>
        </Link>
      </div>
    </div>
  );
});
UpcomingEventPanel.displayName = 'UpcomingEventPanel';
