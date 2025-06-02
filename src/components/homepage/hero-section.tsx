import { motion, AnimatePresence } from "motion/react"; // Updated import, removed LayoutGroup
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
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
    IconPlayerPlayFilled,
    IconCopy,
    IconCheck,
    IconPigMoney,

} from '@tabler/icons-react';
import { Check, Loader2, X } from 'lucide-react';
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '@/components/animate-ui/buttons/input';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React from "react";

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

const blurredBackgrounds = heroShowcaseImages.map(img => 
  img.replace('w=1200', 'w=30').replace('quality=80', 'quality=40') + '&blur=50'
);

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface BackgroundImageCarouselProps {
  currentIndex: number;
  images: string[];
  blurredBackgrounds: string[];
  preloadedImages: boolean[];
  isInView: boolean;
}

const BackgroundImageCarousel: React.FC<BackgroundImageCarouselProps> = ({
  currentIndex,
  images,
  blurredBackgrounds,
  preloadedImages,
  isInView,
}) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <AnimatePresence mode="wait">
      {isInView && (
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Blurred background */}
          {blurredBackgrounds[currentIndex] && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 blur-xl"
              style={{ backgroundImage: `url(${blurredBackgrounds[currentIndex]})` }}
            />
          )}
          {/* Main image with blur */}
          <img
            src={images[currentIndex]}
            alt={`Temple Image ${currentIndex + 1}`}
            className="w-full h-full object-cover filter blur-lg scale-110"
            style={{ opacity: preloadedImages[currentIndex] ? 1 : 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/70" />
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
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const thumbnailCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
    }
  }, [open, startIndex]);

  const currentImageItem = images[currentIndex];

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
          className='fixed inset-0 z-50 flex flex-col items-center w-full h-screen justify-center dark:bg-black/80 bg-gray-300/80 backdrop-blur-lg cursor-zoom-out'
          onClick={onClose}
        >
          <button
            className='absolute top-4 right-4 p-2 rounded-full dark:bg-black/70 bg-gray-500/50 text-white z-10 hover:dark:bg-black/90 hover:bg-gray-500/70'
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close gallery modal"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div
            className='rounded-md w-full h-full md:h-[90%] md:w-[90%] max-w-6xl max-h-[90dvh] flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center p-2 md:p-4 cursor-auto'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Display */}
            <div
              className='flex-1 flex items-center justify-center w-full md:h-auto overflow-hidden p-2 min-h-0'
            >
              <motion.img
                key={currentImageItem.id}
                src={currentImageItem.src}
                alt={currentImageItem.alt}
                className='object-contain max-h-[60dvh] md:max-h-[75dvh] max-w-full rounded-md shadow-lg bg-white/10 dark:bg-black/10'
                width={1200}
                height={800}
                loading="eager"
                decoding="async"
              />
            </div>

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
                    className={`relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all w-20 h-16 flex-shrink-0 ${imgData.id === currentImageItem.id ? 'ring-2 ring-primary border-primary' : 'border-transparent'}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={imgData.src.replace('w=1200', 'w=200').replace('quality=80', 'quality=60')}
                      alt={`Thumbnail ${imgData.alt}`}
                      className='w-full h-full object-cover rounded pointer-events-none'
                      width={100}
                      height={66}
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
                    className={`relative p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all w-20 h-16 md:w-24 md:h-16 flex-shrink-0 ${imgData.id === currentImageItem.id ? 'ring-2 ring-primary border-primary' : 'border-transparent'}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={imgData.src.replace('w=1200', 'w=200').replace('quality=80', 'quality=60')}
                      alt={`Thumbnail ${imgData.alt}`}
                      className='w-full h-full object-cover rounded pointer-events-none'
                      width={100}
                      height={66}
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: props.isInView ? 1 : 0, x: props.isInView ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Logo div removed */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: props.isInView ? 1 : 0, y: props.isInView ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            Reawakening Kṛṣṇa Consciousness Worldwide
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: props.isInView ? 1 : 0 }}
            transition={{ delay: 0.4 }}
          >
            Join us and help spread Śrīla Prabhupāda's teachings
            to guide everyone back to home, back to Godhead!
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: props.isInView ? 1 : 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Popover onOpenChange={(open) => open && props.safePlayPopOn()}>
              <PopoverTrigger asChild>
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full cursor-pointer"
                  onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}
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
            <form onSubmit={props.handleNewsletterSubmit} className="w-full max-w-[300px]">
              <InputButtonProvider showInput={props.showNewsletterInput} setShowInput={props.setShowNewsletterInput}>
                <InputButton className="bg-[#e94a9c] hover:bg-[#d3428c] border-none rounded-full" onMouseEnter={props.safePlayHover}>
                  <InputButtonAction className="text-white bg-transparent border-none hover:bg-white/10" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                    Join the newsletter
                  </InputButtonAction>
                  <InputButtonSubmit type="submit" disabled={props.isNewsletterPending} onClick={props.safePlayClick} onMouseEnter={props.safePlayHover} className={cn("bg-slate-700 text-white hover:bg-slate-800 dark:bg-pink-600 dark:hover:bg-pink-700 dark:text-white", props.isNewsletterPending || props.isNewsletterSuccess ? 'aspect-square px-0' : '')}>
                    {props.isNewsletterSuccess ? <motion.span key="success" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}><Check className="h-4 w-4"/></motion.span> : props.isNewsletterPending ? <motion.span key="pending" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}><Loader2 className="animate-spin h-4 w-4" /></motion.span> : 'Subscribe'}
                  </InputButtonSubmit>
                </InputButton>
                <InputButtonInput type="email" placeholder="your-email@example.com" value={props.newsletterEmail} onChange={(e) => props.setNewsletterEmail(e.target.value)} disabled={props.isNewsletterPending} required className="text-sm placeholder:text-gray-500" autoFocus />
              </InputButtonProvider>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: props.isInView ? 1 : 0 }} transition={{ delay: 0.7 }} className="mt-8 flex flex-wrap justify-start gap-4 items-center">
            <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover} className="cursor-pointer">
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-full"><IconPlayerPlayFilled className="mr-2 h-4 w-4" /> Watch Live</Button>
            </a>
            <Popover onOpenChange={(open) => open && props.safePlayPopOn()}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}><IconMapPin className="mr-2 h-4 w-4" /> Our Location</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <h3 className="font-semibold mb-2">ISKM Pudhuvai Temple</h3>
                <p className="text-sm text-muted-foreground mb-3">{props.locationDetails.address}</p>
                <div className="flex flex-col space-y-2 mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit"><IconCar className="h-3 w-3" />Book Temple Tour</Badge>
                  <a href={`tel:${props.locationDetails.tourPhone}`} className="w-fit" onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                    <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer hover:bg-accent"><IconPhone className="h-3 w-3" />{props.locationDetails.tourPhone}</Badge>
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center text-sm mb-1"><IconClock className="mr-2 h-4 w-4" /> Opening Hours:</h4>
                  <ul className="text-sm text-muted-foreground space-y-0.5">{props.locationDetails.hours.map((line, i) => <li key={i}>{line}</li>)}</ul>
                </div>
                <div className="mt-4">
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => { window.open(props.locationDetails.mapsLink, '_blank'); props.safePlayClick(); }} onMouseEnter={props.safePlayHover}><IconMapPin className="mr-2 h-4 w-4" />Open in Maps</Button>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: props.isInView ? 1 : 0 }} transition={{ delay: 0.8 }} className="mt-6 flex justify-start gap-3">
            {props.socialLinks.map((item, index) => (
              <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" aria-label={`Follow us on ${item.label}`} onClick={props.safePlayClick} onMouseEnter={props.safePlayHover}>
                <Badge variant="secondary" className={cn("cursor-pointer p-2 transition-colors duration-200", item.color)}><item.icon className="h-4 w-4" /></Badge>
              </a>
            ))}
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
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [showNewsletterInput, setShowNewsletterInput] = useState(false);
  const [isNewsletterPending, startNewsletterTransition] = useTransition();
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Preloading for background
  const [rightCarouselPreloaded, setRightCarouselPreloaded] = useState<boolean[]>(Array(heroShowcaseImages.length).fill(false));

  // Preload images for background
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
    if (!showNewsletterInput) {
      setShowNewsletterInput(true);
      safePlayClick(); return;
    }
    startNewsletterTransition(async () => {
      await sleep(2000); setIsNewsletterSuccess(true); safePlayFanfare();
      toast.success("Subscribed!", { description: "Thank you for joining our newsletter." });
      await sleep(2000); setIsNewsletterSuccess(false); setShowNewsletterInput(false); setNewsletterEmail('');
    });
  }, [showNewsletterInput, startNewsletterTransition, safePlayClick, safePlayFanfare]);

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
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      <BackgroundImageCarousel
        currentIndex={currentIndex}
        images={heroShowcaseImages}
        blurredBackgrounds={blurredBackgrounds}
        preloadedImages={rightCarouselPreloaded}
        isInView={isInView}
      />
      <div className="container mx-auto px-0 xs:px-2 sm:px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text, CTAs, etc. */}
          <div>
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
          {/* Right: Carousel */}
          <div>
            <div className="2xl:w-[90%] sm:w-[95%] w-full bg-background mx-auto rounded-3xl shadow-lg">
              <Carousel
                options={{ loop: true }}
                className="relative"
                isAutoPlay={true}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                thumbnailSlidesData={heroShowcaseImages.map((src, i) => ({ id: `hero-gallery-image-${i}`, src, alt: `Showcase image ${i + 1}` }))}
                // onSlideClick={(idx) => { setCurrentIndex(idx); setIsModalOpen(true); }} // Removed as onSlideClick is not a prop of Carousel
              >
                <SliderContainer className="gap-2">
                  {heroShowcaseImages.map((image, index) => (
                    <Slider
                      key={`hero-gallery-image-${index}`}
                      className="xl:h-[400px] sm:h-[350px] h-[300px] w-full"
                    >
                      <motion.img
                        src={image}
                        width={1200}
                        height={800}
                        alt={`Showcase image ${index + 1}`}
                        className="h-full object-cover rounded-3xl w-full cursor-zoom-in"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        style={{ aspectRatio: '3/2' }}
                        onClick={() => { setCurrentIndex(index); setIsModalOpen(true); }}
                      />
                    </Slider>
                  ))}
                </SliderContainer>
                <ThumsSlider />
              </Carousel>
            </div>
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
