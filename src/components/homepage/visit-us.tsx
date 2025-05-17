import { motion, AnimatePresence } from "motion/react"
import { MapPin, Phone, ExternalLink, Clock, Calendar, Car, Plane, Bus, Train, Info, AlertCircle, Navigation, ArrowRight, Quote, ChevronLeft, ChevronRight, Home, Bookmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect, useRef, useCallback } from "react" // Added useCallback
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';

// Import animated components
import { RippleButton } from "@/components/animate-ui/buttons/ripple"
import { IconButton } from "@/components/animate-ui/buttons/icon"
import { CopyButton } from "@/components/animate-ui/buttons/copy"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/animate-ui/radix/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/animate-ui/radix/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/animate-ui/radix/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/animate-ui/components/tooltip"
import { TypingText } from "@/components/animate-ui/text/typing"
import { WritingText } from "@/components/animate-ui/text/writing"

// Color theme variables - matching with other components
const colors = {
  pink: {
    primary: "#e94a9c", // Lotus pink
    hover: "#d3428c",
    light: "rgba(233, 74, 156, 0.15)",
    lighter: "rgba(233, 74, 156, 0.08)"
  },
  gold: {
    primary: "#ffc547", // Golden
    hover: "#e6b03f",
    light: "rgba(255, 197, 71, 0.15)",
    lighter: "rgba(255, 197, 71, 0.08)"
  },
  blue: {
    primary: "#0a84ff", // Royal blue (Apple blue)
    hover: "#0077ed",
    light: "rgba(10, 132, 255, 0.15)",
    lighter: "rgba(10, 132, 255, 0.08)"
  }
}

// Temple location data
const templeInfo = {
  address: "ISKM Pondicherry, RS No-54/3, Koodappakkam, Main Road, Near Pogo Land, Pathukannu, Puducherry 605502",
  phone: "+91 90426 42103",
  email: "info@iskmpondicherry.org",
  mapsLink: "https://maps.google.com/maps?q=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502",
  hours: [
    { day: "Monday - Sunday (Morning)", hours: "4:30 AM - 12:00 PM" },
    { day: "Monday - Sunday (Evening)", hours: "4:30 PM - 6:30 PM" }
  ]
}

// Prabhupada quotes on temple visiting
const prabhupadaQuotes = [
  {
    text: "In the Kali-yuga the only sacrifice recommended is sankirtana-yajna, the chanting of the Hare Krsna mantra. Therefore those who are intelligent should assemble at the temple of Visnu and chant the Hare Krsna mantra to satisfy the Supreme Personality of Godhead, who is Narayana.",
    source: "Srimad-Bhagavatam 8.8.2, Purport"
  },
  {
    text: "By visiting the temple and viewing the Deity, one can make further advancement to personal contact. The Lord has two features — the personal and impersonal. The personal feature of the Absolute Truth is Bhagavān, and the impersonal feature of the Absolute Truth is Brahman.",
    source: "Teachings of Lord Kapila, Verse 11"
  },
  {
    text: "The temple is a place where God is worshiped. That means in the temple there is a form of God installed, and we should go to the temple and visit the form and pray to the form and offer our respects. That is the beginning of spiritual life.",
    source: "Room Conversation, April 12, 1969"
  },
  {
    text: "One should associate with devotees, hear about God from the Bhagavad-gita, and chant Hare Krishna. Then one's life will be perfect. In this Krishna consciousness movement, we are teaching this. We don't say it is difficult. It is very easy. You simply have to be a little gentle and visit our temple.",
    source: "Conversation with Allen Ginsberg, May 11, 1969, Columbus, Ohio"
  },
  {
    text: "Actually, to advance in spiritual life, one has to make a habit of going to see the temple and the Deity. The Deity is Kṛṣṇa, and the temple is also Kṛṣṇa. They are identical. This must be understood.",
    source: "Bhagavad-gita As It Is, 10.10, Purport"
  },
  {
    text: "Temple worship means to go to the temple and offer all kinds of service there — decorating, cleaning, worshiping, dressing the deity, and so on. You have to work for Krsna. Simply chanting will not do.",
    source: "Lecture on Bhagavad-gita 13.35, January 22, 1975"
  }
];

// Temple etiquette guidelines
const templeEtiquette: string[] = [
  "Please remove shoes before entering temple",
  "Dress modestly (covered shoulders and knees)",
  "Maintain respectful silence near deities", 
  "Photography may be restricted in certain areas",
  "Follow the guidance of the temple devotees"
];

