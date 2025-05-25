import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Youtube,
  Facebook,
  MessageCircle
} from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTempleStatus } from '@/hooks/useTempleStatus'; // Added

interface DeityDarshanProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DeityInfo = {
  id: string
  name: string
  images: string[]
  description: string
  significance: string
  liveStream?: {
    available: boolean
    url?: string
  }
  socialLinks?: {
    youtube?: string
    facebook?: string
    telegram?: string
  }
}

// Memoize static data
const AARATI_TIMINGS = [
  { name: "Mangal Aarati", time: "4:30 AM" },
  { name: "Darshan Aarati", time: "7:15 AM" },
  { name: "Afternoon Closing", time: "12:00 PM" },
  { name: "Gaura Arati", time: "5:30 PM" },
  { name: "Evening Closing", time: "8:30 PM" }
];

// Information about each deity
const deitiesInfo: DeityInfo[] = [
  {
    id: "jagannath",
    name: "Lord Jagannath, Baladeva & Subhadra",
    images: [
      "/deity/deites2.webp?w=560&h=560&fit=crop&format=webp", 
      "/deity/deites6.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites9.webp?w=560&h=560&fit=crop&format=webp"
    ],
    description: "Lord Jagannath ('Lord of the Universe') is a form of Lord Krishna. Together with His brother Baladeva (Balarama) and sister Subhadra, these distinctive wooden deities are characterized by their large round eyes and colorful appearance. Originally from Jagannath Puri in Odisha, they embody the Supreme Lord's accessible and merciful nature.",
    significance: "\"When the Lord descends, He does so in His original spiritual form. But those who are accustomed to seeing things with material vision think that the Lord has a material body like us. For the spiritual form of the Lord can never be seen by material vision. The Lord, along with His associate Baladeva and Subhadra devi, is visible on the altar of the temple.\" (Srila Prabhupada, Jagannatha lectures)",
    liveStream: {
      available: true,
      url: "https://www.youtube.com/@ISKMPondy"
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  },
  {
    id: "radha-krishna",
    name: "Sri Sri Radha-Krishna",
    images: [
      "/deity/deites3.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites7.webp?w=560&h=560&fit=crop&format=webp", 
      "/deity/deites10.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites13.webp?w=560&h=560&fit=crop&format=webp"
    ],
    description: "Radha and Krishna represent the divine couple whose pastimes reveal the most exalted spiritual exchanges. Sri Radha is the supreme goddess and Krishna's eternal consort, the personification of the Lord's pleasure potency. Their relationship symbolizes the perfect union of the Divine and His devotees.",
    significance: "\"Krishna's first expansion is Balarama, who expands His pleasure potency. Radharani is Krishna's pleasure potency, and in order to understand Krishna, one must take shelter of Radharani. Krishna is the Supreme Person, and similarly Radharani is the supreme pleasure potency of Krishna. If one wants to understand Krishna, one must also understand Radharani.\" (Srila Prabhupada, Teachings of Lord Chaitanya)",
    liveStream: {
      available: true,
      url: "https://www.youtube.com/@ISKMPondy"
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  },
  {
    id: "gauranitai",
    name: "Sri Sri Gaura-Nitai",
    images: [
      "/deity/deites4.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites11.webp?w=560&h=560&fit=crop&format=webp"
    ],
    description: "Sri Chaitanya Mahaprabhu (Gaura) and Sri Nityananda Prabhu (Nitai) appeared in Bengal, India in the late 15th century. They are considered the most merciful incarnations of Krishna and Balarama, who came specifically to deliver fallen souls in this age of Kali through the chanting of the holy names.",
    significance: "\"Lord Chaitanya Mahaprabhu and Lord Nityananda Prabhu, who are Gaura-Nitai, are most magnanimous, for They are distributing love of Krishna free of charge all over the world... If we want to be engaged in Krishna conscious activities, we must worship Gaura-Nitai.\" (Srila Prabhupada, Chaitanya Charitamrita, Adi-lila 8.31, Purport)",
    liveStream: {
      available: true,
      url: "https://www.youtube.com/@ISKMPondy"
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  },
  {
    id: "govardhana",
    name: "Govardhana Shila",
    images: [
      "/deity/deites5.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites14.webp?w=560&h=560&fit=crop&format=webp",
      "/deity/deites8.webp?w=560&h=560&fit=crop&format=webp"
    ],
    description: "Govardhana Hill is worshipped in the form of sacred stones (shila) that represent Krishna Himself. When Lord Krishna lifted Govardhana Hill to protect the residents of Vrindavana from a devastating storm sent by Indra, the hill became a direct manifestation of the Lord. These sacred stones are non-different from Krishna.",
    significance: "\"When Krishna lifted Govardhana Hill, it assumed the shape of a huge umbrella, and it was kept upright by the strength of Kṛṣṇa's little finger for seven days continuously... Therefore Govardhana-pūjā, worship of Govardhana Hill, was initiated and is still going on.\" (Srila Prabhupada, Krishna Book, Chapter 25)",
    liveStream: {
      available: false
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  },
  {
    id: "srila-prabhupada",
    name: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada",
    images: [
      "/deity/deites12.webp?w=560&h=560&fit=crop&format=webp"
    ],
    description: "Srila Prabhupada is the founder-acharya of the International Society for Krishna Consciousness (ISKCON). At the age of 69, he journeyed to America in 1965 to fulfill his spiritual master's instruction to spread Krishna consciousness in the Western world. In just 12 years, he established 108 temples worldwide, wrote more than 70 books, and initiated thousands of disciples.",
    significance: "\"Our duty is to follow the instructions of Srila Prabhupada. That's all. Then our life will be successful. Don't try to become over-intelligent. That will not be helpful. Be faithful, be submissive, and follow strictly what Prabhupada has given us.\" (Srila Prabhupada, Lecture on Bhagavad-gita 2.11, Feb 27, 1973)",
    liveStream: {
      available: false
    },
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  }
];

// Memoized image components
const DeityImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain" 
    loading="lazy"
    fetchPriority="high"
  />
));

DeityImage.displayName = 'DeityImage';

// Memoized Deity Selection Tab
const DeityTab = memo(({ 
  deity, 
  isSelected, 
  onClick 
}: { 
  deity: DeityInfo; 
  isSelected: boolean; 
  onClick: () => void
}) => {
  // Mapping of deity ids to display names
  const nameMap: Record<string, string> = {
    "jagannath": "Lord Jagannath",
    "radha-krishna": "Sri Sri Radha-Krishna",
    "gauranitai": "Sri Sri Gaura-Nitai",
    "govardhana": "Govardhana Shila",
    "srila-prabhupada": "His Divine Grace"
  };

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={cn(
        "text-xs sm:text-sm rounded-full px-3 py-1 whitespace-nowrap",
        isSelected 
          ? "bg-gradient-to-r from-[#e94a9c] to-[#ffc547] text-white border-none" 
          : "border-gray-200 dark:border-gray-800"
      )}
      onClick={onClick}
    >
      {nameMap[deity.id]}
    </Button>
  );
});

DeityTab.displayName = 'DeityTab';

const AaratiTimingItem = memo(({ name, time }: { name: string; time: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium">{name}</span>
    <span className="text-sm text-[#0a84ff] font-medium">{time}</span>
  </div>
));

AaratiTimingItem.displayName = 'AaratiTimingItem';

// Main component with optimized rendering
export function DeityDarshan({ open, onOpenChange }: DeityDarshanProps) {
  const [selectedDeity, setSelectedDeity] = useState<DeityInfo>(deitiesInfo[0])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAaratiPopoverOpen, setIsAaratiPopoverOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const templeStatus = useTempleStatus(); // Added
  
  // Use React Query to fetch and cache the deities info
  const { data: deities } = useQuery({
    queryKey: ['deitiesInfo'],
    queryFn: async () => deitiesInfo,
    staleTime: Infinity
  })

  // Reset current image index when deity changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedDeity])

  // Memoized autoplay function to prevent recreating on each render
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    
    autoplayTimerRef.current = setTimeout(() => {
      if (selectedDeity) {
        setCurrentImageIndex((prev) => 
          prev === selectedDeity.images.length - 1 ? 0 : prev + 1
        )
      }
      startAutoplay(); // Loop
    }, 5000);
  }, [selectedDeity]);

  // Set up autoplay for carousel with cleanup
  useEffect(() => {
    if (!open) {
      // Clear timer when drawer is closed
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    startAutoplay();

    // Use document visibility to pause autoplay when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayTimerRef.current) {
          clearTimeout(autoplayTimerRef.current);
          autoplayTimerRef.current = null;
        }
      } else {
        startAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [open, startAutoplay]);

  // Touch handlers for carousel
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!selectedDeity) return
    
    if (touchStart - touchEnd > 50) {
      // Swipe left - go to next
      setCurrentImageIndex((prev) => 
        prev === selectedDeity.images.length - 1 ? 0 : prev + 1
      )
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right - go to previous
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedDeity.images.length - 1 : prev - 1
      )
    }

    setTouchStart(0)
    setTouchEnd(0)
  }, [selectedDeity, touchStart, touchEnd]);

  const nextImage = useCallback(() => {
    if (!selectedDeity) return
    setCurrentImageIndex((prev) => 
      prev === selectedDeity.images.length - 1 ? 0 : prev + 1
    )
    
    // Reset autoplay timer when manually changing image
    if (open && autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      startAutoplay();
    }
  }, [selectedDeity, open, startAutoplay]);

  const prevImage = useCallback(() => {
    if (!selectedDeity) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedDeity.images.length - 1 : prev - 1
    )
    
    // Reset autoplay timer when manually changing image
    if (open && autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      startAutoplay();
    }
  }, [selectedDeity, open, startAutoplay]);

  // Memoize the selection of a deity to avoid unnecessary re-renders
  const handleSelectDeity = useCallback((deity: DeityInfo) => {
    setSelectedDeity(deity);
  }, []);

  // Memoize the content to avoid unnecessary re-renders
  const renderDeityContent = useMemo(() => {
    if (!selectedDeity) return null;
    
    return (
      <>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`title-${selectedDeity.id}`}
          className="text-xl sm:text-2xl font-semibold text-[#0a84ff] dark:text-[#0a84ff]"
        >
          {selectedDeity.name}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={`desc-${selectedDeity.id}`}
          className="mb-4"
        >
          <h4 className="text-lg font-medium text-[#e94a9c] dark:text-[#e94a9c] mb-2">About</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {selectedDeity.description}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          key={`sig-${selectedDeity.id}`}
        >
          <h4 className="text-lg font-medium text-[#ffc547] dark:text-[#ffc547] mb-2">Significance</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {selectedDeity.significance}
          </p>
        </motion.div>
      </>
    );
  }, [selectedDeity]);

  // Early return if data is not available yet
  if (!deities) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] md:h-[90vh] max-h-[90vh] overflow-hidden">
        <div className="mx-auto w-full max-w-5xl flex flex-col h-full">
          <DrawerHeader className="px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] p-0.5 rounded-full">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#ffc547]"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M17 7.8C17 5.7 15.3 4 13.2 4c-1.7 0-3.1 1.3-3.3 3H7.7C7.3 5.3 5.8 4 4 4c-2.1 0-3.8 1.7-3.8 3.8 0 1.7 1.3 3.1 3 3.3v2.6c-1.3.4-2.3 1.7-2.3 3.2 0 1.9 1.5 3.4 3.4 3.4.9 0 1.7-.4 2.3-.9l2.6 2.6c-.5.6-.9 1.4-.9 2.3 0 1.9 1.5 3.4 3.4 3.4 1.9 0 3.4-1.5 3.4-3.4 0-1.5-1-2.8-2.3-3.2v-2.6c1.3-.4 2.3-1.7 2.3-3.2 0-.9-.4-1.7-.9-2.3l2.6-2.6c.6.5 1.4.9 2.3.9 1.9 0 3.4-1.5 3.4-3.4 0-1.5-1-2.8-2.3-3.2V7.8z"/>
                    </svg>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text">
                  Deity Darshan
                </span>
              </DrawerTitle>

              {/* Aarati Timings Popover with Pulse Effect */}
              <Popover open={isAaratiPopoverOpen} onOpenChange={setIsAaratiPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "relative rounded-full p-1.5 transition-colors",
                      templeStatus.label === "Darshan" || templeStatus.label === "Aarati" 
                        ? "hover:bg-green-100/50 dark:hover:bg-green-800/50" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-label="Aarati Timings"
                  >
                    <Clock className={cn(
                      "h-5 w-5",
                      templeStatus.label === "Darshan" ? "text-green-500 dark:text-green-400" :
                      templeStatus.label === "Aarati" ? "text-pink-500 dark:text-pink-400" :
                      templeStatus.label === "Closed" ? "text-red-500 dark:text-red-400" :
                      "text-gray-500 dark:text-gray-400" // Default for Loading, N/A, Error
                    )} />
                    {/* Pulse Effect - show for Aarati or Darshan Open */}
                    {(templeStatus.label === "Aarati" || templeStatus.label === "Darshan") && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          templeStatus.label === "Aarati" ? "bg-pink-400 dark:bg-pink-500" : "bg-green-400 dark:bg-green-500"
                        )}></span>
                        <span className={cn(
                          "relative inline-flex rounded-full h-3 w-3",
                          templeStatus.label === "Aarati" ? "bg-pink-500 dark:bg-pink-600" : "bg-green-500 dark:bg-green-600"
                        )}></span>
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 p-0 rounded-xl border-0 shadow-lg"
                  sideOffset={5}
                >
                  <div className={cn(
                    "p-3 rounded-t-xl flex items-center gap-2",
                    templeStatus.label === "Darshan" ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                    templeStatus.label === "Aarati" ? "bg-gradient-to-r from-pink-500 to-rose-600" :
                    templeStatus.label === "Closed" ? "bg-gradient-to-r from-red-500 to-orange-600" :
                    "bg-gradient-to-r from-gray-500 to-slate-600" // Default
                  )}>
                    <Clock className="h-4 w-4 text-white" /> 
                    <h3 className="font-semibold text-white">
                       Temple Aarati Timings
                    </h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {AARATI_TIMINGS.map((aarati, index) => (
                      <AaratiTimingItem 
                        key={index} 
                        name={aarati.name} 
                        time={aarati.time} 
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <DrawerDescription>
              Experience daily darshan of the temple deities
            </DrawerDescription>
          </DrawerHeader>

          {/* Deity Selection Tabs */}
          <div className="flex overflow-x-auto gap-2 px-4 md:px-6 pb-4">
            {deities.map((deity) => (
              <DeityTab 
                key={deity.id} 
                deity={deity} 
                isSelected={selectedDeity.id === deity.id} 
                onClick={() => handleSelectDeity(deity)} 
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column - Carousel */}
              <div className="space-y-4">
                {/* Carousel */}
                <div 
                  ref={carouselRef}
                  className="relative rounded-xl overflow-hidden aspect-square md:aspect-[4/3] bg-black/5 dark:bg-white/5"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    {selectedDeity && (templeStatus.label === "Darshan" || templeStatus.label === "Aarati") ? (
                      <motion.div
                        key={`${selectedDeity.id}-${currentImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <DeityImage 
                          src={selectedDeity.images[currentImageIndex]} 
                          alt={selectedDeity.name}
                        />
                      </motion.div>
                    ) : (
                      // Placeholder when Darshan is closed
                      <motion.div
                        key={`darshan-closed-${selectedDeity?.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gray-100/50 dark:bg-gray-800/50 rounded-xl"
                      >
                        <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          Darshan is Currently Closed
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {templeStatus.detailedText.includes("reopens") || templeStatus.detailedText.includes("at") 
                            ? templeStatus.detailedText 
                            : "Please check back during Darshan hours."}
                        </p>
                        {selectedDeity?.liveStream?.available && (
                           <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                             Live stream is available during Darshan and Aarati times.
                           </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Navigation Arrows - Only show if images are displayed */}
                  {(templeStatus.label === "Darshan" || templeStatus.label === "Aarati") && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Dots Indicator - Only show if images are displayed */}
                  {selectedDeity && selectedDeity.images.length > 1 && (templeStatus.label === "Darshan" || templeStatus.label === "Aarati") && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      {selectedDeity.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'bg-white w-4'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Live Stream Badge - Conditional on temple status */}
                  {selectedDeity && selectedDeity.liveStream?.available && (templeStatus.label === "Darshan" || templeStatus.label === "Aarati") && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 p-1 pl-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-xs">LIVE</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Information */}
              <div className="space-y-4">
                {renderDeityContent}
              </div>
            </div>
          </div>

          {/* Footer with social media buttons */}
          <DrawerFooter className="px-4 sm:px-6 border-t flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {/* YouTube button - conditional on livestream available AND temple status */}
              {selectedDeity?.liveStream?.available && (templeStatus.label === "Darshan" || templeStatus.label === "Aarati") && (
                <a 
                  href={selectedDeity.liveStream?.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    variant="destructive" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Youtube className="mr-2 h-4 w-4" /> Watch Live Darshan
                  </Button>
                </a>
              )}
              
              {/* Social Media Buttons */}
              <div className="flex gap-2 flex-1">
                {selectedDeity?.socialLinks?.facebook && (
                  <a 
                    href={selectedDeity.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline"
                      className="w-full border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/10"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Facebook</span>
                    </Button>
                  </a>
                )}
                
                {selectedDeity?.socialLinks?.telegram && (
                  <a 
                    href={selectedDeity.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline"
                      className="w-full border-[#0088CC] text-[#0088CC] hover:bg-[#0088CC]/10"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Telegram</span>
                    </Button>
                  </a>
                )}
              </div>
              
              {/* Close Button */}
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
