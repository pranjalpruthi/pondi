import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { Calendar, ChevronRight, Info, Loader2, X, ArrowRight, ArrowLeft, Youtube, MapPin, CheckCircle } from 'lucide-react';
import { IconCar, IconPhone, IconClock } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import EventCtaButton from '@/components/animate-ui/buttons/event-cta-button';

// --- TYPES ---
interface RawEvent {
  text: string;
  prio: number;
  dispItem: number;
  fasttype: number;
  fastsubject?: string;
}

interface CalendarDay {
  date_str: string;
  events: string[];
  raw_events: RawEvent[];
}

interface CalendarResponse {
  data: CalendarDay[];
}

type MediaItem = {
  type: 'image';
  src: string;
  alt: string;
} | {
  type: 'video';
  src: string; // YouTube embed URL
  thumbnail: string;
  alt: string;
};

type EventPost = {
  id: string;
  title: string;
  description: string;
  media: MediaItem[];
  registrationUrl?: string;
};

type UpcomingEvent = {
  date: string;
  events: RawEvent[];
};


// --- DATA FETCHING ---
const fetchUpcomingEvents = async ({ pageParam = 0 }): Promise<CalendarDay[]> => {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() + pageParam, 1);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  const response = await fetch(`/api/calendar?location_city=Pondicherry&year=${year}&month=${month}`);
  if (!response.ok) {
    // Return empty array for 404s which can happen for future months with no schedule
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch data for ${year}-${month}`);
  }
  const result: CalendarResponse = await response.json();
  return result.data || [];
};

// --- HELPER FUNCTIONS ---
const monthColors = [
    { name: 'January', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-800/70 dark:text-sky-100', card: 'group-hover:bg-sky-100/70 dark:group-hover:bg-sky-900/40', date: 'bg-sky-100/80 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300 group-hover:bg-sky-200/70 dark:group-hover:bg-sky-500/40', text: 'text-sky-800 dark:text-sky-200' },
    { name: 'February', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-800/70 dark:text-violet-100', card: 'group-hover:bg-violet-100/70 dark:group-hover:bg-violet-900/40', date: 'bg-violet-100/80 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 group-hover:bg-violet-200/70 dark:group-hover:bg-violet-500/40', text: 'text-violet-800 dark:text-violet-200' },
    { name: 'March', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/70 dark:text-emerald-100', card: 'group-hover:bg-emerald-100/70 dark:group-hover:bg-emerald-900/40', date: 'bg-emerald-100/80 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 group-hover:bg-emerald-200/70 dark:group-hover:bg-emerald-500/40', text: 'text-emerald-800 dark:text-emerald-200' },
    { name: 'April', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-800/70 dark:text-amber-100', card: 'group-hover:bg-amber-100/70 dark:group-hover:bg-amber-900/40', date: 'bg-amber-100/80 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 group-hover:bg-amber-200/70 dark:group-hover:bg-amber-500/40', text: 'text-amber-800 dark:text-amber-200' },
    { name: 'May', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-800/70 dark:text-rose-100', card: 'group-hover:bg-rose-100/70 dark:group-hover:bg-rose-900/40', date: 'bg-rose-100/80 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 group-hover:bg-rose-200/70 dark:group-hover:bg-rose-500/40', text: 'text-rose-800 dark:text-rose-200' },
    { name: 'June', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800/70 dark:text-indigo-100', card: 'group-hover:bg-indigo-100/70 dark:group-hover:bg-indigo-900/40', date: 'bg-indigo-100/80 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 group-hover:bg-indigo-200/70 dark:group-hover:bg-indigo-500/40', text: 'text-indigo-800 dark:text-indigo-200' },
    { name: 'July', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800/70 dark:text-cyan-100', card: 'group-hover:bg-cyan-100/70 dark:group-hover:bg-cyan-900/40', date: 'bg-cyan-100/80 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300 group-hover:bg-cyan-200/70 dark:group-hover:bg-cyan-500/40', text: 'text-cyan-800 dark:text-cyan-200' },
    { name: 'August', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-800/70 dark:text-orange-100', card: 'group-hover:bg-orange-100/70 dark:group-hover:bg-orange-900/40', date: 'bg-orange-100/80 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 group-hover:bg-orange-200/70 dark:group-hover:bg-orange-500/40', text: 'text-orange-800 dark:text-orange-200' },
    { name: 'September', badge: 'bg-lime-100 text-lime-800 dark:bg-lime-800/70 dark:text-lime-100', card: 'group-hover:bg-lime-100/70 dark:group-hover:bg-lime-900/40', date: 'bg-lime-100/80 text-lime-600 dark:bg-lime-500/20 dark:text-lime-300 group-hover:bg-lime-200/70 dark:group-hover:bg-lime-500/40', text: 'text-lime-800 dark:text-lime-200' },
    { name: 'October', badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-800/70 dark:text-fuchsia-100', card: 'group-hover:bg-fuchsia-100/70 dark:group-hover:bg-fuchsia-900/40', date: 'bg-fuchsia-100/80 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 group-hover:bg-fuchsia-200/70 dark:group-hover:bg-fuchsia-500/40', text: 'text-fuchsia-800 dark:text-fuchsia-200' },
    { name: 'November', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-800/70 dark:text-teal-100', card: 'group-hover:bg-teal-100/70 dark:group-hover:bg-teal-900/40', date: 'bg-teal-100/80 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300 group-hover:bg-teal-200/70 dark:group-hover:bg-teal-500/40', text: 'text-teal-800 dark:text-teal-200' },
    { name: 'December', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-800/70 dark:text-blue-100', card: 'group-hover:bg-blue-100/70 dark:group-hover:bg-blue-900/40', date: 'bg-blue-100/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 group-hover:bg-blue-200/70 dark:group-hover:bg-blue-500/40', text: 'text-blue-800 dark:text-blue-200' },
];
const getMonthColor = (month: number) => monthColors[month % 12];

const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const filterAndSortUpcomingEvents = (data: CalendarDay[]): UpcomingEvent[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventMap = new Map<string, RawEvent[]>();

  data
    .filter(day => new Date(day.date_str) >= today)
    .forEach(day => {
      const significantEvents = day.raw_events
        .filter(event => event.prio <= 200)
        .sort((a, b) => a.prio - b.prio);
      
      if (significantEvents.length > 0) {
        if (eventMap.has(day.date_str)) {
          eventMap.get(day.date_str)!.push(...significantEvents);
        } else {
          eventMap.set(day.date_str, significantEvents);
        }
      }
    });

  const groupedEvents = Array.from(eventMap.entries()).map(([date, events]) => ({
    date,
    events,
  }));

  return groupedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};



const locationDetails = {
  address: "International Sri Krishna Mandir, RS No:54/3, Koodappakam Village, (Near POGO Land), Pathukkannu Main Road, Pondicherry, India",
  tourPhone: "+91 80565 13859",
  hours: ["Monday - Sunday:", "5 am–12:30 pm", "4–8:45 pm"],
  mapsLink: "https://maps.app.goo.gl/EoqakWfAySKhQWPi9"
};

const eventPosts: EventPost[] = [
  {
    id: 'event-1',
    title: 'Janmashtami Grand Celebration',
    description: 'Join us for the divine appearance day of Lord Krishna. A day of fasting, feasting, and celebration.',
    media: [
      { type: 'image', src: '/updates/s8.webp', alt: 'Janmashtami Grand Celebration Poster' },
      { type: 'image', src: '/gallery/temple-2.webp', alt: 'Devotees celebrating Janmashtami' },
    ],
    registrationUrl: 'https://tally.so/r/mDoRD5',
  },
  {
    id: 'event-2',
    title: 'OPENING OF CONFERENCE HALL | CONSTRUCTION UPDATE | ISKM PONDICHERRY',
    description: `🕉️ Join us on this incredible journey as we vlog the heartwarming efforts of devoted souls coming together to build a temple for the pleasure of Krishna! 🏰🙏

As we poured our hearts and souls into building this temple, we felt an overwhelming sense of joy and fulfillment, knowing that our efforts are aimed at pleasing the lotus feet of Krishna. 🌈🌌

By the boundless mercy of Prabhupada, we successfully completed the first slab of this divine project. 🙌🏼✨

Join us in this uplifting experience of devotion, hard work, and love as we embark on this sacred journey together. Don't forget to like, share, and subscribe to our channel to stay updated on the temple's progress and more such spiritual adventures! 🎉🔔`,
    media: [
      { type: 'video', src: 'https://www.youtube.com/embed/MUKV9AbYmK4', thumbnail: '/gallery/temple-3.webp', alt: 'Opening of Conference Hall' },
    ],
  },
  {
    id: 'event-3',
    title: 'Chennai Sunday Program Kirtan | ISKM Pondicherry | HG Prahlad Bhakta Prabhu',
    description: 'Chennai Sunday Program Kirtan | ISKM Pondicherry | HG Prahlad Bhakta Prabhu',
    media: [
      { type: 'video', src: 'https://www.youtube.com/embed/ImuffDdPpvQ', thumbnail: 'https://i.ytimg.com/vi/ImuffDdPpvQ/hqdefault.jpg', alt: 'Chennai Sunday Program Kirtan' },
    ],
  },
];


// --- NEW EVENT CAROUSEL ---
const EventCarousel = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [, setIsPaginating] = useState(false);
  // const [isHovered, setIsHovered] = useState(false);
  // const AUTOPLAY_INTERVAL = 9000; // 9 seconds - commented out as autoplay is removed

  const event = eventPosts[currentEventIndex];
  const media = event.media[currentMediaIndex];

  const paginateEvent = useCallback((newDirection: number) => {
    setIsPaginating(true);
    setCurrentEventIndex(prevIndex => (prevIndex + newDirection + eventPosts.length) % eventPosts.length);
    setCurrentMediaIndex(0);
    setTimeout(() => setIsPaginating(false), 600);
  }, []);

  // Autoplay removed as per user request
  // useEffect(() => {
  //   if (isHovered) return;
  //
  //   const interval = setInterval(() => {
  //     paginateEvent(1);
  //   }, AUTOPLAY_INTERVAL);
  //
  //   return () => clearInterval(interval);
  // }, [isHovered, paginateEvent]);

  const paginateMedia = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentMediaIndex((prevIndex) => (prevIndex + newDirection + event.media.length) % event.media.length);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) {
      paginateMedia(1);
    } else if (swipe > 10000) {
      paginateMedia(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="w-full h-full bg-background rounded-2xl shadow-lg overflow-hidden relative"
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container - z-0 */}
      <div className="absolute inset-0 z-0">
        {event.media.length > 0 ? (
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={event.id + '-' + currentMediaIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute w-full h-full"
            >
              {media.type === 'image' ? (
                <img src={media.src} alt={media.alt} className="w-full h-full object-cover" />
              ) : (
                <iframe
                  src={`${media.src}?loop=1&playlist=${media.src.split('/').pop()?.split('?')[0]}`}
                  title={media.alt}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
        )}
      </div>

      {/* Content Overlay & UI - z-10 */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        <div className={cn(
          "relative w-full pointer-events-auto text-white",
          event.media.length > 0 
            ? "h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-sm" 
            : "h-full bg-black/40"
        )}>
          {event.media.length > 0 ? (
            // Layout for events with media
            <div className="p-4 h-full flex flex-col justify-end">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                {/* Left side: Thumbnails, Title, Description */}
                <div className="flex-grow pr-0 md:pr-4 flex flex-col justify-end" key={event.id}>
                  {/* Thumbnails */}
                  {event.media.length > 1 && (
                    <div className="mb-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 bg-black/50 p-2 rounded-lg">
                        {event.media.map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={cn(
                              'w-20 h-14 rounded-md overflow-hidden relative flex-shrink-0 border-2 border-transparent'
                            )}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: index === currentMediaIndex ? 1 : 0.6 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <img src={item.type === 'image' ? item.src : item.thumbnail} alt={item.alt} className="w-full h-full object-cover" />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Youtube className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Title & Desc */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="hidden md:block">
                        <p className="text-sm text-white/80 line-clamp-2">{event.description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Right side: Buttons */}
                <div className="flex flex-col justify-between items-end md:items-end flex-shrink-0 self-stretch gap-y-4 w-full md:w-auto">
                  <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto">
                      <Button size="sm" variant="outline" onClick={() => paginateEvent(-1)} className="bg-blue-500/50 border-blue-400/30 hover:bg-blue-600/60 text-white">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Prev
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => paginateEvent(1)} className="bg-blue-500/50 border-blue-400/30 hover:bg-blue-600/60 text-white">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto flex-wrap">
                      {event.registrationUrl && (
                        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                          <EventCtaButton
                            icon={<CheckCircle className="h-6 w-6" />}
                            defaultText="Register Now!"
                            hoverText="for this event"
                            emoji="✨"
                            className="bg-green-500 hover:bg-green-600"
                            pulseColor="rgba(34, 197, 94, 0.4)"
                          />
                        </a>
                      )}
                      <Popover>
                        <PopoverTrigger asChild>
                          <EventCtaButton
                            icon={<MapPin className="h-6 w-6" />}
                            defaultText="Plan a Visit"
                            hoverText="Get Directions"
                            emoji="🗺️"
                            className="bg-blue-500 hover:bg-blue-600"
                            pulseColor="rgba(59, 130, 246, 0)" // Disable pulse for this one
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-72 text-black dark:text-white">
                          <h3 className="font-semibold mb-2">ISKM Pudhuvai Temple</h3>
                          <p className="text-sm text-muted-foreground mb-3">{locationDetails.address}</p>
                          <div className="flex flex-col space-y-2 mb-3">
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-green-500 hover:bg-green-600 text-white"><IconCar className="h-3 w-3" />Book Temple Tour</Badge>
                            <a href={`tel:${locationDetails.tourPhone}`} className="w-fit">
                              <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white"><IconPhone className="h-3 w-3" />{locationDetails.tourPhone}</Badge>
                            </a>
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center text-sm mb-1"><IconClock className="mr-2 h-4 w-4" /> Opening Hours:</h4>
                            <ul className="text-sm text-muted-foreground space-y-0.5">{locationDetails.hours.map((line, i) => <li key={i}>{line}</li>)}</ul>
                          </div>
                          <div className="mt-4">
                            <Button variant="secondary" size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { window.open(locationDetails.mapsLink, '_blank'); }}><MapPin className="mr-2 h-4 w-4" />Open in Maps</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Layout for text-only events
            <div className="p-8 h-full flex flex-col justify-center items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={event.id}
                  className="max-w-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-3xl font-bold text-shadow-lg">{event.title}</h3>
                  <p className="text-white/90 mt-2 text-shadow">{event.description}</p>
                </motion.div>
              </AnimatePresence>
              {/* Buttons for text-only card */}
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => paginateEvent(-1)} className="bg-white/20 border-white/30 hover:bg-white/30 text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Prev
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => paginateEvent(1)} className="bg-white/20 border-white/30 hover:bg-white/30 text-white">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-2">
                  {event.registrationUrl && (
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                      <EventCtaButton
                        icon={<CheckCircle className="h-6 w-6" />}
                        defaultText="Register Now!"
                        hoverText="for this event"
                        emoji="✨"
                        className="bg-green-500 hover:bg-green-600"
                        pulseColor="rgba(34, 197, 94, 0.4)"
                      />
                    </a>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <EventCtaButton
                        icon={<MapPin className="h-6 w-6" />}
                        defaultText="Plan a Visit"
                        hoverText="Get Directions"
                        emoji="🗺️"
                        className="bg-blue-500 hover:bg-blue-600"
                        pulseColor="rgba(59, 130, 246, 0)"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-black dark:text-white">
                      <h3 className="font-semibold mb-2">ISKM Pudhuvai Temple</h3>
                      <p className="text-sm text-muted-foreground mb-3">{locationDetails.address}</p>
                      <div className="flex flex-col space-y-2 mb-3">
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-green-500 hover:bg-green-600 text-white"><IconCar className="h-3 w-3" />Book Temple Tour</Badge>
                        <a href={`tel:${locationDetails.tourPhone}`} className="w-fit">
                          <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white"><IconPhone className="h-3 w-3" />{locationDetails.tourPhone}</Badge>
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center text-sm mb-1"><IconClock className="mr-2 h-4 w-4" /> Opening Hours:</h4>
                        <ul className="text-sm text-muted-foreground space-y-0.5">{locationDetails.hours.map((line, i) => <li key={i}>{line}</li>)}</ul>
                      </div>
                      <div className="mt-4">
                        <Button variant="secondary" size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { window.open(locationDetails.mapsLink, '_blank'); }}><MapPin className="mr-2 h-4 w-4" />Open in Maps</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Navigation - z-20 */}
      {event.media.length > 1 && (
        <>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                  <Button size="icon" onClick={() => paginateMedia(1)} variant="secondary" className="rounded-full shadow-lg bg-blue-500/50 hover:bg-blue-600/60">
                    <ChevronRight />
                  </Button>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                  <Button size="icon" onClick={() => paginateMedia(-1)} variant="secondary" className="rounded-full shadow-lg bg-blue-500/50 hover:bg-blue-600/60">
                    <ArrowLeft />
                  </Button>
          </div>
        </>
      )}
    </div>
  );
};


const VirtualizedEventList = ({
  events,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onVisibleMonthChange,
}: {
  events: UpcomingEvent[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onVisibleMonthChange: (month: string) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const lastReportedMonthRef = useRef<string | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? events.length + 1 : events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
        const day = events[index];
        if (!day) return 132; // Adjusted for more padding
        // Base height (for py-6) + extra height for each additional event
        return 116 + (day.events.length > 1 ? (day.events.length - 1) * 24 : 0);
    },
    overscan: 5,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems.at(-1);
    if (!lastItem) return;

    if (lastItem.index >= events.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    
    const firstItem = virtualItems[0];
    if (firstItem) {
      const day = events[firstItem.index];
      if (day) {
        const date = new Date(day.date);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (monthYear !== lastReportedMonthRef.current) {
          onVisibleMonthChange(monthYear);
          lastReportedMonthRef.current = monthYear;
        }
      }
    }
  }, [hasNextPage, fetchNextPage, events, rowVirtualizer.getVirtualItems(), isFetchingNextPage, onVisibleMonthChange]);

  return (
    <div ref={parentRef} className="h-full overflow-y-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > events.length - 1;
          if (isLoaderRow) {
            return (
              <div
                key="loader"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="flex items-center justify-center p-2"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            );
          }

          const day = events[virtualItem.index];
          const date = new Date(day.date);
          const month = date.getMonth();
          const monthColor = getMonthColor(month);
          
          // Determine styling based on the most significant event of the day
          const isFastingDay = day.events.some(e => e.fasttype > 0 || e.text.toLowerCase().includes('ekadasi'));
          const isBreakFastDay = day.events.some(e => e.dispItem === 17);

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="group px-1 py-6"
            >
              <div
                className={cn(
                  "flex items-start gap-4 p-3 rounded-lg transition-colors duration-300 h-full",
                  isFastingDay
                    ? "bg-pink-50/50 dark:bg-pink-900/20 group-hover:bg-pink-100/70 dark:group-hover:bg-pink-900/40"
                    : isBreakFastDay
                    ? "bg-rose-50/50 dark:bg-rose-900/20 group-hover:bg-rose-100/70 dark:group-hover:bg-rose-900/40"
                    : monthColor.card
                )}
              >
                <div className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 flex-shrink-0 mt-1",
                  isFastingDay
                    ? "bg-pink-100/80 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 group-hover:bg-pink-200/70 dark:group-hover:bg-pink-500/40"
                    : isBreakFastDay
                    ? "bg-rose-100/80 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 group-hover:bg-rose-200/70 dark:group-hover:bg-rose-500/40"
                    : monthColor.date
                )}>
                  <span className="text-sm font-semibold">{formatDateDisplay(day.date).split(' ')[0]}</span>
                  <span className="text-xl font-bold">{formatDateDisplay(day.date).split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {day.events.map((event, index) => {
                    const isFastingEvent = event.fasttype > 0 || event.text.toLowerCase().includes('ekadasi');
                    const isBreakFastEvent = event.dispItem === 17;
                    return (
                      <p key={index} className={cn(
                        'font-semibold text-md mb-1',
                        isFastingEvent
                          ? "text-pink-800 dark:text-pink-200"
                          : isBreakFastEvent
                          ? "text-rose-800 dark:text-rose-200"
                          : monthColor.text
                      )}>{event.text}</p>
                    )
                  })}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UpcomingEventsList = () => {
  const [visibleMonth, setVisibleMonth] = useState('');
  const [iconError, setIconError] = useState(false);

  const monthColor = useMemo(() => {
    if (!visibleMonth) {
      const currentMonth = new Date().getMonth();
      return getMonthColor(currentMonth);
    }
    const monthName = visibleMonth.split(' ')[0];
    const monthIndex = monthColors.findIndex(m => m.name === monthName);
    return getMonthColor(monthIndex >= 0 ? monthIndex : new Date().getMonth());
  }, [visibleMonth]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['upcomingEvents'],
    queryFn: fetchUpcomingEvents,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 && allPages.length > 2) {
        return undefined;
      }
      return allPages.length;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const allEvents = useMemo(() => {
    if (!data) return [];
    const allDays = data.pages.flat();
    return filterAndSortUpcomingEvents(allDays);
  }, [data]);

  if (isLoading) {
    return (
      <Card className="p-4 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg h-full flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold text-primary">Assembling the Divine Schedule...</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">"Be patient. Everything comes to you in the right moment."</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-4 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg h-full flex flex-col items-center justify-center text-center">
        <X className="h-8 w-8 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-500">A Temporary Illusion</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">A disturbance has obscured the divine schedule. Please refresh the page and try again.</p>
      </Card>
    );
  }

  if (allEvents.length === 0) {
    return (
      <Card className="p-4 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg h-full flex flex-col items-center justify-center text-center">
        <Calendar className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-lg font-semibold text-primary">A Time for Sadhana</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">The calendar appears clear, but the festival of the Holy Name is always present in our hearts.</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg h-full flex flex-col">
      <CardHeader className="p-2 relative">
        <CardTitle className="text-xl font-bold text-primary mb-2 px-2 flex items-center gap-2">
          {iconError ? (
            <Calendar className="h-6 w-6" />
          ) : (
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Spiral%20Calendar.png"
              alt="Spiral Calendar"
              width="25"
              height="25"
              onError={() => setIconError(true)}
            />
          )}
          <span>Upcoming Events</span>
        </CardTitle>
        <AnimatePresence>
          {visibleMonth && (
            <motion.div
              key={visibleMonth}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-3 right-3"
            >
              <Badge variant="secondary" className={cn("text-xs font-semibold shadow-md", monthColor.badge)}>
                {visibleMonth}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <VirtualizedEventList
          events={allEvents}
          fetchNextPage={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onVisibleMonthChange={setVisibleMonth}
        />
      </CardContent>
    </Card>
  );
};

interface SpecialEventBannerProps {
  safePlayPopOn: () => void;
}

const SpecialEventBanner = ({ safePlayPopOn: _ }: SpecialEventBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, height: 0, padding: 0, margin: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4 rounded-xl shadow-lg mb-6 md:mb-12 overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center flex-col md:flex-row gap-4 md:gap-0 text-center md:text-left">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mr-0 md:mr-4"
            >
              <Info className="h-6 w-6" />
            </motion.div>
            <div>
              <h4 className="font-bold text-base md:text-xl">Special Announcement</h4>
              <p className="text-sm md:text-base">Janmashtami Grand Celebration: Join us on August 16th!</p>
              <blockquote className="border-l-2 border-white/50 pl-3 italic text-white/80 text-xs mt-2">
                "In this age of Kali, the holy name of the Lord, the Hare Kṛṣṇa mahā-mantra, is the incarnation of Lord Kṛṣṇa."
              </blockquote>
              <cite className="mt-1 block text-right text-xs text-white/90 not-italic">— CC, Ādi 17.22</cite>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0 flex-wrap gap-2">
            <Link to="/fests/invite">
              <EventCtaButton
                icon={<CheckCircle className="h-4 w-4" />}
                defaultText="Register Now"
                hoverText="for this event"
                emoji="✨"
                className="bg-green-500 hover:bg-green-600 text-xs px-3 py-1.5 mr-2 rounded-full"
                pulseColor="rgba(34, 197, 94, 0.4)"
              />
            </Link>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


// --- Main Component ---
export function EventSection() {
  const { isSoundEnabled } = useSoundSettings();
  const [playPopOn] = useSound('/sounds/pop-on.wav', { volume: 0.25, soundEnabled: isSoundEnabled });

  const safePlayPopOn = useCallback(() => { if (isSoundEnabled) playPopOn(); }, [isSoundEnabled, playPopOn]);

  return (
    <section className="py-24 bg-gray-50/50 dark:bg-black/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:col-span-1">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800/70 dark:text-purple-100 text-sm font-medium mb-4">
                Festivals & Events
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Join Our Celebrations 💫
              </h2>
            </div>
            <div className="md:col-span-1">
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "A temple means a place where one can learn the science of God."
              </blockquote>
              <cite className="mt-2 block text-right text-sm text-muted-foreground not-italic">— Srila Prabhupada, The Science of Self-Realization</cite>
            </div>
          </div>
        </motion.div>

        <SpecialEventBanner 
          safePlayPopOn={safePlayPopOn}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:col-span-1 h-[600px]">
            <EventCarousel />
          </div>
          <div className="lg:col-span-1 h-[600px]">
            <UpcomingEventsList />
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link to="/calender">
            {({ isTransitioning }) =>
              isTransitioning ? (
                <Button
                  size="lg"
                  disabled
                  className="rounded-full px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform active:scale-95 cursor-wait"
                >
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Loading Calendar...
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="default"
                  className="group rounded-full px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 active:scale-95"
                >
                  View Full Calendar
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              )
            }
          </Link>
        </div>
      </div>
    </section>
  );
}