// Transportation data
const transportationData = {
  airport: {
    name: "Puducherry Airport (PNY)",
    distance: "5-6 km",
    travelTime: "~15 minutes",
    taxis: [
      { name: "Royal Travels Cabs", phone: "+91 22 33 55 33 55" },
      { name: "Golden Tours And Travels", phone: "+91 97 91 94 44 22" },
      { name: "Devaki Travels", phone: "+91 413 225 7199" }
    ],
    cost: "₹225-300 (US $3-4)",
    selfDriveCost: "₹150-225 (US $2-3)",
    description: "Puducherry Airport (PNY) is the closest airport, located just 5-6 km from the city center in Lawspet. It primarily serves domestic flights, with regular connections to Bengaluru and Hyderabad. This airport is ideal for travelers coming from South Indian cities or those seeking the shortest transfer to the heart of Pondicherry.",
    mapEmbedUrl: "https://maps.google.com/maps?saddr=Puducherry+Airport&daddr=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=13&hl=en"
  },
  chennaiAirport: {
    name: "Chennai International Airport (MAA)",
    distance: "125-148 km",
    travelTime: "~3-4 hours",
    taxis: [
      { name: "Fast Track Call Taxi", phone: "+91 44 4888 4888" },
      { name: "Ola Outstation", phone: "Ola App" },
      { name: "Uber Intercity", phone: "Uber App" }
    ],
    cost: "₹3000-3500 (US $36-42)",
    busService: "SETC/TNSTC operates AC/Non-AC buses from Chennai Airport to Pondicherry",
    busCost: "₹250-350 (US $3-4.5)",
    description: "Chennai International Airport (MAA) is the nearest major international airport, situated about 125-148 km from Pondicherry. It offers extensive domestic and international connectivity, making it the preferred choice for most travelers flying in from other parts of India or abroad. From Chennai, Pondicherry can be reached by taxi, bus, or train in approximately 3-4 hours.",
    mapEmbedUrl: "https://maps.google.com/maps?saddr=Chennai+International+Airport&daddr=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=10&hl=en"
  },
  trichyAirport: {
    name: "Tiruchirapalli International Airport (TRZ)",
    distance: "~230 km",
    travelTime: "~5 hours",
    taxis: [
      { name: "Trichy Call Taxi", phone: "+91 97 91 45 65 55" },
      { name: "TN Travels", phone: "+91 94 43 22 11 77" }
    ],
    cost: "₹4500-5000 (US $54-60)",
    busService: "SETC operates limited bus services from Trichy to Pondicherry",
    busCost: "₹300-400 (US $4-5)",
    description: "Tiruchirapalli International Airport, also known as Trichy Airport, is another viable option, especially for travelers from southern and central Tamil Nadu or those arriving on select international routes. While farther than Chennai, it can be convenient for certain itineraries, though onward travel to Pondicherry will typically require a longer road journey.",
    mapEmbedUrl: "https://maps.google.com/maps?saddr=Tiruchirapalli+International+Airport&daddr=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=9&hl=en"
  },
  bus: {
    schedule: {
      first: "06:45 AM",
      last: "18:55 PM (6:55 PM)"
    },
    duration: "~30 minutes",
    fare: "Starting from ₹30",
    operator: "KBR Travels (Non-AC Seater 2+2)",
    boardingPoint: "Pondicherry New Bus Stand",
    droppingPoint: "Gorimedu near Pathukannu",
    busStops: [
      { name: "Dr. B.R. Ambedkar Bus Stop", distance: "0.9 km from Koodappakkam" },
      { name: "Koodappakkam Bus Stop", distance: "1.1 km" }
    ],
    mapEmbedUrl: "https://maps.google.com/maps?saddr=Pondicherry+New+Bus+Stand&daddr=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=13&hl=en"
  },
  car: {
    directions: [
      {
        from: "Madurai",
        distance: "336 km (208 miles)",
        time: "5-6 hours",
        route: "Follow NH38 through Trichy, then take NH36 and finally SH203 to reach Koodappakkam"
      }
    ],
    landmark: "Located near Pogo Land in Pathukannu",
    elevation: "6 meters above sea level",
    mapEmbedUrl: "https://maps.google.com/maps?saddr=Pondicherry&daddr=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=13&hl=en"
  },
  train: {
    station: "Puducherry Railway Station",
    options: [
      { mode: "Bus", info: "Local buses available from Puducherry to Pathukannu" },
      { mode: "Auto/Taxi", info: "Available at the railway station for direct transport to the temple" }
    ]
  }
};

// Icon wrapper component for tab triggers
const IconWrapper = ({ 
  children, 
  color
}: { 
  children: React.ReactNode, 
  color: "pink" | "gold" | "blue" 
}) => (
  <div className={`bg-${colors[color].light} p-3 rounded-full mb-2 flex items-center justify-center w-14 h-14 mx-auto`}>
    {children}
  </div>
);

// Reusable Map component with skeleton loading
const MapWithSkeleton = ({ 
  src, 
  isLoading, 
  onLoad, 
  title 
}: { 
  src: string; 
  isLoading: boolean; 
  onLoad: () => void; 
  title: string;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] relative border border-white/20 dark:border-gray-800/20 bg-white/20 dark:bg-gray-800/20 backdrop-filter backdrop-blur-sm">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center space-y-4 z-10">
          <div className="w-[95%] h-[85%] relative">
            <Skeleton className="h-full w-full rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2 
                }}
                className="text-gray-400 dark:text-gray-500"
              >
                <MapPin className="h-8 w-8" />
              </motion.div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        className={cn(
          "w-full h-full border-0 transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        allowFullScreen
        loading="lazy"
        title={title}
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => {
          console.log(`Standard onLoad event fired for ${title}`);
          onLoad();
        }}
      ></iframe>
      
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 5 : 0 }}
        className="absolute bottom-4 right-4 z-20"
      >
        <RippleButton 
          size="sm" 
          className="bg-[#0a84ff] hover:bg-[#0077ed] shadow-lg rounded-full px-5 py-2.5 text-sm text-white dark:text-white"
          onClick={() => window.open(src.replace('output=embed', 'output=svembed'), '_blank')}
          rippleClassName="bg-white/30"
          scale={8}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </RippleButton>
      </motion.div>
    </div>
  );
};

