import { Link, useRouterState } from '@tanstack/react-router';
import { motion, MotionConfig, AnimatePresence, type Transition } from 'motion/react'; // Added AnimatePresence
import * as React from 'react';
import { cn } from '@/lib/utils';
import useMeasure from 'react-use-measure'; // Added useMeasure
import useClickOutside from '@/hooks/useClickOutside'; // Added useClickOutside
import IconHome from 'virtual:icons/line-md/home-md-alt-twotone'
import IconTemple from 'virtual:icons/fluent-emoji-flat/hindu-temple'
import IconCalendar from 'virtual:icons/uim/calender'
import IconInfo from 'virtual:icons/line-md/alert-circle-twotone-loop';
import IconRobo from 'virtual:icons/mdi/robot-outline';
import { Menu, Volume2, VolumeX, Globe as GlobeIcon, ShoppingBag as ShoppingBagIcon, Phone, ArrowLeft, MapPin, Youtube } from "lucide-react"; // Added ShoppingBagIcon, Youtube, PartyPopper
import { IconBrandFacebook, IconBrandTelegram, IconBrandInstagram, IconBrandYoutube, IconBrandWhatsapp } from '@tabler/icons-react';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { SoundProvider } from '@/components/context/sound-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTempleStatus } from '@/hooks/useTempleStatus'; // Added
import { TempleEvents, TempleEventsPanel } from '@/components/temple-events';
import { DeityDarshan } from '@/components/deity-darshan';
import { SignedIn, SignedOut, UserButton, SignInButton, SignOutButton } from '@clerk/tanstack-react-start';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Suspense } from 'react'; // Added Suspense import
import { addLead } from '@/integrations/nocodb-api';
import { UpcomingEventBanner } from '@/components/homepage/UpcomingEventBanner';

import ShimmerText from '@/components/ui/shimmer-text'; // Added
import { AppleChatInput } from '@/components/ui/apple-chat-input';
import { ThreeDotSimpleLoader } from '@/components/ui/three-dot-loader';
import useAutoScroll from '@/hooks/use-auto-scroll';
import { ClipsPanel } from '@/components/homepage/clips-panel'; // Changed to import ClipsPanel

// --- FestivalToggleButton Component ---
interface FestivalToggleButtonProps {
  isEventBannerOpen: boolean;
  setIsEventBannerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainDockAppearanceTransition: Transition;
  isMobile: boolean;
}

const FestivalToggleButton: React.FC<FestivalToggleButtonProps> = ({
  isEventBannerOpen,
  setIsEventBannerOpen,
  mainDockAppearanceTransition,
  isMobile,
}) => {
  // This button is now mobile-only.
  if (!isMobile) return null;

  const buttonContent = isEventBannerOpen ? 'Close' : 'Festivals';
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...mainDockAppearanceTransition, delay: 0.6 }}
      onClick={() => setIsEventBannerOpen(prev => !prev)}
      className="absolute right-4 -top-10 z-10 pointer-events-auto flex items-center justify-center h-8 px-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg transition-transform duration-200 transform-gpu hover:scale-105 active:scale-95"
      aria-label={isEventBannerOpen ? "Close Upcoming Event Banner" : "Open Upcoming Event Banner"}
    >
      {buttonContent}
    </motion.button>
  );
};
// --- End FestivalToggleButton Component ---

// Define types for DockItem and its props
interface DockItemData {
  id: number;
  label: string;
  title: React.ReactNode; // Changed from JSX.Element
  subtitle: string;
  action?: () => void;
  isLink?: boolean;
  to?: string;
  isExpandable?: boolean;
  content?: React.ReactNode; // Changed from JSX.Element
  customStyling?: string; // Added for custom styling
}

interface DockItemComponentProps {
  item: DockItemData;
  isMobile: boolean;
  templeStatus: ReturnType<typeof useTempleStatus>;
  activeLabelItemId: number | null;
  hoveredLabelItemId: number | null;
  isDockOpen: boolean;
  activeDockItem: number | null;
  dockSpringTransition: object;
  onItemClick: (item: DockItemData) => void;
  onItemMouseEnter: (item: DockItemData) => void;
}

