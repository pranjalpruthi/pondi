import { Link } from '@tanstack/react-router';
import { motion, MotionConfig, AnimatePresence } from 'motion/react'; // Added AnimatePresence
import * as React from 'react';
import { cn } from '@/lib/utils';
import useMeasure from 'react-use-measure'; // Added useMeasure
import useClickOutside from '@/hooks/useClickOutside'; // Added useClickOutside
import IconHome from 'virtual:icons/line-md/home-md-alt-twotone'
import IconTemple from 'virtual:icons/fluent-emoji-flat/hindu-temple'
import IconCalendar from 'virtual:icons/uim/calender'
import IconInfo from 'virtual:icons/line-md/alert-circle-twotone-loop';
import { Menu, Search, Volume2, VolumeX, Globe as GlobeIcon, ShoppingBag as ShoppingBagIcon } from "lucide-react"; // Added ShoppingBagIcon
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { SoundProvider } from '@/components/context/sound-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTempleStatus } from '@/hooks/useTempleStatus'; // Added
import { TempleEvents } from '@/components/temple-events';
import { DeityDarshan } from '@/components/deity-darshan';
import { SignedIn, SignedOut, UserButton, SignInButton, SignOutButton } from '@clerk/tanstack-react-start';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { RainbowGlow } from "@/components/ui/rainbow-glow"; // Added RainbowGlow import
import { Suspense } from 'react'; // Added Suspense import

