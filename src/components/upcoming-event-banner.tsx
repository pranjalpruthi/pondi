import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import { motion, AnimatePresence } from "motion/react" // Ensure motion is imported
import { Button } from "@/components/ui/button" // Corrected import path
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Corrected import path
import { Link } from '@tanstack/react-router' // Use TanStack Router Link
import { Pause, Play, X } from 'lucide-react' // Import Lucide icons for better controls

// Define placeholder images with optimization directives
const optimizedImages = [
  '/event-images/event1.jpg?w=800&format=webp&quality=80',
  '/event-images/event2.jpg?w=800&format=webp&quality=80',
  '/event-images/event3.jpg?w=800&format=webp&quality=80',
  '/event-images/event4.jpg?w=800&format=webp&quality=80',
]

// Fallback to Unsplash images if local images aren't available
const fallbackImages = [
  "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop",
]

// Create smaller thumbnails for list display
const thumbImages = optimizedImages.map(img => 
  img.replace('w=800', 'w=200').replace('quality=80', 'quality=60')
);

const fallbackThumbs = fallbackImages.map(img => 
  img.replace('w=800', 'w=200')
);

const newsItems = [
  {
    id: 1,
    emoji: "🌸🚶‍♂️",
    title: "ISKM Pondicherry Iniciation Ceremeony 2024",
    emoji2: "🎉🙏",
    details: "Join us for the auspicious initiation ceremony at ISKM Pondicherry, where devotees will take their spiritual vows and deepen their commitment to Krishna consciousness.",
    image: 0, // Use index instead of hardcoded URL
    date: "June 15, 2024",
    location: "ISKM Pondicherry"
  },
  {
    id: 2,
    emoji: "🇷🇺✨",
    title: "Sri Krishna Mandir Sets Foot in Russia",
    emoji2: "🛕🌏",
    details: "Exciting news as ISKM expands its presence to Russia, bringing the teachings of Krishna consciousness to a new audience and fostering spiritual growth in the region.",
    image: 1,
    date: "August 1, 2024",
    location: "Moscow, Russia"
  },
  {
    id: 3,
    emoji: "💰🇸🇬",
    title: "Donation by Deputy Prime Minister for Singapore Temple Building Project",
    emoji2: "🏗️🛕",
    details: "A generous donation from Singapore's Deputy Prime Minister boosts the temple building project, bringing us closer to realizing our vision of a grand spiritual center in the heart of Singapore.",
    image: 2,
    date: "July 20, 2024",
    location: "Singapore"
  },
  {
    id: 4,
    emoji: "🇮🇳🌟",
    title: "Sri Krishna Mandir Sets Foot in Delhi",
    emoji2: "🛕❤️",
    details: "ISKM expands its presence to the capital city of India, Delhi, bringing the message of love and devotion to Krishna to the heart of the nation.",
    image: 3,
    date: "September 5, 2024",
    location: "Delhi, India"
  },
]