const DockItemComponent = React.memo<DockItemComponentProps>(({
  item,
  isMobile,
  templeStatus,
  activeLabelItemId,
  hoveredLabelItemId,
  isDockOpen,
  activeDockItem,
  dockSpringTransition,
  onItemClick,
  onItemMouseEnter,
}) => {
  const isLabelClickedActive = activeLabelItemId === item.id && !item.isExpandable;
  const isLabelHoveredActive = hoveredLabelItemId === item.id && !item.isExpandable;
  const isLabelVisible = isLabelClickedActive || isLabelHoveredActive;
  
  const isMainMenuPanelActive = item.isExpandable && activeDockItem === item.id && isDockOpen;

  const isDeityButton = item.label === 'Deities';
  const isAiBotButton = item.label === 'AI Bot';
  const isClipsButton = item.label === 'Clips';
  const isDonateButton = item.label === 'Donate';
  const isFestivalsButton = item.id === 10; // Added for the Festivals button
  let deityButtonSpecificStyles = "";
  if (isDeityButton) {
      const statusColorClass = templeStatus.colorClass;
      let subtleBg = "bg-gray-400/20 dark:bg-gray-600/20";
      let subtleText = "text-gray-700 dark:text-gray-300";
      let subtleHoverBg = "hover:bg-gray-400/30 dark:hover:bg-gray-600/30";

      if (statusColorClass.includes('green')) {
          subtleBg = "bg-green-400/20 dark:bg-green-500/20";
          subtleText = "text-green-700 dark:text-green-300";
          subtleHoverBg = "hover:bg-green-400/30 dark:hover:bg-green-500/30";
      } else if (statusColorClass.includes('pink')) {
          subtleBg = "bg-pink-400/20 dark:bg-pink-500/20";
          subtleText = "text-pink-700 dark:text-pink-300";
          subtleHoverBg = "hover:bg-pink-400/30 dark:hover:bg-pink-500/30";
      } else if (statusColorClass.includes('red')) {
          subtleBg = "bg-red-400/20 dark:bg-red-500/20";
          subtleText = "text-red-700 dark:text-red-300";
          subtleHoverBg = "hover:bg-red-400/30 dark:hover:bg-red-500/30";
      } else if (statusColorClass.includes('gray')) {
          subtleBg = "bg-gray-400/20 dark:bg-gray-600/20";
          subtleText = "text-gray-700 dark:text-gray-400";
          subtleHoverBg = "hover:bg-gray-400/30 dark:hover:bg-gray-600/30";
      } else if (statusColorClass.includes('yellow')) {
          subtleBg = "bg-yellow-400/20 dark:bg-yellow-500/20";
          subtleText = "text-yellow-700 dark:text-yellow-300";
          subtleHoverBg = "hover:bg-yellow-400/30 dark:hover:bg-yellow-500/30";
      } else if (statusColorClass.includes('orange')) {
          subtleBg = "bg-orange-400/20 dark:bg-orange-500/20";
          subtleText = "text-orange-700 dark:text-orange-300";
          subtleHoverBg = "hover:bg-orange-400/30 dark:hover:bg-orange-500/30";
      }
      deityButtonSpecificStyles = cn(subtleBg, subtleText, subtleHoverBg);
  }

  const itemContent = (
    <div className={cn(
      "flex items-center h-full w-full transition-all duration-200 ease-out",
      isLabelVisible ? "justify-start pl-2 pr-1 sm:pl-3 sm:pr-2" : "justify-center items-center"
    )}>
      <div className={cn("flex flex-col items-center", isLabelVisible ? "" : "text-center")}>
        {item.title} {/* Icon */}
        {item.subtitle && ! (isClipsButton && !isMainMenuPanelActive && !isLabelVisible) && ( // Hide subtitle for Clips button if panel not open and not a label interaction
          <span className={cn(
            "text-[0.65rem] sm:text-[0.7rem] mt-1 font-medium",
            isLabelVisible ? "hidden" : "block", // This handles general label visibility
            (isClipsButton && !isMainMenuPanelActive) ? "hidden" : "block", // Specifically hide for clips button if panel not open
            isDeityButton && templeStatus.colorClass.includes('gray') ? "text-gray-500 dark:text-gray-400" :
            isDeityButton && templeStatus.colorClass.includes('red') ? "text-red-600 dark:text-red-400" :
            isDeityButton && templeStatus.colorClass.includes('pink') ? "text-pink-600 dark:text-pink-400" :
            isDeityButton && templeStatus.colorClass.includes('green') ? "text-green-600 dark:text-green-400" :
            isDeityButton && templeStatus.colorClass.includes('yellow') ? "text-yellow-600 dark:text-yellow-400" :
            isDeityButton && templeStatus.colorClass.includes('orange') ? "text-orange-600 dark:text-orange-400" :
            "text-foreground/70"
          )}>
            {item.subtitle}
          </span>
        )}
      </div>
      <AnimatePresence>
        {isLabelVisible && !isMobile && (
          <motion.span
            className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap transform-gpu"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
  
  const baseItemClasses = "relative flex items-center rounded-xl cursor-pointer overflow-hidden h-14 sm:h-16 text-foreground/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]";
  
  const itemWidth = isClipsButton // Clips button is always circular (width = height)
                    ? (isMobile ? 56 : 64)
                    : item.isExpandable
                      ? (isMobile ? 56 : 64)
                      : (isLabelVisible ? (isMobile ? 56 : 130) : (isMobile ? 56 : 64));

  let itemSpecificStyling = "";

  if (isClipsButton) {
    if (isMainMenuPanelActive) { // Clips Panel is open
      itemSpecificStyling = "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg ring-2 ring-white/50 rounded-full aspect-square scale-110 transform transition-all duration-300"; // Active Clips style
    } else { // Clips Panel is closed - default highlighted state
      itemSpecificStyling = "bg-gradient-to-br from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg ring-1 ring-white/20 hover:ring-white/40 rounded-full aspect-square transition-all duration-200 transform hover:scale-105"; // Default Highlighted Clips style
    }
  } else if (isAiBotButton) {
    if (isMainMenuPanelActive) { // AI Panel is open
      // Active AI style: Gold/Yellow gradient, prominent shadow, ring
      // Dark mode: Slightly desaturated gold/amber, less bright text
      itemSpecificStyling = "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white dark:from-amber-500 dark:via-yellow-600 dark:to-orange-600 dark:text-amber-50 shadow-lg ring-2 ring-white/30 dark:ring-amber-400/40 scale-105 transform transition-all duration-300 rounded-xl";
    } else { // AI Panel is closed - default highlighted state
      // Default Highlighted AI style: Gold/Yellow gradient, subtle shadow, hover effects
      // Dark mode: More muted gold/amber, softer text and hover
      itemSpecificStyling = "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 text-yellow-900 dark:text-amber-200 dark:from-amber-600/80 dark:via-yellow-700/80 dark:to-orange-700/80 hover:from-yellow-400 hover:to-orange-500 dark:hover:from-amber-500 dark:hover:to-orange-600 shadow-md hover:shadow-lg ring-1 ring-amber-500/30 dark:ring-amber-700/50 hover:ring-amber-500/50 dark:hover:ring-amber-500/70 transition-all duration-200 transform hover:scale-105 rounded-xl";
    }
  } else if (isDonateButton) {
    // Style for the Donate button
    itemSpecificStyling = "bg-gradient-to-br from-green-300 to-emerald-400 text-green-900 dark:from-green-500 dark:to-emerald-600 dark:text-white hover:from-green-400 hover:to-emerald-500 shadow-md hover:shadow-lg ring-1 ring-white/20 hover:ring-white/40 transition-all duration-200 rounded-xl";
  } else if (isFestivalsButton) {
    // Style for the Festivals button - using a vibrant blue gradient
    itemSpecificStyling = "bg-gradient-to-br from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-600 shadow-md hover:shadow-lg ring-1 ring-white/20 hover:ring-white/40 transition-all duration-200 rounded-xl";
  } else if (isDeityButton) {
    itemSpecificStyling = deityButtonSpecificStyles;
  } else if (isMainMenuPanelActive || isLabelVisible) { // For other items (like Menu button or regular hovered/clicked items)
    itemSpecificStyling = "bg-pink-100/70 dark:bg-pink-700/70 text-primary";
  } else { // Default hover for other non-active, non-deity, non-AI, non-Shorts buttons
    itemSpecificStyling = "hover:bg-pink-100/50 dark:hover:bg-amber-500/30 hover:text-amber-400";
  }

  const combinedItemClasses = cn(baseItemClasses, itemSpecificStyling);

  if (item.isLink && item.to) {
    return (
      <motion.div
        key={item.id}
        layout
        className={combinedItemClasses}
        animate={{ width: itemWidth }}
        transition={dockSpringTransition}
        onMouseEnter={() => onItemMouseEnter(item)}
      >
        <Link
          to={item.to}
          aria-label={item.label}
          className="w-full h-full flex"
          onClick={() => onItemClick(item)}
        >
          {itemContent}
        </Link>
      </motion.div>
    );
  } else {
    return (
      <motion.button
        key={item.id}
        type="button"
        aria-label={item.label}
        layout
        className={combinedItemClasses}
        animate={{ width: itemWidth }}
        transition={dockSpringTransition}
        onClick={() => onItemClick(item)}
        onMouseEnter={() => onItemMouseEnter(item)}
      >
        {itemContent}
      </motion.button>
    );
  }
});
DockItemComponent.displayName = 'DockItemComponent';


const navItems = [
  {
    icon: IconHome,
    label: 'Home',
    to: '/',
    iconClassName: "text-primary/80"
  },
  { icon: IconTemple, label: 'Deities', to: '/deities', iconClassName: "text-primary/80" },
  { icon: IconCalendar, label: 'Calendar', to: '/calender', iconClassName: "text-primary/80" },
  { icon: ShoppingBagIcon, label: 'Shop', to: '/shop', iconClassName: "text-primary/80" }, // Added Shop item
  { icon: GlobeIcon, label: 'Centers', to: '/centers', iconClassName: "text-primary/80" },
  { icon: IconInfo, label: 'About', to: '/about', iconClassName: "text-primary/80" },
];

const templeTimingsData = [
  { event: "Mangal Aarati", time: "4:30 AM" },
  { event: "Darshan Aarati", time: "7:15 AM" },
  { event: "Guru Puja", time: "7:20 AM" },
  { event: "Bhagvatam Discourse", time: "8:00 AM" },
  { event: "Temple Closes", time: "12:00 PM" },
  { event: "Gaura Arati", time: "5:30 PM" },
  { event: "Temple Closes", time: "6:30 PM" }
];

const bankDetailsData = {
  accountName: "ISKM PONDICHERRY",
  accountType: "SAVINGS ACCOUNT",
  accountNo: "1197110110052583",
  ifscCode: "UJVN0001197",
  bankName: "UJJIVAN BANK, PONDICHERRY BRANCH"
};

const formatTimingsForCopy = () => {
  return templeTimingsData.map(timing => `${timing.event}: ${timing.time}`).join('\n');
};

const formatBankDetailsForCopy = () => {
  return `Account Name: ${bankDetailsData.accountName}\nAccount Type: ${bankDetailsData.accountType}\nAccount No: ${bankDetailsData.accountNo}\nIFSC Code: ${bankDetailsData.ifscCode}\nBank: ${bankDetailsData.bankName}`;
};

const StarIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("size-8", className)}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating = ({ rating, setRating, hoverRating, setHoverRating }: { rating: number; setRating: (r: number) => void; hoverRating: number; setHoverRating: (h: number) => void; }) => (
    <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
                key={star}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
            >
                <StarIcon
                    className={cn(
                        "transition-colors duration-200",
                        (hoverRating || rating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                    )}
                    filled={(hoverRating || rating) >= star}
                />
            </motion.div>
        ))}
    </div>
);

