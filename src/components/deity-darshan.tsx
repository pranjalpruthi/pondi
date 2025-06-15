import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Facebook,
  MessageCircle,
  Sparkles // Added for header
  // XIcon removed as full screen view is removed
} from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react"
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
import { useTempleStatus } from '@/hooks/useTempleStatus';

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
  { name: "Evening Closing", time: "6:30 PM" }
];

const deitiesInfo: DeityInfo[] = [
  {
    id: "jagannath",
    name: "Lord Jagannath, Baladeva & Subhadra",
    images: [
      "/deity/deites2.webp?w=800&h=800&fit=crop&format=webp", 
      "/deity/deites6.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites9.webp?w=800&h=800&fit=crop&format=webp"
    ],
    description: "Lord Jagannath ('Lord of the Universe') is a form of Lord Krishna. Together with His brother Baladeva (Balarama) and sister Subhadra, these distinctive wooden deities are characterized by their large round eyes and colorful appearance. Originally from Jagannath Puri in Odisha, they embody the Supreme Lord's accessible and merciful nature.",
    significance: "\"When the Lord descends, He does so in His original spiritual form. But those who are accustomed to seeing things with material vision think that the Lord has a material body like us. For the spiritual form of the Lord can never be seen by material vision. The Lord, along with His associate Baladeva and Subhadra devi, is visible on the altar of the temple.\" (Srila Prabhupada, Jagannatha lectures)",
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
      "/deity/deites3.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites7.webp?w=800&h=800&fit=crop&format=webp", 
      "/deity/deites10.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites13.webp?w=800&h=800&fit=crop&format=webp"
    ],
    description: "Radha and Krishna represent the divine couple whose pastimes reveal the most exalted spiritual exchanges. Sri Radha is the supreme goddess and Krishna's eternal consort, the personification of the Lord's pleasure potency. Their relationship symbolizes the perfect union of the Divine and His devotees.",
    significance: "\"Krishna's first expansion is Balarama, who expands His pleasure potency. Radharani is Krishna's pleasure potency, and in order to understand Krishna, one must take shelter of Radharani. Krishna is the Supreme Person, and similarly Radharani is the supreme pleasure potency of Krishna. If one wants to understand Krishna, one must also understand Radharani.\" (Srila Prabhupada, Teachings of Lord Chaitanya)",
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
      "/deity/deites4.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites11.webp?w=800&h=800&fit=crop&format=webp"
    ],
    description: "Sri Chaitanya Mahaprabhu (Gaura) and Sri Nityananda Prabhu (Nitai) appeared in Bengal, India in the late 15th century. They are considered the most merciful incarnations of Krishna and Balarama, who came specifically to deliver fallen souls in this age of Kali through the chanting of the holy names.",
    significance: "\"Lord Chaitanya Mahaprabhu and Lord Nityananda Prabhu, who are Gaura-Nitai, are most magnanimous, for They are distributing love of Krishna free of charge all over the world... If we want to be engaged in Krishna conscious activities, we must worship Gaura-Nitai.\" (Srila Prabhupada, Chaitanya Charitamrita, Adi-lila 8.31, Purport)",
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
      "/deity/deites5.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites14.webp?w=800&h=800&fit=crop&format=webp",
      "/deity/deites8.webp?w=800&h=800&fit=crop&format=webp"
    ],
    description: "Govardhana Hill is worshipped in the form of sacred stones (shila) that represent Krishna Himself. When Lord Krishna lifted Govardhana Hill to protect the residents of Vrindavana from a devastating storm sent by Indra, the hill became a direct manifestation of the Lord. These sacred stones are non-different from Krishna.",
    significance: "\"When Krishna lifted Govardhana Hill, it assumed the shape of a huge umbrella, and it was kept upright by the strength of Kṛṣṇa's little finger for seven days continuously... Therefore Govardhana-pūjā, worship of Govardhana Hill, was initiated and is still going on.\" (Srila Prabhupada, Krishna Book, Chapter 25)",
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
      "/deity/deites12.webp?w=800&h=800&fit=crop&format=webp"
    ],
    description: "Srila Prabhupada is the founder-acharya of the International Society for Krishna Consciousness (ISKCON). At the age of 69, he journeyed to America in 1965 to fulfill his spiritual master's instruction to spread Krishna consciousness in the Western world. In just 12 years, he established 108 temples worldwide, wrote more than 70 books, and initiated thousands of disciples.",
    significance: "\"Our duty is to follow the instructions of Srila Prabhupada. That's all. Then our life will be successful. Don't try to become over-intelligent. That will not be helpful. Be faithful, be submissive, and follow strictly what Prabhupada has given us.\" (Srila Prabhupada, Lecture on Bhagavad-gita 2.11, Feb 27, 1973)",
    socialLinks: {
      youtube: "https://www.youtube.com/@ISKMPondy",
      facebook: "https://www.facebook.com/iskm.pondy/",
      telegram: "https://t.me/ISKMVaishnavasanga"
    }
  }
];

