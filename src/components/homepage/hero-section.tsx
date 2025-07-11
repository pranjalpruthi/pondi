import { AnimatePresence, type PanInfo, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { ColorExtractor } from 'react-color-extractor';
import Carousel, {
  Slider,
  SliderContainer,
  ThumsSlider,
} from '@/components/gallery/carousel';
import { createPortal } from "react-dom";

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
    IconCopy,
    IconCheck,
    IconPigMoney,

} from '@tabler/icons-react';
import { Check, Loader2, X, ChevronUp, ChevronDown } from 'lucide-react';
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '@/components/animate-ui/buttons/input';
import EventCtaButton from '@/components/animate-ui/buttons/event-cta-button';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { addLead } from "@/integrations/nocodb-api";

const heroShowcaseImages = [
  '/temple-building/1.webp?w=1200&format=webp&quality=80',
  '/temple-building/2.webp?w=1200&format=webp&quality=80',
  '/updates/s2.webp?w=1200&format=webp&quality=80',
  '/updates/s3.webp?w=1200&format=webp&quality=80',
  '/updates/s4.webp?w=1200&format=webp&quality=80',
  '/updates/s5.webp?w=1200&format=webp&quality=80',
  '/updates/s6.webp?w=1200&format=webp&quality=80',
  '/updates/s7.webp?w=1200&format=webp&quality=80',
  '/temple-building/3.webp?w=1200&format=webp&quality=80',
  '/temple-building/4.webp?w=1200&format=webp&quality=80',
  '/temple-building/5.webp?w=1200&format=webp&quality=80',
];

const socialLinks = [
  { icon: IconBrandInstagram, url: 'https://www.instagram.com/iskm_pondy', label: 'Instagram', color: 'bg-[#E1306C] text-white' },
  { icon: IconBrandFacebook, url: 'https://www.facebook.com/iskm.pondy/', label: 'Facebook', color: 'bg-[#1877F2] text-white' },
  { icon: IconBrandYoutube, url: 'https://www.youtube.com/@ISKMPondy', label: 'YouTube', color: 'bg-[#FF0000] text-white' },
  { icon: IconBrandX, url: 'https://x.com/iskm_sg', label: 'Twitter', color: 'bg-gray-800 dark:bg-white dark:text-black text-white' },
  { icon: IconBrandTelegram, url: 'https://t.me/ISKMVaishnavasanga', label: 'Telegram', color: 'bg-[#26A5E4] text-white' },
  { icon: IconBrandWhatsapp, url: 'https://wa.me/918056513859', label: 'WhatsApp', color: 'bg-[#25D366] text-white' },
];

const locationDetails = {
  address: "International Sri Krishna Mandir, RS No:54/3, Koodappakam Village, (Near POGO Land), Pathukkannu Main Road, Pondicherry, India",
  tourPhone: "+91 90426 42103",
  hours: ["Monday - Sunday:", "5 am–12:30 pm", "4–8:45 pm"],
  mapsLink: "https://maps.app.goo.gl/EoqakWfAySKhQWPi9"
};

const bankDetails = {
  name: "ISKM PONDICHERRY",
  type: "SAVINGS ACCOUNT",
  accountNo: "1197110110052583",
  ifsc: "UJVN0001197",
  bank: "UJJIVAN BANK, PONDICHERRY BRANCH"
};

interface BackgroundImageCarouselProps {
  currentIndex: number;
  images: string[];
  onColorsExtracted: (colors: string[]) => void;
  backgroundColors: string[];
  isInView: boolean;
}

const BackgroundImageCarousel: React.FC<BackgroundImageCarouselProps> = ({
  currentIndex,
  images,
  onColorsExtracted,
  backgroundColors,
  isInView,
}) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* This is hidden, only for color extraction */}
    <ColorExtractor
      src={images[currentIndex]}
      getColors={onColorsExtracted}
      maxColors={8}
    />
    <AnimatePresence mode="wait">
      {isInView && (
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            background: backgroundColors.length > 1
              ? `linear-gradient(145deg, ${backgroundColors[0]}, ${backgroundColors[1]}, ${backgroundColors[2] || backgroundColors[0]})`
              : backgroundColors.length === 1
              ? backgroundColors[0]
              : 'transparent',
          }}
        />
      )}
    </AnimatePresence>
    <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-black/80 dark:via-black/60" />
  </div>
);

