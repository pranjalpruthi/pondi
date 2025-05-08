import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added Popover imports
import { Link } from "@tanstack/react-router";
import React, { useState, useEffect, useTransition, useCallback, useRef } from "react"; // Added React import and useTransition
import {
    IconBrandInstagram,
    IconBrandFacebook,
    IconBrandYoutube,
    IconBrandX,
    IconBrandTelegram,
    IconBrandWhatsapp,
    IconMapPin,
    IconClock,
    IconCar,
    IconPhone,
    IconPlayerPlayFilled, // Added for Watch Live button
    IconCopy, // Added for copy functionality
    IconCheck, // Added for copy success indication
    IconPigMoney, // Added for Donate popover title
    IconChevronLeft, // Added for carousel navigation
    IconChevronRight // Added for carousel navigation
} from '@tabler/icons-react'; // Added icon imports
import { Check, Loader2 } from 'lucide-react'; // Added imports for InputButton
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '@/components/animate-ui/buttons/input'; // Import InputButton components
import { cn } from "@/lib/utils"; // Ensure cn is imported
import { toast } from "sonner"; // Import toast function from sonner

// Preload images with optimization directives
// Using ?webp format for optimization while keeping original resolution
const optimizedImages = [
  '/temple-building/1.webp?w=1920&format=webp&quality=80',
  '/temple-building/2.webp?w=1920&format=webp&quality=80',
  '/temple-building/3.webp?w=1920&format=webp&quality=80',
  '/temple-building/4.webp?w=1920&format=webp&quality=80',
  '/temple-building/5.webp?w=1920&format=webp&quality=80',
  '/temple-building/6.webp?w=1920&format=webp&quality=80',
  '/temple-building/7.webp?w=1920&format=webp&quality=80',
  '/temple-building/8.webp?w=1920&format=webp&quality=80',
  '/updates/s1.webp?w=1920&format=webp&quality=80',
  '/updates/s2.webp?w=1920&format=webp&quality=80',
  '/updates/s3.webp?w=1920&format=webp&quality=80',
  '/updates/s4.webp?w=1920&format=webp&quality=80',
  '/updates/s5.webp?w=1920&format=webp&quality=80',
  '/updates/s6.webp?w=1920&format=webp&quality=80',
];

// Create a smaller version for the background blur (much smaller filesize)
const blurredBackgrounds = optimizedImages.map(img => 
  img.replace('w=1920', 'w=100').replace('quality=80', 'quality=50').replace('format=webp', 'format=webp&blur=50')
);

// Social Media Links Data with Colors
const socialLinks = [
  { icon: IconBrandInstagram, url: 'https://www.instagram.com/iskm_pondy', label: 'Instagram', color: 'bg-[#E1306C] text-white' },
  { icon: IconBrandFacebook, url: 'https://www.facebook.com/iskm.pondy/', label: 'Facebook', color: 'bg-[#1877F2] text-white' },
  { icon: IconBrandYoutube, url: 'https://www.youtube.com/@ISKMPondy', label: 'YouTube', color: 'bg-[#FF0000] text-white' },
  { icon: IconBrandX, url: 'https://x.com/iskm_sg', label: 'Twitter', color: 'bg-gray-800 dark:bg-white dark:text-black text-white' },
  { icon: IconBrandTelegram, url: 'https://t.me/ISKMVaishnavasanga', label: 'Telegram', color: 'bg-[#26A5E4] text-white' },
  { icon: IconBrandWhatsapp, url: 'https://wa.me/918056513859', label: 'WhatsApp', color: 'bg-[#25D366] text-white' },
];

// Location Data
const locationDetails = {
  address: "International Sri Krishna Mandir, RS No:54/3, Koodappakam Village, (Near POGO Land), Pathukkannu Main Road, Pondicherry, India",
  tourPhone: "+91 90426 42103",
  hours: [
    "Monday - Sunday:",
    "5 am–12:30 pm",
    "4–8:45 pm"
  ],
  mapsLink: "https://maps.app.goo.gl/EoqakWfAySKhQWPi9"
};


// Bank Details
const bankDetails = {
  name: "ISKM PONDICHERRY",
  type: "SAVINGS ACCOUNT",
  accountNo: "1197110110052583",
  ifsc: "UJVN0001197",
  bank: "UJJIVAN BANK, PONDICHERRY BRANCH"
};