const LazyUpcomingEventBanner = React.lazy(() => // Added import for the banner
  import('@/components/upcoming-event-banner').then(module => ({ default: module.UpcomingEventBanner }))
);

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
        {item.subtitle && (
          <span className={cn(
            "text-[0.65rem] sm:text-[0.7rem] mt-1 font-medium",
            isLabelVisible ? "hidden" : "block",
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
        {isLabelVisible && (
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
  
  const baseItemClasses = "relative flex items-center rounded-xl cursor-pointer overflow-hidden h-12 sm:h-14 text-foreground/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]";
  
  const itemWidth = item.isExpandable 
                    ? (isMobile ? 48 : 56)
                    : (isLabelVisible ? (isMobile ? 100 : 120) : (isMobile ? 48 : 56));

  const combinedItemClasses = cn(
      baseItemClasses,
      isDeityButton
          ? deityButtonSpecificStyles
          : (isMainMenuPanelActive || isLabelVisible)
              ? "bg-pink-100/70 dark:bg-pink-700/70 text-primary" 
              : "hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary"
  );

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


interface NavbarContentProps {
  isDashboardPage?: boolean; // Prop to indicate if it's a dashboard page
}

const navItems = [
  { 
    icon: IconHome, 
    label: 'Home', 
    to: '/',
    iconClassName: "text-primary/80" 
  },
  { icon: IconTemple, label: 'Deities', to: '/deities', iconClassName: "text-primary/80" },
  { icon: IconCalendar, label: 'Events', to: '/events', iconClassName: "text-primary/80" },
  { icon: ShoppingBagIcon, label: 'Shop', to: '/shop', iconClassName: "text-primary/80" }, // Added Shop item
  { icon: GlobeIcon, label: 'Centers', to: '/centers', iconClassName: "text-primary/80" },
  { icon: IconInfo, label: 'About', to: '/about', iconClassName: "text-primary/80" },
];

function NavbarContent({ isDashboardPage }: NavbarContentProps) { // Accept isDashboardPage prop
  // --- State ---
  // const [open, setOpen] = React.useState(false); // Command Dialog state - REMOVED
  const [eventsOpen, setEventsOpen] = React.useState(false); // Events Dialog state
  const [deitiesOpen, setDeitiesOpen] = React.useState(false); // Deities Dialog state

  // --- Hooks ---
  const { isSoundEnabled, toggleSound } = useSoundSettings();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const templeStatus = useTempleStatus(); // Added

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

  // Placeholder texts for the new search bar
  const placeholderPhrases = React.useMemo(() => [
    "AI search coming soon...",
    "Ask me anything...",
    "Discover something new...",
    "What are you looking for?",
    "Temple wisdom at your fingertips...",
  ], []);
  const [currentPlaceholder, setCurrentPlaceholder] = React.useState(placeholderPhrases[0]);

  React.useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholderPhrases.length;
      setCurrentPlaceholder(placeholderPhrases[currentIndex]);
    }, 3000); // Change placeholder every 3 seconds
    return () => clearInterval(intervalId);
  }, [placeholderPhrases]);

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

  // useEffect for dock visibility on scroll and footer intersection
  React.useEffect(() => {
    const controlDockVisibility = () => {
      const currentScrollY = window.scrollY;
      if (isDockOpen) {
        setIsDockVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }
      // Hide dock if scrolling down or if past a certain scroll point
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
        setIsDockVisible(false);
      } else {
        setIsDockVisible(true);
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
        },
        { threshold: 0.1 } // Increased threshold to hide dock earlier
      );
      observer.observe(footerElement);
    }

    window.addEventListener('scroll', controlDockVisibility);

    return () => {
      window.removeEventListener('scroll', controlDockVisibility);
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

  const dockSpringTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  const mainDockAppearanceTransition = {
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
      title: <IconTemple className='size-5' />,
      subtitle: 'Darshan',
      action: () => { setDeitiesOpen(true); playTempleBell(); },
    },
    {
      id: 3,
      label: 'Events',
      title: <IconCalendar className='size-5' />,
      subtitle: 'Calendar',
      action: () => { setEventsOpen(true); safePlayClick(); },
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
          {/* AI Search Bar Placeholder */}
          <div className="relative w-full col-span-2 sm:col-span-3 mb-1"> {/* Reduced mb-2 to mb-1 */}
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={currentPlaceholder}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              readOnly // Make it read-only as it's a placeholder
              onFocus={(e) => e.target.blur()} // Prevent focus to reinforce it's non-interactive
            />
          </div>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 place-items-center w-full'> {/* Reduced gap-3 to gap-2 */}
            {/* Sound Toggle Button - Styled as a square item */}
            <button
              onClick={() => { handleSoundToggle(); safePlayClick(); }}
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
              aria-label={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
            >
              {isSoundEnabled ? <Volume2 className="size-6 mb-1" /> : <VolumeX className="size-6 mb-1" />}
              <span className="text-xs text-center">{isSoundEnabled ? "Sound Off" : "Sound On"}</span>
            </button>

            {/* Navigation Items - Styled as square items */}
            {navItems.filter(item => ['/centers', '/about', '/shop'].includes(item.to) && !(isMobile && item.to === '/donate')).map(navItem => (
            <Link
              key={`dock-menu-${navItem.to}`}
              to={navItem.to}
              onClick={() => { handleNavClick(navItem.to); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
              aria-label={navItem.label}
            >
              <navItem.icon className={cn("size-6 mb-1", navItem.iconClassName)} />
              <span className="text-xs text-center">{navItem.label}</span>
            </Link>
          ))}

          {/* SignedIn Items - Styled as square items */}
          <SignedIn>
            <Link
              to="/dashboard"
              onClick={() => { handleNavClick("/dashboard"); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
              aria-label="Dashboard"
            >
              <LayoutDashboard className="size-6 mb-1 text-primary/80" />
              <span className="text-xs text-center">Dashboard</span>
            </Link>
            
            {/* UserButton - Attempt to style its container or provide a styled trigger if possible */}
            <div 
              onMouseEnter={safePlayHover}
              className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 text-foreground/80 transition-colors cursor-pointer"
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
                className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="size-6 mb-1 text-primary/80" />
                <span className="text-xs text-center">Sign Out</span>
              </button>
            </SignOutButton>
          </SignedIn>

          {/* SignedOut Item - Styled as a square item */}
          <SignedOut>
            <SignInButton mode="modal">
              <button
                onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
                onMouseEnter={safePlayHover}
                className="flex flex-col items-center justify-center h-20 p-2 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary text-foreground/80 transition-colors"
                aria-label="Sign In"
              >
                <LogIn className="size-6 mb-1 text-primary/80" />
                <span className="text-xs text-center">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
          {/* Separators are removed as grid layout handles spacing */}
          </div>
          {/* Mini Buttons for Terms, Privacy, Returns */}
          <div className="col-span-2 sm:col-span-3 mt-2 pt-2 border-t border-border/50 flex justify-center items-center space-x-3"> {/* Reduced mt-3 to mt-2, pt-3 to pt-2, space-x-4 to space-x-3 */}
            <Link 
              to="/terms-and-conditions" 
              onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <span className="text-xs text-muted-foreground">|</span>
            <Link 
              to="/privacy-policy" 
              onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <span className="text-xs text-muted-foreground">|</span>
            <Link 
              to="/refund-and-cancellation-policy" 
              onClick={() => { safePlayClick(); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Returns
            </Link>
          </div>
        </div>
      ),
    },
  ], [isMobile, isSoundEnabled, handleNavClick, handleSoundToggle, playTempleBell, safePlayClick, safePlayHover, setDeitiesOpen, setEventsOpen, navItems, templeStatus, setActiveDockItem, setIsDockOpen, currentPlaceholder]); // setOpen removed from dependencies


  const handleDockItemClick = React.useCallback((item: DockItemData) => {
    if (item.label === 'Deities' && !item.isExpandable) playTempleBell(); else safePlayClick();

    if (item.isExpandable) {
      setActiveLabelItemId(null);
      setHoveredLabelItemId(null);
      setIsDockOpen(prev => !prev);
      setActiveDockItem(currentActiveDockItem => (isDockOpen && currentActiveDockItem === item.id ? null : item.id));
    } else {
      setActiveLabelItemId(prevId => (prevId === item.id ? null : item.id));
      setHoveredLabelItemId(null);
      setIsDockOpen(false);
      setActiveDockItem(null);
      if (item.action && typeof item.action === 'function') {
        item.action();
      }
    }
  }, [isDockOpen, playTempleBell, safePlayClick, setActiveDockItem, setActiveLabelItemId, setHoveredLabelItemId, setIsDockOpen]);

  const handleDockItemMouseEnter = React.useCallback((item: DockItemData) => {
    if (!item.isExpandable) {
      setHoveredLabelItemId(item.id);
      safePlayHover();
    }
  }, [safePlayHover, setHoveredLabelItemId]);


  return (
    <MotionConfig transition={{ layout: { duration: 0.35, type: 'spring', bounce: 0.1 } }}>
      <motion.nav 
        className="fixed bottom-[var(--banner-height,44px)] left-0 w-full pb-safe pointer-events-none transform-gpu"
        initial={{ y: 0 }}
        // Adjust z-index based on visibility to ensure it's below footer when hidden
        animate={{ 
          y: isDockVisible && !isFooterVisible ? 0 : 150, // Increased y to move further down
          zIndex: isDockVisible && !isFooterVisible ? 40 : 10 // Lower z-index when hidden
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container relative mx-auto flex justify-center px-2 pb-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={mainDockAppearanceTransition}
            className="relative w-full max-w-md rounded-3xl bg-pink-50/60 shadow-lg shadow-black/5 ring-1 ring-pink-100/60 backdrop-blur-md dark:bg-pink-900/40 dark:shadow-black/10 dark:ring-pink-900/40 sm:max-w-fit pointer-events-auto overflow-hidden mb-4 group glass transform-gpu"
            ref={dockWrapperRef}
            onMouseLeave={() => setHoveredLabelItemId(null)} >
            <RainbowGlow 
              position="top" 
              className="opacity-50"
              containerClassName="h-16"
              glowHeight="h-10"
              glowOpacity={0.3}
              blurAmount="blur-xl"
            />
            <MotionConfig transition={dockSpringTransition}>
              <div className='h-full w-full p-2'>
                <div className='overflow-hidden rounded-t-2xl'>
                  <AnimatePresence initial={false} mode='sync'>
                    {isDockOpen && activeDockItem === DOCK_ITEMS.find(i => i.isExpandable)?.id && (
                      <motion.div
                        key='content'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: heightContent || 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ width: maxDockWidth > 0 ? maxDockWidth : 'auto' }}
                      >
                        <div ref={contentRef} className='p-0'>
                          {DOCK_ITEMS.find(item => item.id === activeDockItem && item.isExpandable)?.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className='flex space-x-2 sm:space-x-3 p-1.5 sm:p-2.5 justify-center' ref={menuRef}>
                  {DOCK_ITEMS.map((item) => (
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
                  <div className="h-8 w-px bg-border mx-1" />
                </div>
              </div>
            </MotionConfig>
          </motion.div>
        </div>

        {/* CommandDialog and related components are REMOVED */}

        <TempleEvents 
          open={eventsOpen} 
          onOpenChange={setEventsOpen}
          _onSoundPlay={safePlayClick}
        />
        
        <DeityDarshan
          open={deitiesOpen}
          onOpenChange={setDeitiesOpen}
        />

        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.nav>

      {!isDashboardPage && (
        <Suspense fallback={null}>
          <LazyUpcomingEventBanner />
        </Suspense>
      )}
    </MotionConfig>
  )
}

export default function Navbar({ isDashboardPage }: NavbarContentProps) {
  return (
    <SoundProvider>
      <NavbarContent isDashboardPage={isDashboardPage} />
    </SoundProvider>
  )
}