const AIPanel = React.memo(() => {
  const initialGreeting = (
    <div className="text-center whitespace-pre-wrap font-medium">
      <p>🌹🪷🪷🌹🪷🌹🪷🪷🌹</p>
      <p>🙌 Hare Kṛṣṇa! prabhu / mataji 🙌</p>
      <p>🤖 ISKM Bhakta Bot reporting</p>
      <p>🙇‍♂️ Dandwat pranam, please accept my humble obesiances 🙇‍♂️</p>
      <p>🌹🪷🪷🌹🪷🌹🪷🪷🌹</p>
    </div>
  );

  const [messages, setMessages] = React.useState<Array<{ id: number; sender: 'user' | 'bot'; content: React.ReactNode; }>>([
    { id: 1, sender: 'bot', content: initialGreeting }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState(false);
const nextMessageId = React.useRef(2); // Start IDs from 2

  const prabhupadaTeachings = [
    "Chant Hare Krishna and your life will be sublime.",
    "Religion without philosophy is sentiment, or sometimes fanaticism, while philosophy without religion is mental speculation.",
    "A grain of spiritual force can overcome mountains of material opposition.",
    "The purpose of human life is to inquire about the Absolute Truth.",
    "Our only business is to love God, not to ask God for our necessities.",
    "Serve God, and you will automatically serve humanity.",
    "Books are the basis; purity is the force; preaching is the essence; utility is the principle.",
    "Devotional service is the highest platform of happiness.",
    "Krishna consciousness is the matchless gift."
  ];

  const DailyQuotesForm = ({ onSubscribed }: { onSubscribed: () => void }) => {
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!phone && !email) {
        setError('Please provide either a WhatsApp number or an email.');
        return;
      }
      setError(null);
      setIsSubmitting(true);
      try {
        await addLead({
          Phone: phone,
          Email: email,
          Source: 'AI Bot',
        });
        onSubscribed();
      } catch (err) {
        setError('Failed to subscribe. Please try again later.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form className="mt-2 space-y-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="WhatsApp Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          disabled={isSubmitting}
        />
        <input
          type="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full p-2 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </form>
    );
  };

  // Define FeedbackFormComponent here, so it has access to AIPanel's scope (createBotResponse, setMessages)
  const FeedbackFormComponent = ({ onSubmit }: { onSubmit: () => void }) => {
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message) {
        setError('Please enter your feedback message.');
        return;
      }
      setError(null);
      setIsSubmitting(true);
      try {
        await addLead({
          Email: email,
          Source: 'AI Bot',
          Notes: `Rating: ${rating}/5\n\nFeedback: ${message}`,
        });
        onSubmit(); // Trigger the thank you message
      } catch (err) {
        setError('Failed to send feedback. Please try again later.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form className="mt-2 space-y-3" onSubmit={handleSubmit}>
        <StarRating rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} />
        <input
          type="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          rows={3}
          disabled={isSubmitting}
        ></textarea>
        <button
          type="submit"
          className="w-full p-2 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Feedback'}
        </button>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </form>
    );
  };

  const scrollRef = useAutoScroll<HTMLDivElement>(true, [messages, isLoading]);

  const handleGoBack = () => {
    setMessages([{ id: 1, sender: 'bot', content: initialGreeting }]);
  };

  const suggestedQuestions = [
    { id: 1, text: "Would you like to receive daily spiritual quotes from us?" },
    { id: 2, text: "Would you like to know more about ISKM?" },
    { id: 3, text: "How do you find our website and what do you expect from us?" },
  ];

  const quickActionButtons = [
      { id: 4, text: 'Timings', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Alarm%20Clock.png" alt="Alarm Clock" width="40" height="40" />, color: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 border-blue-500/70 text-blue-700 dark:text-blue-300" },
      { id: 5, text: 'Donate', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" width="40" height="40" />, color: "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 border-yellow-500/70 text-yellow-700 dark:text-yellow-300" },
      { id: 7, text: 'Calendar', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Spiral%20Calendar.png" alt="Spiral Calendar" width="40" height="40" />, color: "bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 border-purple-500/70 text-purple-700 dark:text-purple-300" },
      { id: 6, text: 'Contact', icon: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Telephone%20Receiver.png" alt="Telephone Receiver" width="40" height="40" />, color: "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 border-green-500/70 text-green-700 dark:text-green-300" },
  ];

  const createBotResponse = React.useCallback((responseContent: React.ReactNode) => (
    <div className="space-y-2">
      {responseContent}
      <p className="text-xs text-center pt-2 border-t border-border/50 mt-2">
        🌹 All Glories 🌟 to Śrīla Prabhupāda! 🙏
      </p>
    </div>
  ), []);

  const handleQuestionClick = React.useCallback((question: { id: number; text: string }) => {
    const userMessageId = nextMessageId.current++;
    setMessages(prev => [...prev, { id: userMessageId, sender: 'user', content: <p>{question.text}</p> }]);
    setIsLoading(true);

    setTimeout(() => {
      try {
        let botResponseContent: React.ReactNode;
        switch (question.id) {
          case 1:
            const handleSubscribed = () => {
              const thankYouMessage = createBotResponse(
                <p>Thank you for subscribing! You'll receive daily spiritual quotes from us soon. Hare Kṛṣṇa!</p>
              );
              const thankYouMessageId = nextMessageId.current++;
              setMessages(prev => [...prev, { id: thankYouMessageId, sender: 'bot', content: thankYouMessage }]);
            };

            botResponseContent = (
              <div>
                <p>That's wonderful! To subscribe for daily quotes, please provide your details below.</p>
                <DailyQuotesForm onSubscribed={handleSubscribed} />
              </div>
            );
            break;
          case 2:
            botResponseContent = (
              <div className="space-y-2">
                  <p>The International Society for Krishna Consciousness (ISKCON), as founded by A.C. Bhaktivedanta Swami Prabhupada, is a Gaudiya Vaishnava religious organization.</p>
                  <p>Our information is based on Retrieval-Augmented Generation (RAG) from official documents like IA77, ensuring adherence to the ritvik system of initiation established by Srila Prabhupada.</p>
                  <p>For more on this topic, you can watch this video: <a href="#" onClick={(e) => e.preventDefault()} className="text-primary underline">ISKCON vs ISKM (video)</a>.</p>
                  <p className="text-xs italic">Please note: This AI is trained to be strict on this topic and will not deviate from official sources.</p>
              </div>
            );
            break;
          case 3:
            botResponseContent = (
              <div>
                  <p>We'd love to hear your feedback on our website!</p>
                  <FeedbackFormComponent onSubmit={() => {
                      const thankYouMessage = createBotResponse(
                          <div>
                              <p>Thank you for your feedback! We appreciate you taking the time.</p>
                              <p className="mt-2">We hope you'll visit us soon! Our temple is located at ISKCON, Hare Krishna Land, Sri Sri Radha Madhava Cultural and Educational Complex, ECR, Sri-Sailam, Puducherry, 605008.</p>
                              <p>Darshan is open daily from 5:00 AM to 8:45 PM.</p>
                              <p>For more info, see our <Link to="/about" className="text-primary underline">About Page</Link>.</p>
                          </div>
                      );
                      const thankYouMessageId = nextMessageId.current++;
                      setMessages(prev => [...prev, { id: thankYouMessageId, sender: 'bot', content: thankYouMessage }]);
                  }} />
              </div>
            );
            break;
          case 4: // Timings
            botResponseContent = (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-[#0a84ff]">Temple Timings</h4>
                  <CopyButton size="sm" variant="ghost" content={formatTimingsForCopy()} className="text-[#0a84ff]" />
                </div>
                <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  {templeTimingsData.map((timing, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="mr-4">{timing.event}</span>
                      <span className="font-medium text-[#e94a9c]">{timing.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
            break;
          case 5: // Donate
            botResponseContent = (
              <div className="space-y-4">
                <div className="pt-0">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-[#ffc547]">Bank Transfer Details</h4>
                      <CopyButton size="sm" variant="ghost" content={formatBankDetailsForCopy()} className="text-[#ffc547]" />
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                    <p><strong>Account Name:</strong> {bankDetailsData.accountName}</p>
                    <p><strong>Account Type:</strong> {bankDetailsData.accountType}</p>
                    <p><strong>Account No:</strong> {bankDetailsData.accountNo}</p>
                    <p><strong>IFSC Code:</strong> {bankDetailsData.ifscCode}</p>
                    <p><strong>Bank:</strong> {bankDetailsData.bankName}</p>
                  </div>
                </div>
                {/* UPI QR Code Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Scan to Pay with UPI</h4>
                  <div className="flex justify-center items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <img
                      src="/assets/extra/miniqr.png"
                      alt="UPI QR Code"
                      className="w-28 h-auto object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-600 mb-1">Or use UPI ID:</p>
                    <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-md max-w-xs mx-auto">
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400">ISKM.04@idfcbank</span>
                      <CopyButton size="sm" variant="ghost" content="ISKM.04@idfcbank" className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                   <p className="text-xs text-gray-500 dark:text-gray-600 mt-3">
                      Your contribution supports our mission.
                  </p>
                </div>
              </div>
            );
            break;
          case 6: // Contact
            botResponseContent = (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">Contact Us</h4>
                    <CopyButton size="sm" variant="ghost" content="+91 80565 13859\niskm.pondicherry@gmail.com" className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <a href="tel:+919042642103" className="text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors">+91 80565 13859</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-envelope text-green-600 dark:text-green-400" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                      </svg>
                      <a href="mailto:iskm.pondicherry@gmail.com" className="text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors">iskm.pondicherry@gmail.com</a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-300">Pudhuvai Vrindavanam (Hare Krishna Temple), RS No-54/3, Koodappakkam Main Rd, near Pogo Land, Pathukannu, Puducherry 605502</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                    <a href="https://facebook.com/iskm.pondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <IconBrandFacebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs">Facebook</span>
                    </a>
                    <a href="https://t.me/ISKMVaishnavasanga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                      <IconBrandTelegram className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                      <span className="text-xs">Telegram</span>
                    </a>
                    <a href="https://instagram.com/iskm_pondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                      <IconBrandInstagram className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-xs">Instagram</span>
                    </a>
                    <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <IconBrandYoutube className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-xs">YouTube</span>
                    </a>
                    <a href="https://wa.me/918056626108" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <IconBrandWhatsapp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs">WhatsApp</span>
                    </a>
                    <a href="https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs">Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            );
            break;
          case 7: // Calendar
              botResponseContent = (
                <div className="space-y-2">
                  <p>You can view all our events on the main calendar page.</p>
                  <Link to="/calender" className="block">
                    <button className="w-full p-2 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-out active:scale-95 transform-gpu">
                      Go to Calendar
                    </button>
                  </Link>
                </div>
              );
              break;
          default:
            botResponseContent = <p>Sorry, I don't have an answer for that.</p>;
        }
        const fullResponse = createBotResponse(botResponseContent);
        const botMessageId = nextMessageId.current++;
        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', content: fullResponse }]);
        } catch (error) {
          console.error("Error handling question click:", error);
          const errorResponse = createBotResponse(<p>Sorry, an error occurred while processing your request.</p>);
          const errorBotMessageId = nextMessageId.current++;
          setMessages(prev => [...prev, { id: errorBotMessageId, sender: 'bot', content: errorResponse }]);
        } finally {
          setIsLoading(false);
        }
    }, 1500);
  }, [createBotResponse]);

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessageId = nextMessageId.current++;
    const userMessage = {
        id: userMessageId,
        sender: 'user' as const,
        content: <p>{message}</p>,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * prabhupadaTeachings.length);
        const randomTeaching = prabhupadaTeachings[randomIndex];

        const botResponse = createBotResponse(
          <>
            <p>{randomTeaching}</p>
            <p className="mt-2 text-xs italic">Our AI is blossoming with the teachings of Śrīla Prabhupāda. Full conversational abilities are coming soon. Hare Kṛṣṇa!</p>
          </>
        );
        const botMessageId = nextMessageId.current++;
        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', content: botResponse }]);
        setIsLoading(false);
    }, 1500);
  };

  React.useEffect(() => {
    if (messageSent) {
      const timer = setTimeout(() => {
        setMessageSent(false);
      }, 1000); // Duration of the glow
      return () => clearTimeout(timer);
    }
  }, [messageSent]);

  return (
    <div className='flex flex-col p-2 min-h-[420px] max-h-[calc(100vh-180px)] bg-gray-50 dark:bg-black'>
        <AnimatePresence>
            {messages.length > 1 && (
            <motion.div
                className="flex-shrink-0 pb-2 px-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <button
                onClick={handleGoBack}
                className="flex items-center justify-center gap-2 w-full p-2 rounded-xl text-sm font-medium bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all active:scale-95 transform-gpu"
                >
                <ArrowLeft className="size-4" />
                <span>Start New Chat</span>
                </button>
            </motion.div>
            )}
        </AnimatePresence>
      <div ref={scrollRef} className="flex-grow space-y-4 p-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.sender === 'bot' && (
              <motion.div
                className="relative size-8 flex-shrink-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: index === 0 ? 0.5 : 0 }}
              >
                <div className="absolute -inset-1 bg-pink-500/50 rounded-full blur-lg animate-pulse-glow" />
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="Robot" width="25" height="25" className="relative bg-background rounded-full p-0.5" />
              </motion.div>
            )}
            <motion.div
              className={cn(
                "max-w-xs md:max-w-md rounded-2xl p-3 text-sm",
                msg.sender === 'user'
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-bl-lg"
              )}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index === 0 ? 0.8 : 0.1 }}
            >
              {msg.content}
            </motion.div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <IconRobo className="size-8 mb-1 text-primary flex-shrink-0 bg-background rounded-full p-1" />
            <div className="bg-gray-200 dark:bg-gray-600 rounded-2xl rounded-bl-lg p-3">
              <ThreeDotSimpleLoader />
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-2">
        {messages.length <= 1 && (
            <div className="p-2 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                    {quickActionButtons.map(q => (
                        <button key={q.id} onClick={() => handleQuestionClick(q)} className={cn("flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl shadow-lg transition-colors aspect-square", q.color)}>
                            {q.icon}
                            <span className="text-xs text-center">{q.text}</span>
                        </button>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {suggestedQuestions.map(q => (
                    <button key={q.id} onClick={() => handleQuestionClick(q)} className="text-left text-sm p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors w-full">
                        {q.text}
                    </button>
                    ))}
                </div>
            </div>
        )}
        <motion.div
          className="pt-2 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
        >
          <AppleChatInput onSendMessage={handleSendMessage} />
        </motion.div>
      </div>
    </div>
  );
});

// Removed the old ShortsPanel component

function NavbarContent() {
  // --- State ---
  // const [open, setOpen] = React.useState(false); // Command Dialog state - REMOVED
  const [eventsOpen, setEventsOpen] = React.useState(false); // Events Dialog state
  const [deitiesOpen, setDeitiesOpen] = React.useState(false); // Deities Dialog state
  const [isEventBannerOpen, setIsEventBannerOpen] = React.useState(true); // Changed: Banner is open by default

  // --- Hooks ---
  const { isSoundEnabled, toggleSound } = useSoundSettings();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const templeStatus = useTempleStatus(); // Added
  const router = useRouterState({ select: (s) => s.location });
  const isInvitePage = router.pathname === '/fests/invite';

  // State for the new expandable dock (from snippet)
  const [activeDockItem, setActiveDockItem] = React.useState<number | null>(null); // For the main Menu's content panel
  const [activeLabelItemId, setActiveLabelItemId] = React.useState<number | null>(null); // For click-to-expand labels
  const [hoveredLabelItemId, setHoveredLabelItemId] = React.useState<number | null>(null); // For hover-to-expand labels
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const dockWrapperRef = React.useRef<HTMLDivElement>(null);
  const [isDockOpen, setIsDockOpen] = React.useState(false);
  const [maxDockWidth, setMaxDockWidth] = React.useState(0);

  // State for dock visibility on scroll
  const [isDockVisible, setIsDockVisible] = React.useState(true);
  const lastScrollYRef = React.useRef(0);
  const [isFooterVisible, setIsFooterVisible] = React.useState(false);
  const [clipsPanelCurrentIndex, setClipsPanelCurrentIndex] = React.useState(0); // Added state for clips panel
  const [isBannerVisibleOnScroll, setIsBannerVisibleOnScroll] = React.useState(true);

  const aiPanelContent = React.useMemo(() => <AIPanel />, []);
  const clipsPanelContent = React.useMemo(() => <ClipsPanel currentIndex={clipsPanelCurrentIndex} setCurrentIndex={setClipsPanelCurrentIndex} />, [clipsPanelCurrentIndex, setClipsPanelCurrentIndex]); // Changed to use ClipsPanel
  const eventsPanelContent = React.useMemo(() => <TempleEventsPanel />, []);

  // useClickOutside hook (from snippet, adapted path)
  useClickOutside(dockWrapperRef, () => {
    if (isDockOpen) { 
      setIsDockOpen(false);
      setActiveDockItem(null);
    }
    setHoveredLabelItemId(null); 
  });

  // useEffect for maxWidth (from snippet)
  React.useEffect(() => {
    if (widthContainer) {
      setMaxDockWidth(widthContainer);
    }
  }, [widthContainer]);

  // useEffect for dock and banner visibility on scroll and footer intersection
  React.useEffect(() => {
    const controlVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // Dock visibility logic
      if (isDockOpen) {
        setIsDockVisible(true);
      } else {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
          setIsDockVisible(false);
        } else {
          setIsDockVisible(true);
        }
      }

      // Banner visibility logic (hide on down, show on up)
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
          setIsBannerVisibleOnScroll(false);
      } else {
          setIsBannerVisibleOnScroll(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const footerElement = document.querySelector('footer');
    let observer: IntersectionObserver;

    if (footerElement) {
      observer = new IntersectionObserver(
        ([entry]) => {
          // Set isFooterVisible to true if footer is intersecting, false otherwise
          setIsFooterVisible(entry.isIntersecting);
          // Hide dock when footer is visible, regardless of scroll direction
          if (entry.isIntersecting && !isDockOpen) {
            setIsDockVisible(false);
          }
        },
        { threshold: 0.2 } // Adjusted threshold for smoother detection
      );
      observer.observe(footerElement);
    }

    window.addEventListener('scroll', controlVisibility);

    return () => {
      window.removeEventListener('scroll', controlVisibility);
      if (footerElement && observer) {
        observer.unobserve(footerElement);
      }
    };
  }, [isDockOpen, setIsDockVisible, setIsFooterVisible]);


  // Use React Query for sound loading state (existing)
  const { data: soundsLoaded = false } = useQuery({
    queryKey: ['soundsLoaded'],
    queryFn: async () => {
      const sounds = [
        '/sounds/switch-on.mp3',
        '/sounds/click.wav',
        '/sounds/enable-sound.mp3',
        '/sounds/disable-sound.mp3',
        '/sounds/templebell.mp3'
      ];
      await Promise.all(
        sounds.map(sound => 
          new Promise((resolve) => {
            const audio = new Audio(sound);
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.load();
          })
        )
      );
      return true;
    },
    staleTime: Infinity,
  });

  const [playHover] = useSound('/sounds/switch-on.mp3', { volume: 0.5, soundEnabled: isSoundEnabled });
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
  const [playEnableSound] = useSound('/sounds/enable-sound.mp3', { volume: 0.5, soundEnabled: true });
  const [playDisableSound] = useSound('/sounds/disable-sound.mp3', { volume: 0.5, soundEnabled: true });
  const [playTempleBell] = useSound('/sounds/templebell.mp3', { volume: 0.5, soundEnabled: isSoundEnabled });

  const safePlayHover = React.useCallback(() => {
    if (soundsLoaded && isSoundEnabled) playHover();
  }, [soundsLoaded, isSoundEnabled, playHover]);

  const safePlayClick = React.useCallback(() => {
    if (soundsLoaded && isSoundEnabled) playClick();
  }, [soundsLoaded, isSoundEnabled, playClick]);
  
  const handleSoundToggle = React.useCallback(() => {
    if (!isSoundEnabled) playEnableSound(); else playDisableSound();
    toggleSound();
    queryClient.invalidateQueries({ queryKey: ['soundState'] });
  }, [isSoundEnabled, playEnableSound, playDisableSound, toggleSound, queryClient]);

  const handleNavClick = React.useCallback((to: string) => {
    if (to === '/deities' && isSoundEnabled) playTempleBell(); else safePlayClick();
  }, [isSoundEnabled, playTempleBell, safePlayClick]);

  // useEffect for Cmd+K/Ctrl+K to open CommandDialog - REMOVED

  const dockSpringTransition: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  const mainDockAppearanceTransition: Transition = {
    type: "spring",
    stiffness: 250,
    damping: 30,
    delay: 0.2,
  };

  const DOCK_ITEMS: DockItemData[] = React.useMemo(() => [
    {
      id: 1,
      label: 'Home',
      title: <IconHome className='size-5' />,
      subtitle: 'Home',
      action: () => handleNavClick('/'),
      isLink: true,
      to: '/',
    },
    {
      id: 2,
      label: 'Deities',
      title: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Hindu%20Temple.png" alt="Hindu Temple" width="25" height="25" />,
      subtitle: 'Darshan',
      action: () => { setDeitiesOpen(true); playTempleBell(); },
    },
    {
      id: 9, // New ID for Donate
      label: 'Donate',
      title: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" width="25" height="25" />,
      subtitle: 'Donate',
      action: () => handleNavClick('/donate'),
      isLink: true,
      to: '/donate',
    },
    {
      id: 3,
      label: 'Events',
      title: <IconCalendar className='size-5' />,
      subtitle: 'Calendar',
      isExpandable: true,
      content: eventsPanelContent,
    },
    {
      id: 6, // New ID for Shop (already present)
      label: 'Shop',
      title: <ShoppingBagIcon className='size-5' />,
      subtitle: 'Store',
      action: () => handleNavClick('/shop'),
      isLink: true,
      to: '/shop',
    },
    // Search item (id: 4) is removed from here
    {
      id: 5, // Menu item
      label: 'Menu',
      title: <Menu className='size-5' />,
      subtitle: 'More',
      isExpandable: true,
      content: (
        <div className='flex flex-col gap-2 p-2 max-h-[calc(100vh-200px)] overflow-y-auto'> {/* Reduced p-3 to p-2, gap-3 to gap-2 */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 place-items-center w-full'> {/* Reduced gap-3 to gap-2 */}
            {/* Sound Toggle Button - Styled as a square item */}
            <button
              onClick={() => { handleSoundToggle(); safePlayClick(); }}
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-indigo-700/50 hover:text-primary text-foreground/80 transition-colors"
              aria-label={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
            >
              {isSoundEnabled ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />}
            </button>

            {/* Navigation Items - Styled as square items */}
            {navItems.filter(item => ['/centers', '/about', '/shop'].includes(item.to)).map(navItem => (
              <Link
                key={`dock-menu-${navItem.to}`}
                to={navItem.to}
                onClick={() => { handleNavClick(navItem.to); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                aria-label={navItem.label}
              >
                <navItem.icon className={cn("size-6 mb-1", navItem.iconClassName)} />
                <span className="text-[0.7rem] sm:text-[0.75rem] text-center">{navItem.label}</span>
              </Link>
            ))}

            {isMobile && (() => {
              const calendarNavItem = navItems.find(item => item.to === '/calender');
              if (!calendarNavItem) return null;

              // Create a static object for the click handler to avoid circular dependency.
              // It only needs the properties used by handleDockItemClick for this action.
              const mockEventsItem: DockItemData = {
                id: 3,
                label: 'Events',
                isExpandable: true,
                title: <></>, // Dummy data to satisfy type
                subtitle: '', // Dummy data to satisfy type
              };

              return (
                <button
                  key="dock-menu-calendar"
                  type="button"
                  onClick={() => handleDockItemClick(mockEventsItem)}
                  onMouseEnter={safePlayHover}
                  className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                  aria-label={calendarNavItem.label}
                >
                  <calendarNavItem.icon className={cn("size-6 mb-1", calendarNavItem.iconClassName)} />
                  <span className="text-[0.7rem] sm:text-[0.75rem] text-center">{calendarNavItem.label}</span>
                </button>
              );
            })()}

          {/* SignedIn Items - Styled as square items */}
          <SignedIn>
            <Link
              to="/dashboard"
              onClick={() => { handleNavClick("/dashboard"); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
              aria-label="Dashboard"
            >
              <LayoutDashboard className="size-6 mb-1 text-primary/80" />
              <span className="text-[0.7rem] sm:text-[0.75rem] text-center">Dashboard</span>
            </Link>
            
            {/* UserButton - Attempt to style its container or provide a styled trigger if possible */}
            <div 
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 text-foreground/80 transition-colors cursor-pointer"
              onClick={safePlayClick} // Play click sound, Clerk handles modal
            >
              <UserButton afterSignOutUrl="/">
                {/* Clerk UserButton usually provides its own UI, this structure is for consistent hover/click sounds & basic box */}
                {/* If UserButton could take a child for custom rendering, that would be ideal here */}
              </UserButton>
               {/* <span className="text-xs mt-1 text-center">Profile</span>  UserButton usually has its own trigger text/icon */}
            </div>

            <SignOutButton>
              <button
                onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="size-6 mb-1 text-primary/80" />
                <span className="text-[0.7rem] sm:text-[0.75rem] text-center">Sign Out</span>
              </button>
            </SignOutButton>
          </SignedIn>

          {/* SignedOut Item - Styled as a square item */}
          <SignedOut>
            <SignInButton mode="modal">
              <button
                onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                aria-label="Sign In"
              >
                <LogIn className="size-6 mb-1 text-primary/80" />
                <span className="text-[0.7rem] sm:text-[0.75rem] text-center">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
          {/* Separators are removed as grid layout handles spacing */}
          </div>
          {/* Mini Buttons for Terms, Privacy, Returns */}
          <div className="col-span-2 sm:col-span-3 mt-2 pt-2 border-t border-border/50 flex justify-between items-center px-4 sm:px-6">
            <div className="flex items-center space-x-3">
              <Link 
                to="/terms-and-conditions" 
                onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="text-xs text-muted-foreground hover:text-primary dark:text-white transition-colors"
              >
                Terms
              </Link>
              <span className="text-xs text-muted-foreground dark:text-white">|</span>
              <Link 
                to="/privacy-policy" 
                onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="text-xs text-muted-foreground hover:text-primary dark:text-white transition-colors"
              >
                Privacy
              </Link>
            </div>
            <Link 
              to="/refund-and-cancellation-policy" 
              onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="text-xs text-muted-foreground hover:text-primary dark:text-white transition-colors"
            >
              Returns
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      label: 'AI Bot',
      title: <IconRobo className='size-5' />,
      subtitle: 'Ask',
      isExpandable: true,
      content: aiPanelContent,
    },
    {
      id: 8, // ID for Clips (formerly Shorts)
      label: 'Clips', // Renamed from Shorts
      title: <Youtube className='size-5' />,
      subtitle: 'Watch', // Updated subtitle
      isExpandable: true,
      content: clipsPanelContent, // Use the new ClipsPanel
    },
    {
      id: 10, // New ID for the event banner toggle
      label: isEventBannerOpen ? 'Close' : 'Events',
      title: <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" alt="Party Popper" width="25" height="25" />,
      subtitle: 'Festival',
      action: () => setIsEventBannerOpen(prev => !prev),
    }
  ], [isMobile, isSoundEnabled, handleNavClick, handleSoundToggle, playTempleBell, safePlayClick, safePlayHover, setDeitiesOpen, navItems, templeStatus, setActiveDockItem, setIsDockOpen, aiPanelContent, clipsPanelContent, clipsPanelCurrentIndex, setClipsPanelCurrentIndex, eventsPanelContent, isEventBannerOpen, setIsEventBannerOpen]); // Updated to clipsPanelContent


  const handleDockItemClick = React.useCallback((item: DockItemData) => {
    if (item.label === 'Deities' && !item.isExpandable) playTempleBell(); else safePlayClick();

    if (item.isExpandable) {
      setActiveLabelItemId(null);
      setHoveredLabelItemId(null);
      
      const isClickedItemActive = activeDockItem === item.id;

      if (isDockOpen && isClickedItemActive) {
        setIsDockOpen(false);
        setActiveDockItem(null);
      } else {
        setIsDockOpen(true);
        setActiveDockItem(item.id);
      }
    } else {
      if (!isMobile) {
        setActiveLabelItemId(prevId => (prevId === item.id ? null : item.id));
      }
      setHoveredLabelItemId(null);
      setIsDockOpen(false);
      setActiveDockItem(null);
      if (item.action && typeof item.action === 'function') {
        item.action();
      }
    }
  }, [isMobile, isDockOpen, activeDockItem, playTempleBell, safePlayClick, setActiveDockItem, setActiveLabelItemId, setHoveredLabelItemId, setIsDockOpen]);

  const handleDockItemMouseEnter = React.useCallback((item: DockItemData) => {
    if (!isMobile && !item.isExpandable && item.label !== 'Donate') {
      setHoveredLabelItemId(item.id);
      safePlayHover();
    }
  }, [isMobile, safePlayHover, setHoveredLabelItemId]);


  const activeItem = DOCK_ITEMS.find(item => item.id === activeDockItem);
  const isClipsPanelActive = isDockOpen && activeItem?.label === 'Clips';
  const isEventsPanelActive = isDockOpen && activeItem?.label === 'Events';

  const SplitButton = () => {
    const darshanItem = DOCK_ITEMS.find(item => item.id === 2);
    const eventsItem = DOCK_ITEMS.find(item => item.id === 3);

    if (!darshanItem || !eventsItem) return null;

    const statusColorClass = templeStatus.colorClass;
    let darshanBg = "bg-gray-200/80 dark:bg-gray-700/80";
    let darshanText = "text-gray-800 dark:text-gray-200";
    let darshanHoverBg = "hover:bg-gray-300/80 dark:hover:bg-gray-600/80";

    if (statusColorClass.includes('green')) {
        darshanBg = "bg-green-400/20 dark:bg-green-500/20";
        darshanText = "text-green-700 dark:text-green-300";
        darshanHoverBg = "hover:bg-green-400/30 dark:hover:bg-green-500/30";
    } else if (statusColorClass.includes('pink')) {
        darshanBg = "bg-pink-400/20 dark:bg-pink-500/20";
        darshanText = "text-pink-700 dark:text-pink-300";
        darshanHoverBg = "hover:bg-pink-400/30 dark:hover:bg-pink-500/30";
    } else if (statusColorClass.includes('red')) {
        darshanBg = "bg-red-400/20 dark:bg-red-500/20";
        darshanText = "text-red-700 dark:text-red-300";
        darshanHoverBg = "hover:bg-red-400/30 dark:hover:bg-red-500/30";
    } else if (statusColorClass.includes('gray')) {
        darshanBg = "bg-gray-400/20 dark:bg-gray-600/20";
        darshanText = "text-gray-700 dark:text-gray-400";
        darshanHoverBg = "hover:bg-gray-400/30 dark:hover:bg-gray-600/30";
    } else if (statusColorClass.includes('yellow')) {
        darshanBg = "bg-yellow-400/20 dark:bg-yellow-500/20";
        darshanText = "text-yellow-700 dark:text-yellow-300";
        darshanHoverBg = "hover:bg-yellow-400/30 dark:hover:bg-yellow-500/30";
    } else if (statusColorClass.includes('orange')) {
        darshanBg = "bg-orange-400/20 dark:bg-orange-500/20";
        darshanText = "text-orange-700 dark:text-orange-300";
        darshanHoverBg = "hover:bg-orange-400/30 dark:hover:bg-orange-500/30";
    }

    const handleDarshanClick = () => {
      if (darshanItem.action) {
        darshanItem.action();
      }
    };

    const handleEventsClick = () => {
      handleDockItemClick(eventsItem);
    };

    return (
      <div className="flex flex-col items-center justify-center gap-1.5 h-14 sm:h-16 w-14 sm:w-16">
        <motion.button
          onClick={handleEventsClick}
          onMouseEnter={safePlayHover}
          className="h-6 px-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-white text-xs font-semibold whitespace-nowrap transition-all hover:from-blue-500 hover:to-cyan-600 active:scale-95 shadow-md hover:shadow-lg"
          whileTap={{ scale: 0.95 }}
          aria-label="Open Calendar"
        >
          Calendar
        </motion.button>
        <motion.button
          onClick={handleDarshanClick}
          onMouseEnter={safePlayHover}
          className={cn(
            "h-6 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-colors active:scale-95",
            darshanBg,
            darshanText,
            darshanHoverBg
          )}
          whileTap={{ scale: 0.95 }}
        >
          Darshan
        </motion.button>
      </div>
    );
  };

  return (
    <MotionConfig transition={{ layout: { duration: 0.35, type: 'spring', bounce: 0.1 } }}>
      <motion.nav 
        className="fixed bottom-0 left-0 w-full pb-safe pointer-events-none transform-gpu"
        initial={{ y: 0 }}
        // Adjust z-index based on visibility to ensure it's below footer when hidden
        animate={{
          y: (isClipsPanelActive || isEventsPanelActive) ? 0 : (isDockVisible && !isFooterVisible ? 0 : 160),
          zIndex: (isClipsPanelActive || isEventsPanelActive) ? 50 : (isDockVisible && !isFooterVisible ? 40 : 10)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={cn(
            "relative mx-auto flex justify-center",
            isClipsPanelActive ? "w-full h-full p-0" : "container px-2 pb-2 sm:px-4"
          )}>
          <FestivalToggleButton
            isEventBannerOpen={isEventBannerOpen}
            setIsEventBannerOpen={setIsEventBannerOpen}
            mainDockAppearanceTransition={mainDockAppearanceTransition}
            isMobile={isMobile}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={mainDockAppearanceTransition}
            className={cn(
              "relative pointer-events-auto mb-2",
              isClipsPanelActive
                ? "w-full h-full max-w-full rounded-none border-none bg-black shadow-none" // Ensure full width and height
                : "w-full sm:max-w-fit max-w-md rounded-3xl bg-pink-50/60 backdrop-blur-sm dark:bg-pink-900/50 border border-pink-200/30 dark:border-pink-700/30 shadow-[0_0_10px_rgba(255,182,193,0.3)] dark:shadow-[0_0_10px_rgba(255,105,180,0.3)] transform-gpu",
              isClipsPanelActive ? '' : (isMobile ? 'overflow-visible' : 'overflow-hidden')
            )}
            ref={dockWrapperRef}
            onMouseLeave={() => setHoveredLabelItemId(null)} >
            <MotionConfig transition={dockSpringTransition}>
              <div className={cn('h-full w-full', isClipsPanelActive ? 'p-0' : 'p-2')}>
                <div className={cn(isClipsPanelActive ? 'rounded-none h-full w-full' : 'overflow-hidden rounded-t-2xl')}> {/* Ensure full height/width for clips panel content area */}
                  <AnimatePresence initial={false} mode='sync'>
                    {isDockOpen && activeItem?.isExpandable && (
                      <motion.div
                        key={activeItem.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: isClipsPanelActive
                            ? (isMobile ? 'calc(100vh - 56px - env(safe-area-inset-bottom))' : 'calc(100vh - 64px - env(safe-area-inset-bottom))') // Adjusted height calculation
                            : heightContent || 'auto',
                          opacity: 1
                        }}
                        exit={{ y: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                        style={{
                          width: isClipsPanelActive
                            ? '100vw' // Panel content itself can be 100vw
                            : (maxDockWidth > 0 ? maxDockWidth : 'auto'),
                          maxWidth: '100vw' // Ensure it doesn't exceed viewport
                        }}
                      >
                        <div
                          ref={contentRef}
                          className={cn(
                            isClipsPanelActive ? 'h-full w-full p-0' : 'p-0' // Ensure full height/width for clips panel content
                          )}
                        >
                          {activeItem.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className={cn(
                    'flex items-end', // Use items-end to align with the bottom, allowing the center button to pop up
                    isClipsPanelActive
                      ? 'p-0 py-1 fixed bottom-[env(safe-area-inset-bottom)] left-0 right-0 bg-black/80 backdrop-blur-sm h-[56px] sm:h-[64px] justify-center space-x-2 sm:space-x-3'
                      : 'p-1.5 sm:p-2.5',
                    isMobile ? 'relative' : 'justify-center space-x-2 sm:space-x-3'
                  )} ref={menuRef}>
                  {isMobile ? (
                    <>
                      {/* Bottom row of 4 icons */}
                      <div className="flex w-full justify-between items-end">
                        {/* Left 2 items */}
                        <div className="flex justify-evenly w-[calc(50%-36px)]">
                          {DOCK_ITEMS.filter(item => item.id === 1).map(item => item && (
                            <DockItemComponent
                              key={item.id}
                              item={item}
                              isMobile={isMobile}
                              templeStatus={templeStatus}
                              activeLabelItemId={activeLabelItemId}
                              hoveredLabelItemId={hoveredLabelItemId}
                              isDockOpen={isDockOpen}
                              activeDockItem={activeDockItem}
                              dockSpringTransition={dockSpringTransition}
                              onItemClick={handleDockItemClick}
                              onItemMouseEnter={handleDockItemMouseEnter}
                            />
                          ))}
                          <SplitButton />
                        </div>
                        {/* Right 2 items */}
                        <div className="flex justify-evenly w-[calc(50%-36px)]">
                          {[9, 5].map(id => DOCK_ITEMS.find(item => item.id === id)).map(item => item && (
                            <DockItemComponent
                              key={item.id}
                              item={item}
                              isMobile={isMobile}
                              templeStatus={templeStatus}
                              activeLabelItemId={activeLabelItemId}
                              hoveredLabelItemId={hoveredLabelItemId}
                              isDockOpen={isDockOpen}
                              activeDockItem={activeDockItem}
                              dockSpringTransition={dockSpringTransition}
                              onItemClick={handleDockItemClick}
                              onItemMouseEnter={handleDockItemMouseEnter}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Center "Clips" Button and AI Pill - absolutely positioned */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-7 flex flex-col items-center gap-2">
                        {/* Clips Button */}
                        {DOCK_ITEMS.filter(item => item.id === 8).map(item => (
                          <DockItemComponent
                            key={item.id}
                            item={item}
                            isMobile={isMobile}
                            templeStatus={templeStatus}
                            activeLabelItemId={activeLabelItemId}
                            hoveredLabelItemId={hoveredLabelItemId}
                            isDockOpen={isDockOpen}
                            activeDockItem={activeDockItem}
                            dockSpringTransition={dockSpringTransition}
                            onItemClick={handleDockItemClick}
                            onItemMouseEnter={handleDockItemMouseEnter}
                          />
                        ))}
                        {/* AI Pill Button */}
                        {DOCK_ITEMS.filter(item => item.id === 7).map(item => {
                            const isMainMenuPanelActive = activeDockItem === item.id && isDockOpen;
                            const aiPillStyling = isMainMenuPanelActive
                                ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white dark:from-amber-500 dark:via-yellow-600 dark:to-orange-600 dark:text-amber-50 shadow-lg ring-2 ring-white/30 dark:ring-amber-400/40 scale-105"
                                : "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 text-yellow-900 dark:text-amber-200 dark:from-amber-600/80 dark:via-yellow-700/80 dark:to-orange-700/80 hover:from-yellow-400 hover:to-orange-500 dark:hover:from-amber-500 dark:hover:to-orange-600 shadow-md hover:shadow-lg ring-1 ring-amber-500/30 dark:ring-amber-700/50 hover:ring-amber-500/50 dark:hover:ring-amber-500/70 transform hover:scale-105";

                            return (
                                <motion.button
                                    key={item.id}
                                    type="button"
                                    aria-label={item.label}
                                    layout
                                    className={cn(
                                        "relative flex items-center justify-center rounded-full cursor-pointer h-7 px-3 text-foreground/80 transition-all duration-200 active:scale-[0.98]",
                                        aiPillStyling
                                    )}
                                    onClick={() => handleDockItemClick(item)}
                                    onMouseEnter={() => handleDockItemMouseEnter(item)}
                                >
                                    <div className="flex items-center gap-1">
                                        {item.title}
                                        <span className="text-xs font-medium hidden sm:inline">{item.label}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Desktop Layout */}
                      <div className={cn('flex space-x-2 sm:space-x-3', isClipsPanelActive ? 'text-white' : '')}>
                        {DOCK_ITEMS.filter(item => {
                          // Desktop: show all except AI Bot (7), Clips (8), and the new Events (10) in the main group
                          if (!isMobile) {
                            return ![7, 8, 10].includes(item.id)
                          }
                          return false; // Should not be reached
                        }).map((item) => (
                          <DockItemComponent
                            key={item.id}
                            item={item}
                            isMobile={isMobile}
                            templeStatus={templeStatus}
                            activeLabelItemId={activeLabelItemId}
                            hoveredLabelItemId={hoveredLabelItemId}
                            isDockOpen={isDockOpen}
                            activeDockItem={activeDockItem}
                            dockSpringTransition={dockSpringTransition}
                            onItemClick={handleDockItemClick}
                            onItemMouseEnter={handleDockItemMouseEnter}
                          />
                        ))}
                      </div>
                      {!isMobile && (
                        <>
                          <div className="h-8 w-px bg-border self-center" />
                          {[10, 8, 7].map(id => DOCK_ITEMS.find(item => item.id === id)).map(item => item && (
                            <DockItemComponent
                              key={item.id}
                              item={item}
                              isMobile={isMobile}
                              templeStatus={templeStatus}
                              activeLabelItemId={activeLabelItemId}
                              hoveredLabelItemId={hoveredLabelItemId}
                              isDockOpen={isDockOpen}
                              activeDockItem={activeDockItem}
                              dockSpringTransition={dockSpringTransition}
                              onItemClick={handleDockItemClick}
                              onItemMouseEnter={handleDockItemMouseEnter}
                            />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </MotionConfig>
          </motion.div>
        </div>

        {/* CommandDialog and related components are REMOVED */}

        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.nav>

      <TempleEvents 
        open={eventsOpen} 
        onOpenChange={setEventsOpen}
        _onSoundPlay={safePlayClick}
      />
      
      <DeityDarshan
        open={deitiesOpen}
        onOpenChange={setDeitiesOpen}
      />
      <UpcomingEventBanner isOpen={isEventBannerOpen && !isInvitePage && isBannerVisibleOnScroll} onClose={() => setIsEventBannerOpen(false)} />
    </MotionConfig>
  )
}

export default function Navbar() {
  const loadingFallback = (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[100]">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo192.webp" alt="Loading" className="size-16 animate-pulse-slow" />
        <ShimmerText text='"Chant Hare Krishna and your life will be sublime."' />
        <p className="text-sm text-muted-foreground">- Śrīla Prabhupāda</p>
      </div>
    </div>
  );

  return (
    <SoundProvider>
      <Suspense fallback={loadingFallback}>
        <NavbarContent />
      </Suspense>
    </SoundProvider>
  )
}