// Quote Slider component
function QuoteSlider({ quotes = prabhupadaQuotes }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const prevQuote = () => {
    setIsTyping(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
      setIsTyping(false);
    }, 500);
  };
  
  const nextQuote = () => {
    setIsTyping(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev === quotes.length - 1 ? 0 : prev + 1));
      setIsTyping(false);
    }, 500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-8"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border border-white/20 dark:border-gray-800/20 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-filter backdrop-blur-xl shadow-xl">
        <CardContent className="p-8 lg:p-10">
          <div className="flex flex-col items-center">
            <div className="mb-8 relative min-h-[180px] w-full flex items-center justify-center">
              <div className="absolute -top-3 -left-3 text-[#e94a9c]/30 dark:text-[#e94a9c]/20">
                <Quote className="h-10 w-10" />
              </div>
              <div className="absolute -bottom-3 -right-3 text-[#e94a9c]/30 dark:text-[#e94a9c]/20 transform rotate-180">
                <Quote className="h-10 w-10" />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {!isTyping && (
                    <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic text-center leading-relaxed px-4 sm:px-10">
                      <span className="whitespace-pre-line">
                        {quotes[currentQuoteIndex].text}
                      </span>
                    </blockquote>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center mb-6 bg-gradient-to-r from-[#e94a9c]/5 to-[#ffc547]/5 p-4 rounded-xl w-full max-w-lg mx-auto">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4 shadow-md border-2 border-white/50 mb-3 sm:mb-0">
                <img 
                  src="/pp/pp1.webp"
                  alt="Srila Prabhupada" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src = "https://i.imgur.com/7PL6ydP.jpg";
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-gray-900 dark:text-white">His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</p>
                <p className="text-sm text-[#0a84ff] mt-1 flex items-center justify-center sm:justify-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0a84ff] mr-2"></span>
                  {quotes[currentQuoteIndex].source}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 w-full mt-2">
              <IconButton 
                icon={ChevronLeft} 
                onClick={prevQuote} 
                className="border border-gray-200 dark:border-gray-700 shadow-sm" 
                color={[233, 74, 156]} /* Pink color */
                size="sm"
              />
              <div className="flex space-x-2">
                {quotes.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      index === currentQuoteIndex 
                      ? "bg-[#e94a9c] scale-125" 
                      : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setCurrentQuoteIndex(index);
                        setIsTyping(false);
                      }, 500);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
              <IconButton 
                icon={ChevronRight} 
                onClick={nextQuote} 
                className="border border-gray-200 dark:border-gray-700 shadow-sm" 
                color={[233, 74, 156]} /* Pink color */
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function VisitUs() {
  // Update mapsLoading state to include trichyAirport
  const [mapsLoading, setMapsLoading] = useState({
    temple: true,
    airport: true,
    chennaiAirport: true,
    trichyAirport: true,
    bus: true,
    car: true
  });

  // Verify map URLs
  const verifyMapUrls = () => {
    console.log('Temple Map URL:', `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.4022259758287!2d79.818114!3d11.948861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5365c6121ae3f1%3A0xc9c3539f6f16d311!2sHare%20Krishna%20Temple%2C%20ISKM%20Pudhuvai%20Vrindavan!5e0!3m2!1sen!2sin!4v1720116775794!5m2!1sen!2sin`);
    console.log('Airport Map URL:', transportationData.airport.mapEmbedUrl);
    console.log('Chennai Airport Map URL:', transportationData.chennaiAirport.mapEmbedUrl);
    console.log('Trichy Airport Map URL:', transportationData.trichyAirport.mapEmbedUrl);
    console.log('Bus Map URL:', transportationData.bus.mapEmbedUrl);
    console.log('Car Map URL:', transportationData.car.mapEmbedUrl);
  };

  // Call once on component load
  useEffect(() => {
    verifyMapUrls();
    
    // Force complete loading after 5 seconds if still loading
    const timer = setTimeout(() => {
      setMapsLoading({
        temple: false,
        airport: false,
        chennaiAirport: false,
        trichyAirport: false,
        bus: false,
        car: false
      });
      console.log("Force-completed map loading after timeout");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update handleMapLoad to log when it's called
  const handleMapLoad = (mapType: 'temple' | 'airport' | 'chennaiAirport' | 'trichyAirport' | 'bus' | 'car') => {
    console.log(`Setting ${mapType} map as loaded`);
    setMapsLoading(prev => ({
      ...prev,
      [mapType]: false
    }));
  };

  // Use tanstack query for data fetching optimization
  const { data: templeData } = useQuery({
    queryKey: ['templeInfo'],
    queryFn: () => Promise.resolve(templeInfo),
    initialData: templeInfo
  });

  const { data: transportData } = useQuery({
    queryKey: ['transportationData'],
    queryFn: () => Promise.resolve(transportationData),
    initialData: transportationData
  });

  // Add query for prabhupadaQuotes
  const { data: quotes } = useQuery({
    queryKey: ['prabhupadaQuotes'],
    queryFn: () => Promise.resolve(prabhupadaQuotes),
    initialData: prabhupadaQuotes
  });

  // Add query for templeEtiquette
  const { data: etiquette } = useQuery({
    queryKey: ['templeEtiquette'],
    queryFn: () => Promise.resolve(templeEtiquette),
  initialData: templeEtiquette
});

  const { isSoundEnabled } = useSoundSettings();
  const [playTabSelectSound] = useSound('/sounds/pop-on.wav', { volume: 0.3, soundEnabled: isSoundEnabled });
  // Add other sounds if needed, e.g., for hover on tabs
  const [playHoverSound] = useSound('/sounds/hover.mp3', { volume: 0.2, soundEnabled: isSoundEnabled });


  const safePlayTabSelect = useCallback(() => {
    if (isSoundEnabled) playTabSelectSound();
  }, [isSoundEnabled, playTabSelectSound]);

  const safePlayHover = useCallback(() => {
    if (isSoundEnabled) playHoverSound();
  }, [isSoundEnabled, playHoverSound]);

  return (
    <TooltipProvider>
      <section 
        className="py-12 md:py-24 relative overflow-visible" 
        // Removed: bg-cover bg-center bg-fixed and style={{ backgroundImage: "url('/temple-building/4.webp')" }}
      >
        {/* Removed: Enhanced background effect with layered blur div */}
        
        <div className="container mx-auto z-10 relative px-4 md:px-6"> {/* Ensure content is still structured if needed, or adjust classes if section itself provides padding/margin */}
          {/* Section Header */}
          <div className="mb-12 md:mb-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto w-fit mb-6"
            >
              <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full shadow-lg">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full p-3">
                  <MapPin className="h-7 w-7 text-[#ffc547] dark:text-[#ffc547]" />
                </div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ffc547] via-[#0a84ff] to-[#e94a9c] text-transparent bg-clip-text"
            >
              <WritingText
                text="Visit Us"
                inView={true}
                spacing={0}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.05
                }}
              />
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
            >
              <TypingText
                text="We invite you to visit our temple and experience spiritual bliss"
                delay={1200}
                duration={50}
                inView={true}
              />
            </motion.p>
          </div>

          {/* Main Content - Integrated Tabbed Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8 px-4 sm:px-0"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border border-white/20 dark:border-gray-800/20 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-filter backdrop-blur-xl shadow-xl">
              <CardContent className="p-5 md:p-8">
                <h3 className="text-xl font-semibold text-center mb-6 bg-gradient-to-r from-[#e94a9c] via-[#0a84ff] to-[#ffc547] text-transparent bg-clip-text">
                  <WritingText
                    text="Plan Your Visit"
                    inView={true}
                    spacing={0}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.05
                    }}
                  />
                </h3>
                
                <Tabs defaultValue="temple" className="w-full" onValueChange={safePlayTabSelect}>
                  <TabsList 
                    className="w-full grid grid-cols-3 sm:grid-cols-6 mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-3 rounded-xl h-auto gap-2"
                    activeClassName="bg-white/70 dark:bg-gray-700/70 backdrop-filter backdrop-blur-xl shadow-md"
                  >
                    <TabsTrigger 
                      value="temple" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="pink">
                        <Home className="h-7 w-7 text-[#e94a9c]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">Temple</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="info" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="gold">
                        <Bookmark className="h-7 w-7 text-[#ffc547]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">Info</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="car" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="blue">
                        <Car className="h-7 w-7 text-[#0a84ff]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">By Car</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="plane" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="pink">
                        <Plane className="h-7 w-7 text-[#e94a9c]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">By Plane</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bus" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="gold">
                        <Bus className="h-7 w-7 text-[#ffc547]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">By Bus</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="train" 
                      className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[110px] hover:bg-white/30 dark:hover:bg-gray-700/30"
                      onMouseEnter={safePlayHover}
                    >
                      <IconWrapper color="blue">
                        <Train className="h-7 w-7 text-[#0a84ff]" />
                      </IconWrapper>
                      <span className="text-sm font-medium">By Train</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Temple Location Tab Content */}
                  <TabsContent value="temple" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="pb-4 pt-2">
                          <h3 className="text-xl font-semibold mb-1 text-[#e94a9c] dark:text-[#e94a9c] flex items-center">
                            <MapPin className="h-5 w-5 mr-2" /> Our Location
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Find us at ISKM Pondicherry
                          </p>
                        </div>
                        
                        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-4 rounded-xl mb-4">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-r from-[#ffc547]/5 to-transparent dark:from-[#ffc547]/10 dark:to-transparent p-4 rounded-xl"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              <strong>Temple Name:</strong> ISKM Pondicherry
                            </p>
                            <div className="mt-3 flex items-center">
                              <div className="p-2 bg-[#e94a9c]/10 rounded-md mr-2">
                                <MapPin className="h-4 w-4 text-[#e94a9c]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{templeData.address}</p>
                              </div>
                            </div>
                          </motion.div>
                          
                          <div className="mt-4 flex items-center justify-end">
                            <a 
                              href={templeData.mapsLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm inline-flex items-center gap-1 text-[#0a84ff] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" /> Open in Google Maps
                            </a>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <div className="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden">
                          {mapsLoading.temple && (
                            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center space-y-4 z-10">
                              <div className="w-[95%] h-[85%] relative">
                                <Skeleton className="h-full w-full rounded-xl" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <motion.div
                                    animate={{ 
                                      scale: [1, 1.2, 1],
                                      opacity: [0.7, 1, 0.7] 
                                    }}
                                    transition={{ 
                                      repeat: Infinity,
                                      duration: 2 
                                    }}
                                    className="text-gray-400 dark:text-gray-500"
                                  >
                                    <MapPin className="h-8 w-8" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <iframe 
                            src={"https://maps.google.com/maps?q=ISKM+Pondicherry,RS+No-54/3,Koodappakkam,Main+Road,Near+Pogo+Land,Pathukannu,Puducherry+605502&output=embed&z=15&hl=en"} 
                            className={cn(
                              "w-full h-full min-h-[350px] border-0 transition-opacity duration-500",
                              mapsLoading.temple ? "opacity-0" : "opacity-100"
                            )}
                            allowFullScreen 
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            onLoad={() => handleMapLoad('temple')}
                          ></iframe>
                          
                          {/* Animated Marker */}
                          <motion.div 
                            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "reverse",
                              duration: 1,
                            }}
                          >
                            <div className="relative">
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#e94a9c]/30 rounded-full animate-ping" />
                              <MapPin className="h-8 w-8 text-[#e94a9c] filter drop-shadow-lg" />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-4 right-4 z-20"
                          >
                            <RippleButton 
                              size="sm" 
                              className="bg-[#0a84ff] hover:bg-[#0077ed] shadow-lg rounded-full px-5 py-2.5 text-sm text-white dark:text-white"
                              onClick={() => window.open(templeData.mapsLink, '_blank')}
                              rippleClassName="bg-white/30"
                              scale={8}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Get Directions
                            </RippleButton>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  {/* Visit Information Tab Content */}
                  <TabsContent value="info" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Address */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 bg-[#e94a9c]/10 h-10 w-10">
                            <AvatarFallback className="bg-transparent">
                              <MapPin className="h-5 w-5 text-[#e94a9c]" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Address</h4>
                              <Tooltip>
                                <TooltipTrigger>
                                  <CopyButton 
                                    variant="ghost" 
                                    size="sm" 
                                    content={templeData.address} 
                                    onCopy={() => {}} 
                                    className="text-[#e94a9c]"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>Copy Address</TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {templeData.address}
                            </p>
                            <a 
                              href={templeData.mapsLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs inline-flex items-center gap-1 text-[#0a84ff] hover:underline mt-2"
                            >
                              <ExternalLink className="h-3 w-3" /> Get Directions
                            </a>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Phone */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 bg-[#ffc547]/10 h-10 w-10">
                            <AvatarFallback className="bg-transparent">
                              <Phone className="h-5 w-5 text-[#ffc547]" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Contact</h4>
                              <Tooltip>
                                <TooltipTrigger>
                                  <CopyButton 
                                    variant="ghost" 
                                    size="sm" 
                                    content={`${templeData.phone}\n${templeData.email}`} 
                                    onCopy={() => {}} 
                                    className="text-[#ffc547]"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>Copy Contact</TooltipContent>
                              </Tooltip>
                            </div>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href={`tel:${templeData.phone}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#0a84ff] dark:hover:text-[#0a84ff] transition-colors">
                                  {templeData.phone}
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Call Now</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href={`mailto:${templeData.email}`} className="text-sm block text-gray-700 dark:text-gray-300 mt-1 hover:text-[#0a84ff] dark:hover:text-[#0a84ff] transition-colors">
                                  {templeData.email}
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Send Email</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Hours */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 bg-[#0a84ff]/10 h-10 w-10">
                            <AvatarFallback className="bg-transparent">
                              <Clock className="h-5 w-5 text-[#0a84ff]" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Temple Hours</h4>
                            {templeData.hours.map((schedule, index) => (
                              <div key={index} className="mb-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{schedule.day}</p>
                                <p className="text-sm font-medium text-[#e94a9c]">{schedule.hours}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Temple Etiquette */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="mt-5 bg-gradient-to-r from-[#e94a9c]/10 to-[#e94a9c]/5 dark:from-[#e94a9c]/15 dark:to-[#e94a9c]/5 p-5 rounded-xl border border-[#e94a9c]/10"
                    >
                      <h4 className="font-medium text-[#e94a9c] mb-3 flex items-center">
                        <Info className="h-5 w-5 mr-2" /> Temple Etiquette
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {etiquette.map((item, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -5 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg"
                          >
                            <div className="flex items-start">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: index }}
                                className="text-[#e94a9c] mr-2 mt-0.5"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </motion.div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <div className="mt-6 flex justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full max-w-md mx-auto"
                          >
                            <RippleButton
                              className="w-full bg-gradient-to-r from-[#0a84ff] to-[#e94a9c] hover:from-[#0077ed] hover:to-[#d3428c] rounded-full h-12 font-medium text-white dark:text-white shadow-md transition-all"
                              rippleClassName="bg-white/30"
                              scale={12}
                            >
                              <Calendar className="mr-2 h-5 w-5" /> Schedule a Visit
                            </RippleButton>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent 
                          className="sm:max-w-[425px] bg-white/90 dark:bg-gray-900/90 backdrop-filter backdrop-blur-xl border-0 rounded-2xl shadow-xl"
                          from="bottom"
                        >
                          <DialogHeader>
                            <DialogTitle className="text-[#e94a9c]">Schedule Your Visit</DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              We are excited to welcome you! Please provide some details for your visit.
                              (Form functionality to be implemented)
                            </DialogDescription>
                          </DialogHeader>
                          {/* Placeholder for form or more info */}
                          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                            <p>Further details and form will be here.</p>
                            <p>Contact us at {templeData.phone} for immediate assistance.</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                  
                  {/* Car Tab Content - Keep existing content */}
                  <TabsContent value="car" className="mt-6">
                    {/* Existing car tab content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="bg-gradient-to-r from-[#ffc547]/5 to-transparent dark:from-[#ffc547]/10 dark:to-transparent p-5 rounded-2xl border border-[#ffc547]/10"
                        >
                          <h4 className="flex items-center font-medium text-[#ffc547] mb-3">
                            <Car className="mr-2 h-5 w-5" /> Driving Directions
                          </h4>
                          
                          {transportData.car.directions.map((direction, index) => (
                            <div key={index} className="mb-4 bg-white/40 dark:bg-gray-800/40 backdrop-filter backdrop-blur-sm p-4 rounded-xl shadow-sm">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#ffc547]" /> From {direction.from}
                              </h5>
                              <div className="mt-2 space-y-1 flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-700/50 text-xs font-normal backdrop-blur-sm">
                                  Distance: {direction.distance}
                                </Badge>
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-700/50 text-xs font-normal backdrop-blur-sm">
                                  Travel Time: {direction.time}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{direction.route}</p>
                            </div>
                          ))}
                        
                          <div className="mt-6 bg-white/40 dark:bg-gray-800/40 backdrop-filter backdrop-blur-sm p-4 rounded-xl shadow-sm">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#e94a9c]" /> Key Landmarks
                            </h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{transportData.car.landmark}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Elevation: {transportData.car.elevation}</p>
                          
                            <div className="mt-4">
                              <h5 className="text-xs font-medium text-gray-900 dark:text-white mb-1">Parking Information</h5>
                              <p className="text-xs text-gray-700 dark:text-gray-300">Free parking available at the temple premises</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <MapWithSkeleton 
                          src={transportData.car.mapEmbedUrl}
                          isLoading={mapsLoading.car}
                          onLoad={() => handleMapLoad('car')}
                          title="Driving Directions to Temple"
                        />
                      </motion.div>
                    </div>
                    {/* Debug indicator */}
                    <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-2 rounded text-center">
                      Map loading state: {mapsLoading.car ? "Loading..." : "Loaded"}
                    </div>
                  </TabsContent>
                  
                  {/* Keep other existing tab contents (Plane, Bus, Train) */}
                  {/* Plane Tab Content */}
                  <TabsContent value="plane" className="mt-6">
                    <AnimatePresence mode="wait">
                      <Tabs defaultValue="puducherry" className="w-full">
                        <div className="flex justify-center mb-5">
                          <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-xl w-full max-w-2xl">
                            <TabsTrigger 
                              value="puducherry" 
                              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-lg px-3 py-2.5 text-sm flex-1 touch-manipulation"
                            >
                              Puducherry Airport
                            </TabsTrigger>
                            <TabsTrigger 
                              value="chennai" 
                              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-lg px-3 py-2.5 text-sm flex-1 touch-manipulation"
                            >
                              Chennai Airport
                            </TabsTrigger>
                            <TabsTrigger 
                              value="trichy" 
                              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-lg px-3 py-2.5 text-sm flex-1 touch-manipulation"
                            >
                              Trichy Airport
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        
                        <TabsContent value="puducherry">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
                          >
                            {/* Column 1: Airport Info */}
                            <div className="space-y-4">
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-gradient-to-r from-[#e94a9c]/5 to-transparent dark:from-[#e94a9c]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#e94a9c] mb-3">
                                  <Plane className="mr-2 h-5 w-5" /> {transportData.airport.name}
                                </h4>
                                  
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <MapPin className="h-3 w-3 mr-1" /> {transportData.airport.distance}
                                  </Badge>
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <Clock className="h-3 w-3 mr-1" /> {transportData.airport.travelTime}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                  {transportData.airport.description}
                                </p>
                                  
                                <div className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg mt-3">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Transportation Costs</h5>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Taxi</p>
                                      <p className="text-sm font-medium">{transportData.airport.cost}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Self-Drive</p>
                                      <p className="text-sm font-medium">{transportData.airport.selfDriveCost}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                                
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-gradient-to-r from-[#0a84ff]/5 to-transparent dark:from-[#0a84ff]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#0a84ff] mb-3">
                                  <Phone className="mr-2 h-5 w-5" /> Taxi Services
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {transportData.airport.taxis.map((taxi, index) => (
                                    <div key={index} className="flex items-start bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback className="bg-[#0a84ff]/10 text-[#0a84ff]">
                                          <Phone className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{taxi.name}</p>
                                        <a 
                                          href={`tel:${taxi.phone}`} 
                                          className="text-xs text-[#0a84ff] hover:underline flex items-center mt-1"
                                        >
                                          <Phone className="h-3 w-3 mr-1" />
                                          {taxi.phone}
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                            {/* Column 2: Map */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                              <MapWithSkeleton 
                                src={transportData.airport.mapEmbedUrl}
                                isLoading={mapsLoading.airport}
                                onLoad={() => handleMapLoad('airport')}
                                title="Puducherry Airport to Temple Route"
                              />
                              {/* Debug indicator */}
                              <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-2 rounded text-center">
                                Map loading state: {mapsLoading.airport ? "Loading..." : "Loaded"}
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="chennai">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
                          >
                            {/* Column 1: Chennai Airport Info */}
                            <div className="space-y-4">
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-gradient-to-r from-[#e94a9c]/5 to-transparent dark:from-[#e94a9c]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#e94a9c] mb-3">
                                  <Plane className="mr-2 h-5 w-5" /> {transportData.chennaiAirport.name}
                                </h4>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <MapPin className="h-3 w-3 mr-1" /> {transportData.chennaiAirport.distance}
                                  </Badge>
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <Clock className="h-3 w-3 mr-1" /> {transportData.chennaiAirport.travelTime}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                  {transportData.chennaiAirport.description}
                                </p>
                                
                                <div className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg mt-3">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Transportation Options</h5>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Taxi</p>
                                      <p className="text-sm font-medium">{transportData.chennaiAirport.cost}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Bus</p>
                                      <p className="text-sm font-medium">{transportData.chennaiAirport.busCost}</p>
                                    </div>
                                  </div>
                                  <div className="mt-2 p-2 bg-[#0a84ff]/5 rounded-lg">
                                    <p className="text-xs">{transportData.chennaiAirport.busService}</p>
                                  </div>
                                </div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-gradient-to-r from-[#0a84ff]/5 to-transparent dark:from-[#0a84ff]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#0a84ff] mb-3">
                                  <Phone className="mr-2 h-5 w-5" /> Taxi Services
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {transportData.chennaiAirport.taxis.map((taxi, index) => (
                                    <div key={index} className="flex items-start bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback className="bg-[#0a84ff]/10 text-[#0a84ff]">
                                          <Phone className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{taxi.name}</p>
                                        <p className="text-xs text-[#0a84ff] mt-1">
                                          {taxi.phone}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                            {/* Column 2: Map */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                              <MapWithSkeleton 
                                src={transportData.chennaiAirport.mapEmbedUrl}
                                isLoading={mapsLoading.chennaiAirport}
                                onLoad={() => handleMapLoad('chennaiAirport')}
                                title="Chennai Airport to Temple Route"
                              />
                              {/* Debug indicator */}
                              <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-2 rounded text-center">
                                Map loading state: {mapsLoading.chennaiAirport ? "Loading..." : "Loaded"}
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>

                        <TabsContent value="trichy">
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
                          >
                            {/* Column 1: Trichy Airport Info */}
                            <div className="space-y-4">
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-gradient-to-r from-[#e94a9c]/5 to-transparent dark:from-[#e94a9c]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#e94a9c] mb-3">
                                  <Plane className="mr-2 h-5 w-5" /> {transportData.trichyAirport.name}
                                </h4>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <MapPin className="h-3 w-3 mr-1" /> {transportData.trichyAirport.distance}
                                  </Badge>
                                  <Badge variant="outline" className="bg-[#e94a9c]/10 border-[#e94a9c]/20 text-[#e94a9c]">
                                    <Clock className="h-3 w-3 mr-1" /> {transportData.trichyAirport.travelTime}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                  {transportData.trichyAirport.description}
                                </p>
                                
                                <div className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg mt-3">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Transportation Options</h5>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Taxi</p>
                                      <p className="text-sm font-medium">{transportData.trichyAirport.cost}</p>
                                    </div>
                                    <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Bus</p>
                                      <p className="text-sm font-medium">{transportData.trichyAirport.busCost}</p>
                                    </div>
                                  </div>
                                  <div className="mt-2 p-2 bg-[#0a84ff]/5 rounded-lg">
                                    <p className="text-xs">{transportData.trichyAirport.busService}</p>
                                  </div>
                                </div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-gradient-to-r from-[#0a84ff]/5 to-transparent dark:from-[#0a84ff]/10 dark:to-transparent p-5 rounded-xl"
                              >
                                <h4 className="flex items-center font-medium text-[#0a84ff] mb-3">
                                  <Phone className="mr-2 h-5 w-5" /> Taxi Services
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {transportData.trichyAirport.taxis.map((taxi, index) => (
                                    <div key={index} className="flex items-start bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback className="bg-[#0a84ff]/10 text-[#0a84ff]">
                                          <Phone className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{taxi.name}</p>
                                        <p className="text-xs text-[#0a84ff] mt-1">
                                          {taxi.phone}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                            {/* Column 2: Map */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                            >
                              <MapWithSkeleton 
                                src={transportData.trichyAirport.mapEmbedUrl}
                                isLoading={mapsLoading.trichyAirport}
                                onLoad={() => handleMapLoad('trichyAirport')}
                                title="Tiruchirapalli Airport to Temple Route"
                              />
                              {/* Debug indicator */}
                              <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-2 rounded text-center">
                                Map loading state: {mapsLoading.trichyAirport ? "Loading..." : "Loaded"}
                              </div>
                            </motion.div>
                          </motion.div>
                        </TabsContent>
                      </Tabs>
                    </AnimatePresence>
                  </TabsContent>
                  
                  {/* Bus Tab Content */}
                  <TabsContent value="bus" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      {/* Column 1: Bus Info */}
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="bg-gradient-to-r from-[#0a84ff]/5 to-transparent dark:from-[#0a84ff]/10 dark:to-transparent p-5 rounded-xl"
                        >
                          <h4 className="flex items-center font-medium text-[#0a84ff] mb-3">
                            <Bus className="mr-2 h-5 w-5" /> Bus Schedule & Details
                          </h4>
                          
                          <div className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg mb-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">First Bus</p>
                                <p className="text-sm font-medium">{transportData.bus.schedule.first}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Last Bus</p>
                                <p className="text-sm font-medium">{transportData.bus.schedule.last}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Journey Duration</p>
                                <p className="text-sm font-medium">{transportData.bus.duration}</p>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Fare</p>
                                <p className="text-sm font-medium">{transportData.bus.fare}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 p-2 bg-[#0a84ff]/10 rounded-lg">
                              <p className="text-xs font-medium text-gray-900 dark:text-white">Operator</p>
                              <p className="text-sm">{transportData.bus.operator}</p>
                            </div>
                          </div>
                        </motion.div>
                      
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="bg-gradient-to-r from-[#ffc547]/5 to-transparent dark:from-[#ffc547]/10 dark:to-transparent p-5 rounded-xl"
                        >
                          <h4 className="flex items-center font-medium text-[#ffc547] mb-3">
                            <MapPin className="mr-2 h-5 w-5" /> Bus Stops
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                              <Avatar className="h-9 w-9 mr-3">
                                <AvatarFallback className="bg-[#0a84ff]/10 text-[#0a84ff]">
                                  <Bus className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Boarding Point</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{transportData.bus.boardingPoint}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                              <Avatar className="h-9 w-9 mr-3">
                                <AvatarFallback className="bg-[#ffc547]/10 text-[#ffc547]">
                                  <MapPin className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Dropping Point</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{transportData.bus.droppingPoint}</p>
                              </div>
                            </div>
                            
                            <div className="bg-white/30 dark:bg-gray-800/30 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Nearby Bus Stops</p>
                              <div className="space-y-2">
                                {transportData.bus.busStops.map((stop, index) => (
                                  <div key={index} className="flex items-center bg-white/50 dark:bg-gray-700/50 p-2 rounded-lg">
                                    <div className="h-6 w-6 rounded-full bg-[#e94a9c]/10 flex items-center justify-center mr-2">
                                      <span className="text-xs font-medium text-[#e94a9c]">{index + 1}</span>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium">{stop.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{stop.distance}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    
                      {/* Column 2: Map */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <MapWithSkeleton 
                          src={transportData.bus.mapEmbedUrl}
                          isLoading={mapsLoading.bus}
                          onLoad={() => handleMapLoad('bus')}
                          title="Bus Stand to Temple Route"
                        />
                        {/* Debug indicator */}
                        <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-2 rounded text-center">
                          Map loading state: {mapsLoading.bus ? "Loading..." : "Loaded"}
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  {/* Train Tab Content */}
                  <TabsContent value="train" className="mt-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gradient-to-r from-[#0a84ff]/5 to-transparent dark:from-[#0a84ff]/10 dark:to-transparent p-5 rounded-xl"
                    >
                      <h4 className="flex items-center font-medium text-[#0a84ff] mb-5">
                        <Train className="mr-2 h-5 w-5" /> {transportData.train.station}
                      </h4>
                      
                      <div className="bg-white/30 dark:bg-gray-800/30 p-4 rounded-lg mb-5">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          The Puducherry Railway Station is the major railway hub serving the region, with connections to major cities across India.
                        </p>
                      
                        <div className="flex items-center mt-4 bg-[#ffc547]/10 p-3 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-[#ffc547] mr-2 flex-shrink-0" />
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            For train schedules and bookings, please visit the <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="text-[#0a84ff] hover:underline">Indian Railways website</a>.
                          </p>
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <Car className="h-4 w-4 mr-1.5 text-[#e94a9c]" /> Transportation from Railway Station to Temple
                      </h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {transportData.train.options.map((option, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white/30 dark:bg-gray-800/30 p-4 rounded-xl flex items-start"
                          >
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className={`bg-${index === 0 ? '[#e94a9c]' : '[#ffc547]'}/10 text-${index === 0 ? '[#e94a9c]' : '[#ffc547]'}`}>
                                {index === 0 ? (
                                  <Bus className="h-5 w-5" />
                                ) : (
                                  <Car className="h-5 w-5" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{option.mode}</p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{option.info}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Quick Info Popover */}
                  <div className="flex justify-center mt-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <RippleButton variant="outline" className="rounded-full border-dashed border-[#0a84ff] text-[#0a84ff] hover:bg-[#0a84ff]/5">
                          <Info className="mr-2 h-4 w-4" />
                          Transportation Tips
                        </RippleButton>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl rounded-xl p-5">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-[#e94a9c]">Transportation Tips</h4>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Best Time to Visit</h5>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              Early mornings (4:30 AM - 8:00 AM) and evenings (4:30 PM - 6:30 PM) are ideal for darshan and temple activities.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Local Transportation</h5>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              Auto rickshaws are readily available in Puducherry. Ensure to confirm the fare before boarding.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Special Occasions</h5>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              During festivals, temple provides special transportation arrangements. Check the temple website for details.
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Prabhupada Quote Section - Make sure it uses the quotes data */}
          <div className="px-4 sm:px-0">
            <QuoteSlider quotes={quotes} />
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
