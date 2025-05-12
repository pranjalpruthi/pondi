import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added Popover imports
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useCallback, useRef } from "react"; // Added React import and useTransition
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
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react'; // Added icon imports
import { Check, Loader2, X } from 'lucide-react'; // Added imports for InputButton and X
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '@/components/animate-ui/buttons/input'; // Import InputButton components
import { cn } from "@/lib/utils"; // Ensure cn is imported
import { toast } from "sonner"; // Import toast function from sonner
import React from "react"; // Ensure React is imported for React.memo

// New array for the showcase slider (foreground right carousel)
const heroShowcaseImages = [
  '/temple-building/1.webp?w=640&format=webp&quality=70', // Existing
  '/temple-building/2.webp?w=640&format=webp&quality=70', // Existing
  '/updates/s2.webp?w=640&format=webp&quality=70',  // New
  '/updates/s3.webp?w=640&format=webp&quality=70',  // New
  '/updates/s4.webp?w=640&format=webp&quality=70',  // New
  '/updates/s5.webp?w=640&format=webp&quality=70',  // New
  '/updates/s6.webp?w=640&format=webp&quality=70',  // New
  '/updates/s7.webp?w=640&format=webp&quality=70',  // New,
  '/temple-building/3.webp?w=640&format=webp&quality=70', // Existing
  '/temple-building/4.webp?w=640&format=webp&quality=70', // Existing
  '/temple-building/5.webp?w=640&format=webp&quality=70', // Existing
];

// Smaller blur backgrounds
// Now derived from heroShowcaseImages to match the foreground slider
const blurredBackgrounds = heroShowcaseImages.map(img => {
  if (img.includes('?w=')) { // It's an optimization URL
    return img.replace('w=640', 'w=30') // Assuming original width is 640 for these
              .replace('quality=70', 'quality=40') // Assuming original quality is 70
              .replace('format=webp', 'format=webp&blur=50'); // Add blur
  } else { // It's a direct path
    // Append optimization and blur params for direct paths
    const separator = img.includes('?') ? '&' : '?';
    return `${img}${separator}w=30&format=webp&quality=40&blur=50`;
  }
});

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