interface HeroForegroundProps {
  isInView: boolean;
  bankDetails: typeof bankDetails;
  locationDetails: typeof locationDetails;
  socialLinks: typeof socialLinks;
  onCopyToClipboard: (text: string, type: string) => void;
  copiedValue: string | null;
  showNewsletterInput: boolean;
  setShowNewsletterInput: React.Dispatch<React.SetStateAction<boolean>>;
  isNewsletterPending: boolean;
  handleNewsletterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isNewsletterSuccess: boolean;
  newsletterEmail: string;
  setNewsletterEmail: (email: string) => void;
  safePlayHover: () => void;
  safePlayClick: () => void;
  safePlayPopOn: () => void;
  safePlayPopOff: () => void;
  safePlayFanfare: () => void;
  rightCarouselImages: string[];
  currentRightCarouselIndex: number;
  goToNextRightSlide: () => void;
  goToPrevRightSlide: () => void;
  goToRightSlide: (index: number) => void;
  isLightboxOpen: boolean;
  setIsLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lightboxIndex: number;
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
}

// --- New HeroGalleryModal (adapted from user's SliderModal example) ---

const imageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%', // Changed x to y
    opacity: 0,
    scale: 0.8, // More pronounced scale effect
  }),
  center: {
    zIndex: 1,
    y: 0, // Changed x to y
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? '100%' : '-100%', // Changed x to y
    opacity: 0,
    scale: 0.8, // More pronounced scale effect
  }),
};

interface TransformedImage {
  id: string;
  src: string; // Changed url to src
  alt: string;
}