// Sleep utility for demo purposes
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function HeroSection() {
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<boolean[]>(Array(optimizedImages.length).fill(false));
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayTimerRef = useRef<number | null>(null);
  
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  // State for InputButton
  const [showInput, setShowInput] = useState(false);
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState('');

  // Handle form submission for newsletter
  const handleNewsletterSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!showInput) {
        setShowInput(true);
        return;
      }

      startTransition(async () => {
        // Simulate API call
        console.log("Subscribing with:", emailValue);
        await sleep(2000);
        setSuccess(true);
        toast.success("Subscribed!", { description: "Thank you for joining our newsletter." });
        await sleep(2000);
        setSuccess(false);
        setShowInput(false);
        setEmailValue('');
      });
    },
    [showInput, emailValue]
  );

  // Copy to clipboard function using sonner
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(type);
      toast.success("Copied to clipboard!", {
        description: `${type} copied successfully.`,
        duration: 2000,
      });
      setTimeout(() => setCopiedValue(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Copy Failed", {
        description: "Could not copy text to clipboard.",
      });
    });
  };

  // Carousel navigation functions
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % optimizedImages.length);
    // Reset autoplay timer when manually navigating
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      if (autoplayEnabled) {
        startAutoplay();
      }
    }
  }, [autoplayEnabled]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + optimizedImages.length) % optimizedImages.length);
    // Reset autoplay timer when manually navigating
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      if (autoplayEnabled) {
        startAutoplay();
      }
    }
  }, [autoplayEnabled]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer when manually navigating
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      if (autoplayEnabled) {
        startAutoplay();
      }
    }
  }, [autoplayEnabled]);

  // Start autoplay function
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    // @ts-ignore - setTimeout returns number in browser but NodeJS.Timeout in Node
    autoplayTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % optimizedImages.length);
      startAutoplay(); // Recursively call for continuous autoplay
    }, 5000);
  }, []);

  // Handle autoplay
  useEffect(() => {
    if (autoplayEnabled) {
      startAutoplay();
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [autoplayEnabled, startAutoplay]);

  // Preload images and track loading state
  useEffect(() => {
    const newPreloadedStatus = [...preloadedImages];
    let allLoaded = true;

    optimizedImages.forEach((src, index) => {
      if (!newPreloadedStatus[index]) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          newPreloadedStatus[index] = true;
          setPreloadedImages([...newPreloadedStatus]);
          
          // Check if all images are loaded
          if (newPreloadedStatus.every(status => status)) {
            setIsLoading(false);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
        };
        allLoaded = false;
      }
    });

    // If all images were already preloaded
    if (allLoaded) {
      setIsLoading(false);
    }
  }, []);

  // Pause autoplay when the tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayTimerRef.current) {
          clearTimeout(autoplayTimerRef.current);
          autoplayTimerRef.current = null;
        }
      } else {
        if (autoplayEnabled && !autoplayTimerRef.current) {
          startAutoplay();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoplayEnabled, startAutoplay]);

  // Pause autoplay when user interacts with the page
  useEffect(() => {
    const pauseAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
        setAutoplayEnabled(false);
      }
    };

    // Resume autoplay after 30 seconds of inactivity
    const resumeAutoplayDebounced = () => {
      if (!autoplayEnabled) {
        const timer = setTimeout(() => {
          setAutoplayEnabled(true);
        }, 30000);
        
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('click', pauseAutoplay);
    window.addEventListener('touchstart', pauseAutoplay);
    
    const cleanup = resumeAutoplayDebounced();
    
    return () => {
      window.removeEventListener('click', pauseAutoplay);
      window.removeEventListener('touchstart', pauseAutoplay);
      if (cleanup) cleanup();
    };
  }, [autoplayEnabled]);

  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden">
      {/* Background Image with Blur and Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* First load a very small blurred image */}
            {blurredBackgrounds[currentIndex] && (
              <div 
                className="absolute inset-0 bg-cover bg-center scale-110 blur-xl"
                style={{ backgroundImage: `url(${blurredBackgrounds[currentIndex]})` }}
              />
            )}
            
            {/* Then load the full quality image */}
            <img
              src={optimizedImages[currentIndex]}
              alt={`Background ${currentIndex + 1}`}
              className="w-full h-full object-cover filter blur-lg scale-110"
              style={{ opacity: preloadedImages[currentIndex] ? 1 : 0 }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay with gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/70" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Text and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-xl"
          >
            {/* Logo (Optional, if needed on top) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 max-w-[100px]"
            >
              <img 
                src="/assets/iskmj.jpg" 
                alt="ISKM Logo" 
                className="rounded-full w-full"
              />
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Reawakening Kṛṣṇa Consciousness Worldwide
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-lg mb-8 text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join us and help spread Śrīla Prabhupāda's teachings 
              to guide everyone back to home, back to Godhead!
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {/* Support Us Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Support Us
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <IconPigMoney className="h-5 w-5 text-primary" /> Bank Transfer Details
                    </h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p className="font-medium text-foreground">{bankDetails.name}</p>
                      <p>{bankDetails.type}</p>
                      <div className="flex items-center justify-between">
                        <span>AC NO: {bankDetails.accountNo}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(bankDetails.accountNo, 'Account No')}
                          aria-label="Copy Account Number"
                        >
                          {copiedValue === 'Account No' ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
                        </Button>
                      </div>
                       <div className="flex items-center justify-between">
                        <span>IFSC: {bankDetails.ifsc}</span>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6"
                           onClick={() => copyToClipboard(bankDetails.ifsc, 'IFSC Code')}
                           aria-label="Copy IFSC Code"
                         >
                           {copiedValue === 'IFSC Code' ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
                         </Button>
                       </div>
                      <p>{bankDetails.bank}</p>
                    </div>
                    <Link to="/donate">
                      <Button className="w-full mt-2" size="sm">
                        Donate Online / Other Methods
                      </Button>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Newsletter InputButton */}
              <form
                onSubmit={handleNewsletterSubmit}
                className="w-full max-w-[300px]"
              >
                <InputButtonProvider showInput={showInput} setShowInput={setShowInput}>
                  <InputButton className="bg-[#e94a9c] hover:bg-[#d3428c] border-none rounded-full">
                    <InputButtonAction
                      className="text-white bg-transparent border-none hover:bg-white/10"
                    >
                      Join the newsletter
                    </InputButtonAction>
                    <InputButtonSubmit
                      type="submit"
                      disabled={pending}
                      className={cn(
                        "bg-white/20 hover:bg-white/30 text-white",
                        pending || success ? 'aspect-square px-0' : ''
                      )}
                    >
                      {success ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="h-4 w-4"/>
                        </motion.span>
                      ) : pending ? (
                        <motion.span
                          key="pending"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Loader2 className="animate-spin h-4 w-4" />
                        </motion.span>
                      ) : (
                        'Subscribe'
                      )}
                    </InputButtonSubmit>
                  </InputButton>
                  <InputButtonInput
                    type="email"
                    placeholder="your-email@example.com"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    disabled={pending}
                    required
                    className="text-sm placeholder:text-gray-500"
                    autoFocus
                  />
                </InputButtonProvider>
              </form>
            </motion.div>

            {/* Added Watch Live, Location Popover, and Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-wrap justify-start gap-4 items-center"
            >
              {/* Watch Live Button */}
               <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer">
                 <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                   <IconPlayerPlayFilled className="mr-2 h-4 w-4" /> Watch Live
                 </Button>
               </a>

              {/* Location Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <IconMapPin className="mr-2 h-4 w-4" /> Our Location
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <h3 className="font-semibold mb-2">ISKM Pudhuvai Temple</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {locationDetails.address}
                  </p>
                  <div className="flex flex-col space-y-2 mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <IconCar className="h-3 w-3" />
                      Book Temple Tour
                    </Badge>
                    <a href={`tel:${locationDetails.tourPhone}`} className="w-fit">
                      <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer hover:bg-accent">
                        <IconPhone className="h-3 w-3" />
                        {locationDetails.tourPhone}
                      </Badge>
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center text-sm mb-1">
                      <IconClock className="mr-2 h-4 w-4" /> Opening Hours:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-0.5">
                      {locationDetails.hours.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(locationDetails.mapsLink, '_blank')}
                    >
                      <IconMapPin className="mr-2 h-4 w-4" />
                      Open in Maps
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex justify-start gap-3"
            >
              {socialLinks.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors"
                    aria-label={`Follow us on ${item.label}`}
                  >
                    <Badge
                      variant="secondary"
                      className={cn(
                        "cursor-pointer p-2 hover:opacity-90 transition-colors duration-200",
                        item.color // Apply color class to the Badge instead of the icon
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Badge>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Improved Right Content - Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="relative aspect-[4/3] w-full max-w-xl mx-auto lg:ml-auto"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 shadow-xl">
              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 z-20">
                  <Loader2 className="animate-spin h-12 w-12 text-primary" />
                </div>
              )}
              
              {/* Main carousel */}
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`carousel-${currentIndex}`}
                    src={optimizedImages[currentIndex]}
                    alt={`Temple Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(233, 74, 156, 0.25), 0 8px 24px -8px rgba(255, 215, 0, 0.15)"
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Arrows - only visible on hover or on touch devices */}
              <div className="absolute top-0 bottom-0 left-0 w-12 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group z-10">
                <button 
                  onClick={goToPrevSlide}
                  className="p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
                  aria-label="Previous image"
                >
                  <IconChevronLeft className="h-6 w-6" />
                </button>
              </div>
              
              <div className="absolute top-0 bottom-0 right-0 w-12 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group z-10">
                <button 
                  onClick={goToNextSlide}
                  className="p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors"
                  aria-label="Next image"
                >
                  <IconChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {optimizedImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative element */}
      <motion.div 
        className="absolute bottom-12 left-0 w-full h-1"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(233, 74, 156, 0.3), rgba(255, 215, 0, 0.3), transparent)"
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scaleX: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
}