// Component for Background Image Carousel
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
}) => {
  return (
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
            {/* First load a very small blurred image */}
            {blurredBackgrounds[currentIndex] && (
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-xl"
                style={{ backgroundImage: `url(${blurredBackgrounds[currentIndex]})` }}
              />
            )}
            
            {/* Then load the full quality image with blur filter applied */}
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
};

// After the socialLinks array definition, add a new component for the lightbox
const ImageLightbox = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  setCurrentIndex 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  images: string[]; 
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (!isOpen) return null;
  
  const goToNext = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div 
          className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`lightbox-${currentIndex}`}
              src={images[currentIndex]}
              alt={`Gallery Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
            >
              <IconChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <IconChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Component for Hero Foreground Content
interface HeroForegroundProps {
  isInView: boolean;
  // Props for text, CTAs, popovers, newsletter, right-side carousel
  bankDetails: typeof bankDetails;
  locationDetails: typeof locationDetails;
  socialLinks: typeof socialLinks;
  rightCarouselImages: string[]; // Renamed from optimizedImages to avoid confusion
  onCopyToClipboard: (text: string, type: string) => void;
  copiedValue: string | null;
  // Newsletter state and handlers
  showNewsletterInput: boolean;
  setShowNewsletterInput: React.Dispatch<React.SetStateAction<boolean>>;
  isNewsletterPending: boolean;
  handleNewsletterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isNewsletterSuccess: boolean;
  newsletterEmail: string;
  setNewsletterEmail: (email: string) => void;
  // Right side carousel state and handlers
  currentRightCarouselIndex: number;
  goToNextRightSlide: () => void;
  goToPrevRightSlide: () => void;
  goToRightSlide: (index: number) => void;
  isRightCarouselLoading: boolean; // Assuming a separate loading for this one if needed
  
  // Add new props for lightbox
  isLightboxOpen: boolean;
  setIsLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lightboxIndex: number;
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
}

const HeroForeground = React.memo<HeroForegroundProps>(({
  isInView,
  bankDetails,
  locationDetails,
  socialLinks,
  rightCarouselImages,
  onCopyToClipboard,
  copiedValue,
  showNewsletterInput,
  setShowNewsletterInput,
  isNewsletterPending,
  handleNewsletterSubmit,
  isNewsletterSuccess,
  newsletterEmail,
  setNewsletterEmail,
  currentRightCarouselIndex,
  goToNextRightSlide,
  goToPrevRightSlide,
  goToRightSlide,
  isRightCarouselLoading,
  setIsLightboxOpen,
  setLightboxIndex,
}) => {
  return (
    <div className="container mx-auto px-6 z-10 relative"> {/* Increased horizontal padding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Text and CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          className="text-left max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-[100px]"
          >
            <img
              src="/assets/iskmj.jpg"
              alt="ISKM Logo"
              className="rounded-full w-full"
            />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ delay: 0.3 }}
          >
            Reawakening Kṛṣṇa Consciousness Worldwide
          </motion.h1>
          <motion.p
            className="text-lg mb-8 text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.4 }}
          >
            Join us and help spread Śrīla Prabhupāda's teachings
            to guide everyone back to home, back to Godhead!
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
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
                        onClick={() => onCopyToClipboard(bankDetails.accountNo, 'Account No')}
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
                         onClick={() => onCopyToClipboard(bankDetails.ifsc, 'IFSC Code')}
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
            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full max-w-[300px]"
            >
              <InputButtonProvider showInput={showNewsletterInput} setShowInput={setShowNewsletterInput}>
                <InputButton className="bg-[#e94a9c] hover:bg-[#d3428c] border-none rounded-full">
                  <InputButtonAction
                    className="text-white bg-transparent border-none hover:bg-white/10"
                  >
                    Join the newsletter
                  </InputButtonAction>
                  <InputButtonSubmit
                    type="submit"
                    disabled={isNewsletterPending}
                    className={cn(
                      "bg-white/20 hover:bg-white/30 text-white",
                      isNewsletterPending || isNewsletterSuccess ? 'aspect-square px-0' : ''
                    )}
                  >
                    {isNewsletterSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4"/>
                      </motion.span>
                    ) : isNewsletterPending ? (
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
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={isNewsletterPending}
                  required
                  className="text-sm placeholder:text-gray-500"
                  autoFocus
                />
              </InputButtonProvider>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap justify-start gap-4 items-center"
          >
             <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer">
               <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                 <IconPlayerPlayFilled className="mr-2 h-4 w-4" /> Watch Live
               </Button>
             </a>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex justify-start gap-3"
          >
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95"
                aria-label={`Follow us on ${item.label}`}
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "cursor-pointer p-2 transition-colors duration-200",
                    item.color
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </Badge>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content - Image Carousel (This is the foreground one) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="relative aspect-[4/3] w-full max-w-xl mx-auto lg:ml-auto"
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 shadow-xl">
            {isRightCarouselLoading && isInView && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 z-20">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
              </div>
            )}
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                {isInView && (
                  <motion.img
                    key={`carousel-fg-${currentRightCarouselIndex}`}
                    src={rightCarouselImages[currentRightCarouselIndex]}
                    alt={`Showcase Image ${currentRightCarouselIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(233, 74, 156, 0.25), 0 8px 24px -8px rgba(255, 215, 0, 0.15)"
                    }}
                    onClick={() => {
                      setLightboxIndex(currentRightCarouselIndex);
                      setIsLightboxOpen(true);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                onClick={goToPrevRightSlide}
              >
                <IconChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
                onClick={goToNextRightSlide}
              >
                <IconChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {rightCarouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToRightSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentRightCarouselIndex
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
  );
});
HeroForeground.displayName = "HeroForeground";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(true);

  // State for Right Foreground Carousel (managed separately)
  // This will now also drive the background carousel
  const [currentRightCarouselIndex, setCurrentRightCarouselIndex] = useState(0);
  const rightAutoplayTimerRef = useRef<number | null>(null);
  // Add loading state for right carousel if images are different or need separate preloading
  const [isRightCarouselLoading, setIsRightCarouselLoading] = useState(true); // Example, adjust if needed
  const [rightCarouselPreloaded, setRightCarouselPreloaded] = useState<boolean[]>(Array(heroShowcaseImages.length).fill(false));

  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [showNewsletterInput, setShowNewsletterInput] = useState(false);
  const [isNewsletterPending, startNewsletterTransition] = useTransition();
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Add state for the lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleNewsletterSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!showNewsletterInput) {
        setShowNewsletterInput(true);
        return;
      }
      startNewsletterTransition(async () => {
        await sleep(2000);
        setIsNewsletterSuccess(true);
        toast.success("Subscribed!", { description: "Thank you for joining our newsletter." });
        await sleep(2000);
        setIsNewsletterSuccess(false);
        setShowNewsletterInput(false);
        setNewsletterEmail('');
      });
    },
    [showNewsletterInput, newsletterEmail, startNewsletterTransition]
  );

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(type);
      toast.success("Copied to clipboard!", {
        description: `${type} copied successfully.`,
        duration: 2000,
      });
      setTimeout(() => setCopiedValue(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Copy Failed", { description: "Could not copy text to clipboard." });
    });
  }, []);

  // Carousel navigation functions
  const goToNextRightSlide = useCallback(() => {
    setCurrentRightCarouselIndex((prev) => (prev + 1) % heroShowcaseImages.length);
  }, []);

  const goToPrevRightSlide = useCallback(() => {
    setCurrentRightCarouselIndex((prev) => (prev - 1 + heroShowcaseImages.length) % heroShowcaseImages.length);
  }, []);
  
  const goToRightSlide = useCallback((index: number) => {
    setCurrentRightCarouselIndex(index);
  }, []);

  // Start autoplay function
  const startAutoplay = useCallback(() => {
    if (rightAutoplayTimerRef.current) clearTimeout(rightAutoplayTimerRef.current);
    // @ts-ignore
    rightAutoplayTimerRef.current = setTimeout(() => {
      goToNextRightSlide();
      if (isInView) startAutoplay(); // Continue loop if in view
    }, 6000);
  }, [goToNextRightSlide, isInView]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
      
      // Start or stop autoplay based on visibility
      if (entry.isIntersecting) {
        startAutoplay();
      } else if (rightAutoplayTimerRef.current) {
        clearTimeout(rightAutoplayTimerRef.current);
      }
    }, { threshold: 0.1 });
    
    observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (rightAutoplayTimerRef.current) clearTimeout(rightAutoplayTimerRef.current);
    };
  }, [startAutoplay]);

  // Preloading for carousel images
  useEffect(() => {
    if (!isInView) return;
    
    const newPreloadedStatus = [...rightCarouselPreloaded];
    let allLoaded = true;
    
    heroShowcaseImages.forEach((src, index) => {
        if(!newPreloadedStatus[index]) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                newPreloadedStatus[index] = true;
                setRightCarouselPreloaded([...newPreloadedStatus]);
                if (newPreloadedStatus.every(status => status)) setIsRightCarouselLoading(false);
            };
            allLoaded = false;
        }
    });
    
    if (allLoaded) setIsRightCarouselLoading(false);
  }, [isInView, rightCarouselPreloaded]);

  // Start autoplay when component mounts and is visible
  useEffect(() => {
    if (isInView) startAutoplay();
    
    return () => {
      if (rightAutoplayTimerRef.current) clearTimeout(rightAutoplayTimerRef.current);
    };
  }, [isInView, startAutoplay]);

  // Add pause/resume autoplay on document visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rightAutoplayTimerRef.current) clearTimeout(rightAutoplayTimerRef.current);
      } else if (isInView) {
        startAutoplay();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isInView, startAutoplay]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      <BackgroundImageCarousel
        currentIndex={currentRightCarouselIndex}
        images={heroShowcaseImages}
        blurredBackgrounds={blurredBackgrounds}
        preloadedImages={rightCarouselPreloaded}
        isInView={isInView}
      />
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
        currentRightCarouselIndex={currentRightCarouselIndex}
        goToNextRightSlide={goToNextRightSlide}
        goToPrevRightSlide={goToPrevRightSlide}
        goToRightSlide={goToRightSlide}
        isRightCarouselLoading={isRightCarouselLoading}
        
        // Add new props for lightbox functionality
        isLightboxOpen={isLightboxOpen}
        setIsLightboxOpen={setIsLightboxOpen}
        lightboxIndex={lightboxIndex}
        setLightboxIndex={setLightboxIndex}
      />
      
      {/* Add the ImageLightbox component */}
      <ImageLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={heroShowcaseImages}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />
      
      {/* Simplified decorative element */}
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