// Helper function to check if image exists
const imageExists = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function UpcomingEventBanner() {
  // State for banner visibility (with 7-day expiration)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bannerVisible');
      const expiry = localStorage.getItem('bannerExpiry');
      
      // Check if storage has expired (7 days)
      if (expiry && Number(expiry) < Date.now()) {
        localStorage.removeItem('bannerVisible');
        localStorage.removeItem('bannerExpiry');
        return true;
      }
      
      return stored === null ? true : JSON.parse(stored);
    }
    return true;
  });

  // State for dialog, animation pausing, and image sources
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [useLocalImages, setUseLocalImages] = useState(true);
  const [dimensions, setDimensions] = useState({ contentWidth: 0, viewportWidth: 0 }); // Restored

  // Refs for animation control
  const containerRef = useRef<HTMLDivElement>(null);

  // Check which image sources to use (local vs fallback)
  useEffect(() => {
    const checkImages = async () => {
      // Test if the first optimized image exists
      const firstImageExists = await imageExists(optimizedImages[0]);
      setUseLocalImages(firstImageExists);
      setImagesReady(true);
    };
    
    checkImages();
  }, []);

  // Measure content for proper animation
  useEffect(() => {
    if (!containerRef.current || !imagesReady) return;
    
    const measure = () => {
      if (!containerRef.current) return;
      const motionWrapper = containerRef.current.querySelector(".news-item-strip") as HTMLElement;
      
      if (motionWrapper && motionWrapper.scrollWidth > 0) {
        setDimensions({
          contentWidth: motionWrapper.scrollWidth / 2,
          viewportWidth: window.innerWidth,
        });
      } else if (motionWrapper) {
        let calculatedWidth = 0;
        for(let i = 0; i < motionWrapper.children.length / 2; i++) { 
            calculatedWidth += (motionWrapper.children[i] as HTMLElement).offsetWidth || 0;
        }
        if (calculatedWidth > 0) {
            setDimensions({
                contentWidth: calculatedWidth,
                viewportWidth: window.innerWidth,
            });
        } else {
            setDimensions({
                contentWidth: window.innerWidth * 2, 
                viewportWidth: window.innerWidth,
            });
        }
      }
    };
    
    measure(); 

    const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      return (...args: Parameters<F>): void => { 
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
      };
    };

    const debouncedMeasure = debounce(measure, 250);
    window.addEventListener('resize', debouncedMeasure);
    return () => window.removeEventListener('resize', debouncedMeasure);
  }, [imagesReady]);


  // Handle banner dismissal (with 7-day expiration)
  const handleClose = useCallback(() => {
    setIsVisible(false);
    const expiryDate = Date.now() + (7 * 24 * 60 * 60 * 1000); 
    localStorage.setItem('bannerVisible', 'false');
    localStorage.setItem('bannerExpiry', expiryDate.toString());
  }, []);

  // Get the appropriate image sources based on availability
  const getImageSrc = useCallback((index: number, isThumb = false) => {
    if (!imagesReady) return ''; 
    if (useLocalImages) {
      return isThumb ? thumbImages[index] : optimizedImages[index];
    }
    return isThumb ? fallbackThumbs[index] : fallbackImages[index];
  }, [imagesReady, useLocalImages]);

  if (!isVisible) return null;

  const animationDuration = Math.max(10, Math.min(40, dimensions.contentWidth > 0 ? dimensions.contentWidth / 50 : 20)); 

  return (
    <div 
      className="fixed bottom-[env(safe-area-inset-bottom,0px)] left-0 right-0 w-full z-30 h-[var(--banner-height,44px)]"
      style={{ '--banner-height': '44px' } as React.CSSProperties}
    >
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 
          bg-white/80 dark:bg-black/80 backdrop-blur-sm p-1.5 rounded-full
          text-foreground hover:bg-white dark:hover:bg-black transition-colors
          shadow-sm z-20"
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
      
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute left-16 top-1/2 transform -translate-y-1/2 
          bg-white/80 dark:bg-black/80 backdrop-blur-sm p-1.5 rounded-full
          text-foreground hover:bg-white dark:hover:bg-black transition-colors
          shadow-sm z-20"
        aria-label={isPaused ? "Play animation" : "Pause animation"}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
      
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-black/80 dark:to-transparent pointer-events-none" />

      <div className="w-full bg-white/10 dark:bg-black/10 backdrop-blur-md border-t border-white/20 dark:border-black/20 relative">
        <div className="py-1 px-4 overflow-hidden relative" ref={containerRef}> 
          <Popover>
            <PopoverTrigger asChild>
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2
                bg-white/90 dark:bg-black/90 text-foreground text-xs font-bold 
                px-2 py-1 rounded-full z-10 backdrop-blur-sm 
                hover:bg-white dark:hover:bg-black transition-colors shadow-sm">
                News
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm mb-2">Upcoming Events</h3>
                {newsItems.map((item) => (
                  <div key={item.id} className="text-sm flex items-center gap-2">
                    <img 
                      src={getImageSrc(item.image, true)} 
                      alt=""
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div>
                      <span className="mr-1">{item.emoji}</span>
                      {item.title}
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <Link to="/events">
                    <Button className="w-full" size="sm">View All News</Button>
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Scrolling content with improved animation performance */}
          <motion.div
            animate={{
              x: isPaused ? 0 : [0, -dimensions.contentWidth]
            }}
            transition={{
              repeat: Infinity,
              duration: (isPaused || dimensions.contentWidth === 0) ? 0 : animationDuration, 
              ease: "linear",
              repeatType: "loop"
            }}
            className="flex whitespace-nowrap pl-24 news-item-strip transform-gpu" 
            style={{
              willChange: "transform", 
            }}
          >
            {[...newsItems, ...newsItems].map((item, index) => (
              <Fragment key={`${item.id}-${index}`}>
                <button
                  className="text-sm sm:text-base inline-flex items-center space-x-2
                    hover:underline focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-primary
                    text-black dark:text-white relative z-10
                    rounded-lg px-2 py-1 hover:bg-white/10 dark:hover:bg-black/10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setOpenDialog(item.id);
                    }
                  }}
                  onClick={() => {
                    setIsPaused(true); 
                    setOpenDialog(item.id);
                  }}
                >
                  <span>{item.emoji}</span>
                  <span className="font-medium">{item.title}</span>
                  <span>{item.emoji2}</span>
                </button>
                
                {(index < newsItems.length - 1) && (
                  <span className="mx-4 text-gray-400 relative z-10">|</span>
                )}
                {(index === newsItems.length - 1) && (
                   <span className="mx-4 text-transparent relative z-10">|</span> 
                )}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {openDialog !== null && newsItems.map(item => (
          openDialog === item.id && (
            <motion.div
              key={`modal-${item.id}`}
              className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8 lg:p-10 overflow-y-auto z-[200] pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setOpenDialog(null)}
              />
              
              <motion.div
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-50 sm:max-w-[500px] w-11/12 bg-background/60 backdrop-blur-lg border border-border/50 shadow-lg rounded-lg p-6"
              >
                <button
                  onClick={() => setOpenDialog(null)}
                  className="absolute right-4 top-4 rounded-full p-1 hover:bg-accent"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <motion.h4
                  variants={contentVariants}
                  className="text-lg md:text-xl text-foreground font-bold text-center mb-4"
                >
                  {item.title}
                </motion.h4>

                <motion.div
                  variants={contentVariants}
                  className="flex justify-center items-center mb-4"
                >
                  {[
                    item.image,
                    newsItems[(newsItems.findIndex(i => i.id === item.id) + 1) % newsItems.length].image,
                    newsItems[(newsItems.findIndex(i => i.id === item.id) + 2) % newsItems.length].image
                  ].map((imageIndex, idx) => (
                    <motion.div // This is the correct motion.div for the card hover effect
                      key={`image-${idx}`}
                      initial={{ rotate: Math.random() * 20 - 10 }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 0,
                        zIndex: 100,
                        transition: {
                          type: "spring",
                          stiffness: 300
                        }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={getImageSrc(imageIndex)}
                        alt={item.title}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  variants={contentVariants}
                  className="text-sm text-neutral-600 dark:text-neutral-300 text-center mb-4"
                >
                  {item.details}
                </motion.p>

                <motion.div
                  variants={contentVariants}
                  className="flex flex-wrap gap-2 justify-center mb-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center text-xs"
                  >
                    <CalendarIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-3 w-3" />
                    <span className="text-neutral-700 dark:text-neutral-300">{item.date}</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center text-xs"
                  >
                    <LocationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-3 w-3" />
                    <span className="text-neutral-700 dark:text-neutral-300">{item.location}</span>
                  </motion.div>
                </motion.div>

                <div className="flex justify-end gap-2 mt-6">
                  <motion.div
                    variants={contentVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenDialog(null)}
                      className="backdrop-blur-sm bg-background/80"
                    >
                      Close
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={contentVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="backdrop-blur-sm bg-primary/80"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  )
}

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
};