interface HeroGalleryModalProps {
  images: TransformedImage[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
}

function HeroGalleryModal({
  images,
  open,
  onClose,
  startIndex = 0,
}: HeroGalleryModalProps) {
  const [_currentIndex, _setCurrentIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0); // 0: none, 1: next, -1: prev
  const thumbnailCarouselRef = useRef<HTMLDivElement>(null);

  const setCurrentIndex = useCallback((newIndexOrUpdater: number | ((prevIndex: number) => number)) => {
    _setCurrentIndex(prevCurrentIndex => {
      let newIndexValue: number;
      if (typeof newIndexOrUpdater === 'function') {
        newIndexValue = newIndexOrUpdater(prevCurrentIndex);
      } else {
        newIndexValue = newIndexOrUpdater;
      }

      if (newIndexValue === prevCurrentIndex) {
        setDirection(0);
      } else if (
        (newIndexValue > prevCurrentIndex && !(prevCurrentIndex === images.length -1 && newIndexValue === 0)) || // normal next
        (newIndexValue === 0 && prevCurrentIndex === images.length - 1) // wrap around next
      ) {
        setDirection(1);
      } else { // normal prev or wrap around prev
        setDirection(-1);
      }
      return newIndexValue;
    });
  }, [images.length]);


  useEffect(() => {
    if (open) {
      _setCurrentIndex(startIndex);
      setDirection(0); // Reset direction when modal opens or startIndex changes
    }
  }, [open, startIndex]);

  const currentImageItem = images[_currentIndex];

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50; // Minimum drag distance to trigger a swipe
    const swipeVelocityThreshold = 200; // Minimum velocity to trigger a swipe (px/s)

    // Check for swipe up (next image)
    if (info.offset.y < -swipeThreshold || info.velocity.y < -swipeVelocityThreshold) {
      setCurrentIndex(prev => (prev + 1) % images.length);
    } 
    // Check for swipe down (previous image)
    else if (info.offset.y > swipeThreshold || info.velocity.y > swipeVelocityThreshold) {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }
    // If not a clear swipe, the image will snap back due to dragConstraints/dragElastic.
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  if (!open || !currentImageItem) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex flex-col items-center w-full h-screen justify-center dark:bg-black/80 bg-gray-300/80 backdrop-blur-lg cursor-zoom-out transform-gpu' // Restored backdrop-blur-lg, added transform-gpu
          style={{ willChange: 'backdrop-filter, opacity' }}
          onClick={onClose}
        >
          <button
            className='absolute top-4 right-4 p-2 rounded-full dark:bg-black/70 bg-gray-500/50 text-white z-10 hover:dark:bg-black/90 hover:bg-gray-500/70'
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close gallery modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Up Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
            }}
            className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronUp className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Down Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => (prev + 1) % images.length);
            }}
            className="absolute bottom-1/2 right-4 md:right-8 transform translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <motion.div
            className='rounded-md w-full h-full md:h-[90%] md:w-[90%] max-w-6xl max-h-[90dvh] flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center p-2 md:p-4 cursor-auto'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Display */}
            <motion.div
              className='flex-1 flex items-center justify-center w-full md:h-auto overflow-hidden p-2 min-h-0 relative cursor-grab active:cursor-grabbing'
              drag="y" // Changed drag to "y"
              dragConstraints={{ top: 0, bottom: 0 }} // Changed constraints to top/bottom
              dragElastic={0.2} // Adjust for desired "stickiness" or resistance
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={currentImageItem.id} // Important for AnimatePresence to detect changes
                  src={currentImageItem.src}
                  alt={currentImageItem.alt}
                  className='object-contain max-h-[60dvh] md:max-h-[75dvh] max-w-full rounded-md shadow-lg bg-white/10 dark:bg-black/10 pointer-events-none' // pointer-events-none so drag is on parent
                  width={1200}
                  height={800}
                  loading="eager"
                  decoding="async"
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 400, damping: 40 }, // Changed x to y
                    opacity: { duration: 0.2 }, // Faster fade
                    scale: { type: "spring", stiffness: 400, damping: 40 }, // Snappier scale
                  }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails: horizontal below image on mobile, vertical on desktop */}
            {/* Mobile/Tablet: horizontal row below image */}
            <div className="w-full md:hidden mt-2">
              <motion.div
                ref={thumbnailCarouselRef}
                className="flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent h-20 px-1"
              >
                {images.map((imgData, index) => (
                  <button
                    key={imgData.id}
                    className={`relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all w-24 h-20 flex-shrink-0 ${imgData.id === currentImageItem.id ? 'ring-2 ring-primary border-primary' : 'border-transparent'}`} // Increased size: w-20 h-16 to w-24 h-20
                    onClick={() => setCurrentIndex(index)} // Uses the new setCurrentIndex wrapper
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={imgData.src.replace('w=1200', 'w=250').replace('quality=80', 'quality=65')} // Slightly increased quality for larger thumbs
                      alt={`Thumbnail ${imgData.alt}`}
                      className='w-full h-full object-cover rounded pointer-events-none'
                      width={125} // Adjusted to match new aspect ratio/size
                      height={83}  // Adjusted to match new aspect ratio/size
                      loading="lazy"
                      decoding="async"
                    />
                    {imgData.id === currentImageItem.id && (
                      <motion.div
                        className='absolute inset-0 border-2 border-primary rounded-md'
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
            {/* Desktop: vertical column to the right of image */}
            <div
              className='hidden md:block w-auto md:h-[80dvh] max-h-[100px] md:max-h-full overflow-y-auto bg-white/20 dark:bg-black/20 border border-gray-300/30 dark:border-gray-700/30 rounded-md p-1 md:p-2'
              ref={thumbnailCarouselRef}
            >
              <motion.div
                className='flex flex-col gap-2 h-auto'
              >
                {images.map((imgData, index) => (
                  <button
                    key={imgData.id}
                    className={`relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all w-24 h-20 md:w-28 md:h-20 flex-shrink-0 ${imgData.id === currentImageItem.id ? 'ring-2 ring-primary border-primary' : 'border-transparent'}`} // Increased size: md:w-24 md:h-16 to md:w-28 md:h-20
                    onClick={() => setCurrentIndex(index)} // Uses the new setCurrentIndex wrapper
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={imgData.src.replace('w=1200', 'w=250').replace('quality=80', 'quality=65')} // Slightly increased quality for larger thumbs
                      alt={`Thumbnail ${imgData.alt}`}
                      className='w-full h-full object-cover rounded pointer-events-none'
                      width={125} // Adjusted to match new aspect ratio/size
                      height={83}  // Adjusted to match new aspect ratio/size
                      loading="lazy"
                      decoding="async"
                    />
                    {imgData.id === currentImageItem.id && (
                      <motion.div
                        className='absolute inset-0 border-2 border-primary rounded-md'
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
// --- End of New HeroGalleryModal ---

const HeroForeground = React.memo<HeroForegroundProps>((props) => {
  return (
    <div className="z-10 relative px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: props.isInView ? 1 : 0, y: props.isInView ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="mt-8"
        >
          {/* The h1 and paragraph are now rendered directly in HeroSection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: props.isInView ? 1 : 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <Popover onOpenChange={(open) => open && props.safePlayPopOn()}>
              <PopoverTrigger asChild>
                <EventCtaButton
                  icon={<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Heart%20Hands.png" alt="Heart Hands" width="25" height="25" />}
                  defaultText="Support Us"
                  hoverText="with a donation"
                  emoji="🫶"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={props.safePlayClick}
                  onMouseEnter={props.safePlayHover}
                  isExpanded={true}
                  hasShimmer={false}
                />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <IconPigMoney className="h-5 w-5 text-primary" /> Bank Transfer Details
                  </h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-medium text-foreground">{props.bankDetails.name}</p>
                    <p>{props.bankDetails.type}</p>
                    <div className="flex items-center justify-between">
                      <span>AC NO: {props.bankDetails.accountNo}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { props.onCopyToClipboard(props.bankDetails.accountNo, 'Account No'); props.safePlayPopOn(); }} onMouseEnter={props.safePlayHover} aria-label="Copy Account Number">
                        {props.copiedValue === 'Account No' ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>IFSC: {props.bankDetails.ifsc}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { props.onCopyToClipboard(props.bankDetails.ifsc, 'IFSC Code'); props.safePlayPopOn(); }} onMouseEnter={props.safePlayHover} aria-label="Copy IFSC Code">
                        {props.copiedValue === 'IFSC Code' ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p>{props.bankDetails.bank}</p>
                  </div>
                  {/* UPI QR Code Section */}
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <img src="/assets/extra/miniqr.png" alt="UPI Icon" className="h-5 w-5 rounded" /> Scan to Pay with UPI
                    </h3>
                    <div className="flex justify-center items-center p-1 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                      <img 
                        src="/assets/extra/miniqr.png" 
                        alt="UPI QR Code" 
                        className="w-28 h-auto object-contain rounded" 
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">Or use UPI ID:</p>
                      <div className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-700/60 px-2 py-1 rounded-md max-w-xs mx-auto">
                        <span className="text-xs font-mono text-purple-600 dark:text-purple-400">ISKM.04@idfcbank</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { props.onCopyToClipboard("ISKM.04@idfcbank", 'UPI ID'); props.safePlayPopOn(); }} onMouseEnter={props.safePlayHover} aria-label="Copy UPI ID">
                          {props.copiedValue === 'UPI ID' ? <IconCheck className="h-3 w-3 text-green-500" /> : <IconCopy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Link to="/donate" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                    <Button className="w-full mt-3" size="sm">More Donation Methods</Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
              <EventCtaButton
                icon={<IconBrandYoutube className="h-6 w-6" />}
                defaultText="Watch Live"
                hoverText="on YouTube"
                emoji="🔴"
                className="bg-red-600 hover:bg-red-700 text-white"
                isExpanded={true}
                hasPulse={true}
                hasShimmer={true}
              />
            </a>

            <Popover onOpenChange={(open) => open && props.safePlayPopOn()}>
              <PopoverTrigger asChild>
                <EventCtaButton
                  icon={<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Love%20Hotel.png" alt="Love Hotel" width="25" height="25" />}
                  defaultText="Our Location"
                  hoverText="Get Directions"
                  emoji="🗺️"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={props.safePlayClick}
                  onMouseEnter={props.safePlayHover}
                  isExpanded={true}
                  hasShimmer={false}
                />
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <h3 className="font-semibold mb-2">ISKM Pudhuvai Temple</h3>
                <p className="text-sm text-muted-foreground mb-3">{props.locationDetails.address}</p>
                <div className="flex flex-col space-y-2 mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white text-white"><IconCar className="h-3 w-3" />Book Temple Tour</Badge>
                  <a href={`tel:${props.locationDetails.tourPhone}`} className="w-fit" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                    <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer bg-purple-500 hover:bg-purple-600 dark:bg-purple-500 dark:hover:bg-purple-600 dark:text-white text-white"><IconPhone className="h-3 w-3" />{props.locationDetails.tourPhone}</Badge>
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center text-sm mb-1"><IconClock className="mr-2 h-4 w-4" /> Opening Hours:</h4>
                  <ul className="text-sm text-muted-foreground space-y-0.5">{props.locationDetails.hours.map((line, i) => <li key={i}>{line}</li>)}</ul>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { window.open(props.locationDetails.mapsLink, '_blank'); props.safePlayClick(); }} onMouseEnter={props.safePlayHover}><IconMapPin className="mr-2 h-4 w-4" />Open in Maps</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Popover onOpenChange={(open) => open && props.safePlayPopOn()}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 border-green-500/70 text-green-700 dark:text-green-300">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <IconPhone className="h-6 w-6" />
                    <span className="text-[10px] font-semibold">Contact</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-full max-w-xs sm:max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-300 dark:border-gray-700 shadow-xl rounded-xl">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">Contact Us</h4>
                      <Button size="sm" variant="ghost" onClick={() => props.onCopyToClipboard('+91 90426 42103\niskm.pondicherry@gmail.com', 'Contact Info')} className="text-green-600 dark:text-green-400">
                        {props.copiedValue === 'Contact Info' ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <IconPhone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        <a href="tel:+919042642103" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">+91 90426 42103</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-envelope text-green-600 dark:text-green-400" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                        <a href="mailto:iskm.pondicherry@gmail.com" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">iskm.pondicherry@gmail.com</a>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {props.socialLinks.map(link => (
                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <link.icon className="h-4 w-4" />
                          <span className="text-xs">{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: props.isInView ? 1 : 0, y: props.isInView ? 0 : 20 }} 
            transition={{ delay: 0.7 }} 
            className="mt-8 flex flex-col items-center gap-3 text-center"
          >
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Stay Connected with ISKM</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Join our newsletter for weekly updates, event news, and spiritual insights delivered to your inbox.
              </p>
            </div>
            <form onSubmit={props.handleNewsletterSubmit} className="w-full max-w-xs sm:max-w-sm">
              <InputButtonProvider showInput={props.showNewsletterInput} setShowInput={props.setShowNewsletterInput}>
                <InputButton className="bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-rose-500/30 border-none rounded-full transition-shadow" onMouseEnter={props.safePlayHover}>
                  <InputButtonAction className="text-white bg-transparent border-none hover:bg-white/10 flex items-center gap-2" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Love%20Letter.png" alt="Love Letter" width="20" height="20" />
                    Get Weekly Updates
                  </InputButtonAction>
                  <InputButtonSubmit type="submit" disabled={props.isNewsletterPending} onClick={props.safePlayClick} onMouseEnter={props.safePlayHover} className={cn("bg-pink-600 text-white hover:bg-pink-700", props.isNewsletterPending || props.isNewsletterSuccess ? 'aspect-square px-0' : '')}>
                    {props.isNewsletterSuccess ? <motion.span key="success" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}><Check className="h-4 w-4"/></motion.span> : props.isNewsletterPending ? <motion.span key="pending" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}><Loader2 className="animate-spin h-4 w-4" /></motion.span> : 'Subscribe'}
                  </InputButtonSubmit>
                </InputButton>
                <InputButtonInput type="email" placeholder="harekrsna@mail.com" value={props.newsletterEmail} onChange={(e) => props.setNewsletterEmail(e.target.value)} disabled={props.isNewsletterPending} required className="text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400" autoFocus />
              </InputButtonProvider>
            </form>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: props.isInView ? 1 : 0, y: props.isInView ? 0 : 20 }} 
            transition={{ delay: 0.8 }} 
            className="mt-10"
          >
            <h4 className="text-center text-sm font-medium text-muted-foreground mb-3">Follow us on social media</h4>
            <div className="flex justify-center gap-4">
              {props.socialLinks.map((item, index) => (
                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" aria-label={`Follow us on ${item.label}`} onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                  <div className={cn("rounded-full p-3 flex items-center justify-center transition-colors duration-200", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
        {/* Remove the right column with <HeroGalleryCarousel /> or any carousel here */}
      </div>
    </div>
  );
});
HeroForeground.displayName = "HeroForeground";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundColors, setBackgroundColors] = useState<string[]>([]);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [showNewsletterInput, setShowNewsletterInput] = useState(true);
  const [isNewsletterPending, startNewsletterTransition] = useTransition();
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rightCarouselPreloaded, setRightCarouselPreloaded] = useState<boolean[]>(Array(heroShowcaseImages.length).fill(false));

  const addLeadMutation = useMutation({
    mutationFn: addLead,
    onSuccess: () => {
      setIsNewsletterSuccess(true);
      safePlayFanfare();
      toast.success("Subscribed!", { description: "Thank you for joining our newsletter." });
      setTimeout(() => {
        setIsNewsletterSuccess(false);
        setShowNewsletterInput(false);
        setNewsletterEmail('');
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to subscribe:", error);
      toast.error("Subscription Failed", { description: "Could not add you to the newsletter. Please try again." });
    },
  });

  // Autoplay effect for carousel
  useEffect(() => {
    if (!isModalOpen && isInView) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroShowcaseImages.length);
      }, 4000); // 4 seconds delay
      return () => clearInterval(interval);
    }
  }, [isModalOpen, isInView]);

  // Preload images for carousel
  useEffect(() => {
    const newPreloadedStatus = [...rightCarouselPreloaded];
    let allLoaded = true;
    heroShowcaseImages.forEach((src, index) => {
      if (!newPreloadedStatus[index]) {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          newPreloadedStatus[index] = true;
          setRightCarouselPreloaded([...newPreloadedStatus]);
        };
        allLoaded = false;
      }
    });
    if (allLoaded) setRightCarouselPreloaded(newPreloadedStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection observer for inView
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const { isSoundEnabled } = useSoundSettings();
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playPopOn] = useSound('/sounds/pop-on.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playPopOff] = useSound('/sounds/pop-off.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playFanfare] = useSound('/sounds/fanfare.mp3', { volume: 0.4, soundEnabled: isSoundEnabled });

  const safePlayHover = useCallback(() => { if (isSoundEnabled) playHover(); }, [isSoundEnabled, playHover]);
  const safePlayClick = useCallback(() => { if (isSoundEnabled) playClick(); }, [isSoundEnabled, playClick]);
  const safePlayPopOn = useCallback(() => { if (isSoundEnabled) playPopOn(); }, [isSoundEnabled, playPopOn]);
  const safePlayPopOff = useCallback(() => { if (isSoundEnabled) playPopOff(); }, [isSoundEnabled, playPopOff]);
  const safePlayFanfare = useCallback(() => { if (isSoundEnabled) playFanfare(); }, [isSoundEnabled, playFanfare]);

  const handleNewsletterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email.");
      return;
    }
    startNewsletterTransition(() => {
      addLeadMutation.mutate({
        Email: newsletterEmail,
        Source: 'Newsletter',
      });
    });
  }, [showNewsletterInput, newsletterEmail, addLeadMutation, safePlayClick]);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(type); safePlayPopOn();
      toast.success("Copied to clipboard!", { description: `${type} copied successfully.`, duration: 2000 });
      setTimeout(() => setCopiedValue(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Copy Failed", { description: "Could not copy text to clipboard." });
    });
  }, [safePlayPopOn]);

  const goToNextRightSlide = useCallback(() => {
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroShowcaseImages.length);
    }, 500);
  }, []);

  const goToPrevRightSlide = useCallback(() => {
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + heroShowcaseImages.length) % heroShowcaseImages.length);
    }, 500);
  }, []);

  const goToRightSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pb-24 overflow-hidden -mt-16 sm:-mt-20" // Added negative margin, removed py-24, added pb-24
    >
      <BackgroundImageCarousel
        currentIndex={currentIndex}
        images={heroShowcaseImages}
        onColorsExtracted={setBackgroundColors}
        backgroundColors={backgroundColors}
        isInView={isInView}
      />
      <div className="container mx-auto px-0 xs:px-2 sm:px-4 z-10 relative pt-24 sm:pt-28 lg:pt-32"> {/* Increased top padding */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 items-center text-center"> {/* Changed to grid-cols-1 and text-center */}
          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            Reawakening Kṛṣṇa Consciousness Worldwide
          </motion.h1>

          {/* Carousel */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-background rounded-3xl shadow-lg">
              <Carousel
                options={{ loop: true }}
                className="relative"
                isAutoPlay={false} // Disable built-in autoplay as we're handling it manually
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                thumbnailSlidesData={heroShowcaseImages.map((src, i) => ({ id: `hero-gallery-image-${i}`, src, alt: `Showcase image ${i + 1}` }))}
              >
                <SliderContainer className="gap-2">
                  {heroShowcaseImages.map((image, index) => (
                    <Slider
                      key={`hero-gallery-image-${index}`}
                      className="xl:h-[400px] sm:h-[350px] h-[300px] w-full"
                    >
                      <div 
                        className="h-full w-full rounded-3xl p-1 relative transition-colors duration-1000"
                        style={{
                          background: backgroundColors.length > 1
                            ? `linear-gradient(145deg, ${backgroundColors[0]}, ${backgroundColors[1]}, ${backgroundColors[2] || backgroundColors[0]})`
                            : 'linear-gradient(145deg, #FFEBCD, #FFB6C1)',
                        }}
                      >
                        <motion.img
                          src={image}
                          width={1200}
                          height={800}
                          alt={`Showcase image ${index + 1}`}
                          className="h-full object-contain rounded-3xl w-full cursor-zoom-in"
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding="async"
                          style={{ aspectRatio: '3/2' }}
                          onClick={() => { setCurrentIndex(index); setIsModalOpen(true); }}
                        />
                        {!rightCarouselPreloaded[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl">
                            <motion.p 
                              className="text-lg font-semibold text-gray-800 dark:text-gray-200"
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                            >
                              Hare Krishna! Chant and Be Happy!
                            </motion.p>
                          </div>
                        )}
                      </div>
                    </Slider>
                  ))}
                </SliderContainer>
                <ThumsSlider />
              </Carousel>
            </div>
          </div>

          {/* Buttons and other foreground elements */}
          <div className="mt-8">
            <HeroForeground
              isInView={isInView}
              bankDetails={bankDetails}
              locationDetails={locationDetails}
              socialLinks={socialLinks}
              rightCarouselImages={heroShowcaseImages}
              onCopyToClipboard={copyToClipboard}
              copiedValue={copiedValue}
              showNewsletterInput={showNewsletterInput}
              setShowNewsletterInput={setShowNewsletterInput}
              isNewsletterPending={isNewsletterPending}
              handleNewsletterSubmit={handleNewsletterSubmit}
              isNewsletterSuccess={isNewsletterSuccess}
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              currentRightCarouselIndex={currentIndex}
              goToNextRightSlide={goToNextRightSlide}
              goToPrevRightSlide={goToPrevRightSlide}
              goToRightSlide={goToRightSlide}
              isLightboxOpen={isModalOpen}
              setIsLightboxOpen={setIsModalOpen}
              lightboxIndex={currentIndex}
              setLightboxIndex={setCurrentIndex}
              safePlayHover={safePlayHover}
              safePlayClick={safePlayClick}
              safePlayPopOn={safePlayPopOn}
              safePlayPopOff={safePlayPopOff}
              safePlayFanfare={safePlayFanfare}
            />
          </div>
        </div>
      </div>
      {/* Modal/Gallery using the same images and currentIndex */}
      <HeroGalleryModal
        images={heroShowcaseImages.map((src, i) => ({ id: `hero-gallery-image-${i}`, src, alt: `Showcase image ${i + 1}` }))}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startIndex={currentIndex}
      />
      {/* Decorative element */}
      {isInView && (
        <motion.div
          className="absolute bottom-12 left-0 w-full h-1"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(233, 74, 156, 0.3), rgba(255, 215, 0, 0.3), transparent)"
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </section>
  );
}