const DeityImage = memo(({ src, alt, onLoad }: { src: string; alt: string; onLoad: () => void; }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-cover" 
    loading="lazy"
    fetchPriority="high"
    onLoad={onLoad}
  />
));
DeityImage.displayName = 'DeityImage';

const DeityTab = memo(({ 
  deity, 
  isSelected, 
  onClick 
}: { 
  deity: DeityInfo; 
  isSelected: boolean; 
  onClick: () => void
}) => {
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
      size="lg"
      className={cn(
        "text-base md:text-lg rounded-full px-6 py-3 whitespace-nowrap h-auto",
        isSelected 
          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500" 
          : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      )}
      onClick={onClick}
    >
      {nameMap[deity.id]}
    </Button>
  );
});
DeityTab.displayName = 'DeityTab';

const AaratiTimingItem = memo(({ name, time }: { name: string; time: string }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-base font-medium text-gray-700 dark:text-gray-300">{name}</span>
    <span className="text-base text-blue-600 dark:text-blue-400 font-medium">{time}</span>
  </div>
));
AaratiTimingItem.displayName = 'AaratiTimingItem';

export function DeityDarshan({ open, onOpenChange }: DeityDarshanProps) {
  const [selectedDeity, setSelectedDeity] = useState<DeityInfo>(deitiesInfo[0])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAaratiPopoverOpen, setIsAaratiPopoverOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true); // New state for image loading
  const carouselRef = useRef<HTMLDivElement>(null)
  // Autoplay timer ref removed
  const templeStatus = useTempleStatus();
  
  const { data: deities } = useQuery({
    queryKey: ['deitiesInfo'],
    queryFn: async () => deitiesInfo,
    staleTime: Infinity
  })

  useEffect(() => {
    setIsImageLoading(true); // Set loading to true when deity changes
    setCurrentImageIndex(0);
  }, [selectedDeity])

  useEffect(() => {
    setIsImageLoading(true); // Set loading to true when image index changes
  }, [currentImageIndex]);

  // Autoplay useEffect and startAutoplay function removed

  const handleTouchStart = useCallback((e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX), []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX), []);

  const handleTouchEnd = useCallback(() => {
    if (!selectedDeity) return;
    if (touchStart - touchEnd > 50) { // Swipe left
      setCurrentImageIndex((prev) => (prev === selectedDeity.images.length - 1 ? 0 : prev + 1));
    }
    if (touchStart - touchEnd < -50) { // Swipe right
      setCurrentImageIndex((prev) => (prev === 0 ? selectedDeity.images.length - 1 : prev - 1));
    }
    setTouchStart(0);
    setTouchEnd(0);
  }, [selectedDeity, touchStart, touchEnd]);

  const navigateImage = useCallback((direction: 'next' | 'prev') => {
    if (!selectedDeity) return;
    setCurrentImageIndex((prev) => {
      if (direction === 'next') return prev === selectedDeity.images.length - 1 ? 0 : prev + 1;
      return prev === 0 ? selectedDeity.images.length - 1 : prev - 1;
    });
    // Removed reset autoplay timer calls
  }, [selectedDeity]);

  const handleSelectDeity = useCallback((deity: DeityInfo) => setSelectedDeity(deity), []);

  // Full image view state and functions removed

  const renderDeityContent = useMemo(() => {
    if (!selectedDeity) return null;
    return (
      <div className="h-full">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`title-${selectedDeity.id}`}
          className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-3"
        >
          {selectedDeity.name}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={`desc-${selectedDeity.id}`}
          className="mb-6"
        >
          <h4 className="text-xl font-semibold text-pink-600 dark:text-pink-400 mb-2">About</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
            {selectedDeity.description}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          key={`sig-${selectedDeity.id}`}
        >
          <h4 className="text-xl font-semibold text-amber-500 dark:text-amber-400 mb-2">Significance</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
            {selectedDeity.significance}
          </p>
        </motion.div>
      </div>
    );
  }, [selectedDeity]);

  if (!deities) return null;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] md:h-[95vh] max-h-[95vh] overflow-hidden">
          <div className="mx-auto w-full max-w-6xl flex flex-col h-full p-2 sm:p-4">
            <DrawerHeader className="px-2 pt-2 pb-1 sm:px-4 sm:pt-3 sm:pb-2 flex-shrink-0">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <DrawerTitle className="flex items-center gap-1.5 sm:gap-2">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 sm:p-1 rounded-md sm:rounded-lg shadow-md">
                    <Sparkles className="h-4 w-4 sm:h-5 md:h-6 lg:h-7 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    Divine Visions
                  </span>
                </DrawerTitle>

                <Popover open={isAaratiPopoverOpen} onOpenChange={setIsAaratiPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "relative rounded-full p-1.5 sm:p-2 transition-colors h-8 w-8 sm:h-9 md:h-10", 
                        templeStatus.label === "Darshan" || templeStatus.label === "Aarati" 
                          ? "hover:bg-green-100/50 dark:hover:bg-green-800/50" 
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                      aria-label="Aarati Timings"
                    >
                      <Clock className={cn(
                        "h-4 w-4 sm:h-5 md:h-6", 
                        templeStatus.label === "Darshan" ? "text-green-500 dark:text-green-400" :
                        templeStatus.label === "Aarati" ? "text-pink-500 dark:text-pink-400" :
                        templeStatus.label === "Closed" ? "text-red-500 dark:text-red-400" :
                        "text-amber-500 dark:text-amber-400" // Default color changed to amber/saffron
                      )} />
                      {(templeStatus.label === "Aarati" || templeStatus.label === "Darshan") && (
                        <span className="absolute top-0 right-0 flex h-2.5 w-2.5 sm:h-3"> 
                          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", templeStatus.label === "Aarati" ? "bg-pink-400" : "bg-green-400")}></span>
                          <span className={cn("relative inline-flex rounded-full h-full w-full", templeStatus.label === "Aarati" ? "bg-pink-500" : "bg-green-500")}></span>
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-60 sm:w-72 p-0 rounded-xl border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800" 
                    sideOffset={10}
                  >
                    <div className={cn(
                      "p-2.5 sm:p-4 rounded-t-xl flex items-center gap-2 sm:gap-3",
                      templeStatus.label === "Darshan" ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                      templeStatus.label === "Aarati" ? "bg-gradient-to-r from-pink-500 to-rose-600" :
                      templeStatus.label === "Closed" ? "bg-gradient-to-r from-red-500 to-orange-600" :
                      "bg-gradient-to-r from-gray-500 to-slate-600"
                    )}>
                      <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-white" /> 
                      <h3 className="text-sm sm:text-lg font-semibold text-white">Temple Aarati Timings</h3>
                    </div>
                    <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3">
                      {AARATI_TIMINGS.map((aarati, index) => (
                        <AaratiTimingItem key={index} name={aarati.name} time={aarati.time} />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <DrawerDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 mb-1.5 sm:mb-2">
                Immerse yourself in the sacred presence of the Deities.
              </DrawerDescription>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] leading-tight sm:text-xs text-center italic text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-1.5 mt-1.5 sm:pt-2 sm:mt-2"
              >
                "By chanting the Hare Krishna mantra, one cleanses the dust from the mirror of the mind and becomes eligible to understand his spiritual identity."
                <br />- Srila Prabhupada (Teachings of Queen Kunti, Ch. 18)
              </motion.div>
            </DrawerHeader>

            <div className="flex overflow-x-auto gap-3 px-2 sm:px-4 pb-4 pt-2 flex-shrink-0">
              {deities.map((deity) => (
                <DeityTab 
                  key={deity.id} 
                  deity={deity} 
                  isSelected={selectedDeity.id === deity.id} 
                  onClick={() => handleSelectDeity(deity)} 
                />
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:h-full">
                <div className="md:flex md:flex-col md:h-full">
                  <div 
                    ref={carouselRef}
                    className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg w-full aspect-square md:aspect-auto md:flex-1" // Removed cursor-pointer
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    // onClick removed
                  >
                    <AnimatePresence mode="wait">
                      {selectedDeity && selectedDeity.images && selectedDeity.images.length > 0 && (
                        <motion.div
                          key={`${selectedDeity.id}-${currentImageIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isImageLoading ? 0 : 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          <DeityImage 
                            src={selectedDeity.images[currentImageIndex].replace("w=700&h=700", "w=800&h=800")} 
                            alt={selectedDeity.name}
                            onLoad={() => setIsImageLoading(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
                        <Sparkles className="h-12 w-12 text-white/50 animate-pulse" />
                      </div>
                    )}
                    
                    {selectedDeity && selectedDeity.images && selectedDeity.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/30 text-white hover:bg-black/50 dark:bg-white/20 dark:hover:bg-white/40 transition-opacity z-10"
                          onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                          aria-label="Previous Image"
                        >
                          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/30 text-white hover:bg-black/50 dark:bg-white/20 dark:hover:bg-white/40 transition-opacity z-10"
                          onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                          aria-label="Next Image"
                        >
                          <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                        </Button>
                      
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-10">
                          {selectedDeity.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index);}}
                              className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                                index === currentImageIndex
                                  ? 'bg-white dark:bg-gray-200 w-5 sm:w-6'
                                  : 'bg-white/50 dark:bg-gray-500/50 hover:bg-white/80 dark:hover:bg-gray-400/80'
                              )}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="md:overflow-y-auto md:h-full md:pr-2">
                  {renderDeityContent}
                </div>
              </div>
            </div>

            <DrawerFooter className="px-2 sm:px-4 pb-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex gap-3 flex-1">
                  {selectedDeity?.socialLinks?.facebook && (
                    <a 
                      href={selectedDeity.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button 
                        className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 dark:bg-[#1877F2] dark:hover:bg-[#1877F2]/80 h-12 text-base"
                        size="lg"
                      >
                        <Facebook className="mr-2 h-5 w-5" />
                        <span className="hidden sm:inline">Facebook</span>
                        <span className="sm:hidden">FB</span>
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
                        className="w-full bg-[#0088CC] text-white hover:bg-[#0088CC]/90 dark:bg-[#0088CC] dark:hover:bg-[#0088CC]/80 h-12 text-base"
                        size="lg"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        <span className="hidden sm:inline">Telegram</span>
                         <span className="sm:hidden">TG</span>
                      </Button>
                    </a>
                  )}
                </div>
                
                <DrawerClose asChild className="flex-1 sm:flex-none sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 text-base border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Full Image View Modal Removed */}
    </>
  )
}
