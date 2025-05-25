import { Link } from '@tanstack/react-router';
import { motion, MotionConfig, AnimatePresence } from 'motion/react'; // Added AnimatePresence
import * as React from 'react';
import { cn } from '@/lib/utils';
import useMeasure from 'react-use-measure'; // Added useMeasure
import useClickOutside from '@/components/motion-primitives/useClickOutside'; // Added useClickOutside
import IconHome from 'virtual:icons/line-md/home-md-alt-twotone'
import IconTemple from 'virtual:icons/fluent-emoji-flat/hindu-temple'
import IconCalendar from 'virtual:icons/uim/calender'
import IconInfo from 'virtual:icons/line-md/alert-circle-twotone-loop';
import { ModeToggle } from '@/components/mode-toggle'; // Assuming path
import { Separator } from "@/components/ui/separator"; // Assuming path
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Assuming path
import { Menu, Search, Volume2, VolumeX, Globe as GlobeIcon } from "lucide-react";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { SoundProvider } from '@/components/context/sound-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTempleStatus } from '@/hooks/useTempleStatus'; // Added
import { TempleEvents } from '@/components/temple-events';
import { DeityDarshan } from '@/components/deity-darshan';
import { useIsMobile } from "@/hooks/use-mobile";
import { RainbowGlow } from "@/components/ui/rainbow-glow"; // Added RainbowGlow import
import { Suspense } from 'react'; // Added Suspense import
const LazyUpcomingEventBanner = React.lazy(() => // Added import for the banner
  import('@/components/upcoming-event-banner').then(module => ({ default: module.UpcomingEventBanner }))
);

const navItems = [
  { 
    icon: IconHome, 
    label: 'Home', 
    to: '/',
    iconClassName: "text-primary/80" 
  },
  { icon: IconTemple, label: 'Deities', to: '/deities', iconClassName: "text-primary/80" },
  { icon: IconCalendar, label: 'Events', to: '/events', iconClassName: "text-primary/80" },
  { icon: GlobeIcon, label: 'Centers', to: '/centers', iconClassName: "text-primary/80" },
  { icon: IconInfo, label: 'About', to: '/about', iconClassName: "text-primary/80" },
];

function NavbarContent() {
  // --- State ---
  const [open, setOpen] = React.useState(false); // Command Dialog state
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
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // useClickOutside hook (from snippet, adapted path)
  useClickOutside(dockWrapperRef, () => {
    if (isDockOpen) { 
      setIsDockOpen(false);
      setActiveDockItem(null);
    }
    // setActiveLabelItemId(null); // Optionally clear clicked active label on click outside
    setHoveredLabelItemId(null); // Always clear hover state on click outside
  });

  // useEffect for maxWidth (from snippet)
  React.useEffect(() => {
    if (!widthContainer || maxDockWidth > 0) return;
    setMaxDockWidth(widthContainer);
  }, [widthContainer, maxDockWidth]);

  // useEffect for dock visibility on scroll
  React.useEffect(() => {
    const controlDockVisibility = () => {
      const currentScrollY = window.scrollY;
      // If dock content is open, keep it visible
      if (isDockOpen) {
        setIsDockVisible(true);
        setLastScrollY(currentScrollY); // Update lastScrollY to prevent immediate hide on content close
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 80) { // Scrolling down
        setIsDockVisible(false);
      } else { // Scrolling up or at the top
        setIsDockVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlDockVisibility);
    return () => {
      window.removeEventListener('scroll', controlDockVisibility);
    };
  }, [lastScrollY, isDockOpen]);


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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((currentOpen) => !currentOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Refined spring transition for the dock and its expandable content
  const dockSpringTransition = {
    type: "spring",
    stiffness: 400, // Increased stiffness for a slightly quicker response
    damping: 30,    // Adjusted damping for a smooth but not overly bouncy feel
    mass: 0.8,      // Adjusted mass
  };

  // Specific spring for the main dock's appearance (slide up)
  const mainDockAppearanceTransition = {
    type: "spring",
    stiffness: 250,
    damping: 30,
    delay: 0.2, // Optional delay for appearance
  };

  const DOCK_ITEMS = React.useMemo(() => [
    {
      id: 1,
      label: 'Home',
      title: <IconHome className='size-5' />,
      action: () => handleNavClick('/'), // Direct action
      isLink: true,
      to: '/',
    },
    {
      id: 2,
      label: 'Deities',
      title: <IconTemple className='size-5' />,
      action: () => { setDeitiesOpen(true); playTempleBell(); }, // Direct action
      // We will handle dynamic styling for this item in the rendering logic below
    },
    {
      id: 3,
      label: 'Events',
      title: <IconCalendar className='size-5' />,
      action: () => { setEventsOpen(true); safePlayClick(); }, // Direct action
    },
    {
      id: 4,
      label: 'Search',
      title: <Search className='size-5' />,
      action: () => { setOpen(true); safePlayClick(); }, // Direct action
    },
    {
      id: 5,
      label: 'Menu', // This one will be expandable
      title: <Menu className='size-5' />,
      isExpandable: true,
      content: ( // Content for the "Menu" item
        <div className='flex flex-col space-y-2 p-2 max-h-[calc(100vh-200px)] overflow-y-auto'>
          <button
            onClick={() => { handleSoundToggle(); safePlayClick(); /* setIsDockOpen(false); setActiveDockItem(null); */ }} // Keep dock open for menu actions
            onMouseEnter={safePlayHover}
            className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent text-left"
          >
            {isSoundEnabled ? (
              <><Volume2 className="size-5" /><span>Disable Sound</span></>
            ) : (
              <><VolumeX className="size-5" /><span>Enable Sound</span></>
            )}
          </button>
          <div className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent">
            <ModeToggle />
          </div>
          <Separator />
          {isMobile && (
            <>
              <Separator />
            </>
          )}
          {navItems.filter(item => ['/centers', '/about'].includes(item.to) && !(isMobile && item.to === '/donate')).map(navItem => (
            <Link
              key={`dock-menu-${navItem.to}`}
              to={navItem.to}
              onClick={() => { handleNavClick(navItem.to); setIsDockOpen(false); setActiveDockItem(null); }}
              onMouseEnter={safePlayHover}
              className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent"
            >
              <navItem.icon className={cn("size-5", navItem.iconClassName)} />
              <span>{navItem.label}</span>
            </Link>
          ))}
        </div>
      ),
    },
  ], [isMobile, isSoundEnabled, handleNavClick, handleSoundToggle, playTempleBell, safePlayClick, safePlayHover, setDeitiesOpen, setEventsOpen, setOpen, toggleSound, navItems, templeStatus]); // Added templeStatus to dependencies


  return (
    <MotionConfig transition={{ layout: { duration: 0.35, type: 'spring', bounce: 0.1 } }}>
      {/* Main Dock Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 z-40 w-full pb-safe mb-6 pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: isDockVisible ? 0 : 100 }} // 100 is an example, adjust if dock height is different
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container relative mx-auto flex justify-center px-2 pb-2 sm:px-4">
          <motion.div
            // Removed initial and animate for y here, handled by parent motion.nav
            // Kept opacity animation for initial load if desired, or can be removed if parent handles all appearance
            initial={{ opacity: 0 }} // Only initial opacity if mainDockAppearanceTransition handles y
            animate={{ opacity: 1 }}
            transition={mainDockAppearanceTransition} // This transition might primarily be for opacity now
            className="relative w-full max-w-md rounded-3xl bg-pink-50/60 shadow-lg shadow-black/5 ring-1 ring-pink-100/60 backdrop-blur-md dark:bg-pink-900/40 dark:shadow-black/10 dark:ring-pink-900/40 sm:max-w-fit pointer-events-auto overflow-hidden"
            ref={dockWrapperRef}
            onMouseLeave={() => setHoveredLabelItemId(null)} // Clear hover when mouse leaves the entire dock
          >
            <RainbowGlow 
              position="top" 
              className="opacity-50"
              containerClassName="h-16" // Adjusted container height for the glow
              glowHeight="h-10"      // Use new props
              glowOpacity={0.3}
              blurAmount="blur-xl"
            />
            {/* New Expandable Dock Implementation */}
            <MotionConfig transition={dockSpringTransition}>
              <div className='h-full w-full p-1.5'>
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
                <div className='flex space-x-1 sm:space-x-2 p-1 sm:p-2 justify-center' ref={menuRef}>
                  {DOCK_ITEMS.map((item) => {
                    const isLabelClickedActive = activeLabelItemId === item.id && !item.isExpandable;
                    const isLabelHoveredActive = hoveredLabelItemId === item.id && !item.isExpandable;
                    const isLabelVisible = isLabelClickedActive || isLabelHoveredActive;
                    
                    const isMainMenuPanelActive = item.isExpandable && activeDockItem === item.id && isDockOpen;

                    // Determine dynamic classes for the Deities button
                    const isDeityButton = item.label === 'Deities';
                    let deityButtonSpecificStyles = "";
                    if (isDeityButton) {
                        const statusColorClass = templeStatus.colorClass; // e.g., "bg-green-500"
                        
                        let subtleBg = "bg-gray-400/20 dark:bg-gray-600/20"; // Default for loading/unknown
                        let subtleText = "text-gray-700 dark:text-gray-300";
                        let subtleHoverBg = "hover:bg-gray-400/30 dark:hover:bg-gray-600/30";

                        if (statusColorClass.includes('green')) { // Darshan Open
                            subtleBg = "bg-green-400/20 dark:bg-green-500/20";
                            subtleText = "text-green-700 dark:text-green-300";
                            subtleHoverBg = "hover:bg-green-400/30 dark:hover:bg-green-500/30";
                        } else if (statusColorClass.includes('pink')) { // Aarati
                            subtleBg = "bg-pink-400/20 dark:bg-pink-500/20";
                            subtleText = "text-pink-700 dark:text-pink-300";
                            subtleHoverBg = "hover:bg-pink-400/30 dark:hover:bg-pink-500/30";
                        } else if (statusColorClass.includes('red')) { // Darshan Closed (evening/afternoon)
                            subtleBg = "bg-red-400/20 dark:bg-red-500/20";
                            subtleText = "text-red-700 dark:text-red-300";
                            subtleHoverBg = "hover:bg-red-400/30 dark:hover:bg-red-500/30";
                        } else if (statusColorClass.includes('gray')) { // Temple Closed (e.g., night) or Loading
                            subtleBg = "bg-gray-400/20 dark:bg-gray-600/20"; // Adjusted for better dark mode visibility
                            subtleText = "text-gray-700 dark:text-gray-400"; // Darker gray text for light, lighter for dark
                            subtleHoverBg = "hover:bg-gray-400/30 dark:hover:bg-gray-600/30";
                        } else if (statusColorClass.includes('yellow')) { // N/A
                            subtleBg = "bg-yellow-400/20 dark:bg-yellow-500/20";
                            subtleText = "text-yellow-700 dark:text-yellow-300";
                            subtleHoverBg = "hover:bg-yellow-400/30 dark:hover:bg-yellow-500/30";
                        } else if (statusColorClass.includes('orange')) { // Error
                            subtleBg = "bg-orange-400/20 dark:bg-orange-500/20";
                            subtleText = "text-orange-700 dark:text-orange-300";
                            subtleHoverBg = "hover:bg-orange-400/30 dark:hover:bg-orange-500/30";
                        }
                        deityButtonSpecificStyles = cn(subtleBg, subtleText, subtleHoverBg);
                    }


                    const handleItemClick = () => {
                      if (item.label === 'Deities' && !item.isExpandable) playTempleBell(); else safePlayClick();

                      if (item.isExpandable) { // Main Menu item
                        setActiveLabelItemId(null); // Clear any clicked label
                        setHoveredLabelItemId(null); // Clear hover state
                        setIsDockOpen(prev => !prev);
                        setActiveDockItem(isDockOpen && activeDockItem === item.id ? null : item.id);
                      } else { // Regular items (Home, Deities, Events, Search)
                        // Toggle activeLabelItemId on click
                        setActiveLabelItemId(prevId => (prevId === item.id ? null : item.id));
                        setHoveredLabelItemId(null); // Click takes precedence over hover
                        setIsDockOpen(false); // Close main menu panel if open
                        setActiveDockItem(null);
                        if (item.action && typeof item.action === 'function') {
                          item.action();
                        }
                      }
                    };
                    
                    const handleItemMouseEnter = () => {
                      if (!item.isExpandable) {
                        setHoveredLabelItemId(item.id);
                        safePlayHover();
                      }
                    };

                    // onMouseLeave for individual items is handled by the parent dockWrapperRef's onMouseLeave

                    const itemContent = (
                      <div className={cn(
                        "flex items-center h-full w-full transition-all duration-200 ease-out",
                        isLabelVisible ? "justify-start pl-2 pr-1 sm:pl-3 sm:pr-2" : "justify-center"
                      )}>
                        <div>{item.title}</div> {/* Icon wrapped in a div */}
                        <AnimatePresence>
                          {isLabelVisible && (
                            <motion.span
                              className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap"
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
                    
                    const baseItemClasses = "relative flex items-center rounded-xl cursor-pointer overflow-hidden h-10 sm:h-12 text-foreground/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]";
                    
                    const itemWidth = item.isExpandable 
                                      ? (isMobile ? 40 : 48) 
                                      : (isLabelVisible ? (isMobile ? 100 : 120) : (isMobile ? 40 : 48));

                    // Apply dynamic styling
                    const combinedItemClasses = cn(
                        baseItemClasses,
                        isDeityButton
                            ? deityButtonSpecificStyles // Deity button gets its status color
                            : (isMainMenuPanelActive || isLabelVisible) // Other buttons get pink highlight if active (label expanded or menu open)
                                ? "bg-pink-100/70 dark:bg-pink-700/70 text-primary" 
                                : "hover:bg-pink-100/50 dark:hover:bg-pink-700/50 hover:text-primary" // Default hover for others
                    );

                    if (item.isLink && item.to) { // Home item
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          className={combinedItemClasses}
                          animate={{ width: itemWidth }}
                          transition={dockSpringTransition}
                          onMouseEnter={handleItemMouseEnter}
                        >
                          <Link
                            to={item.to}
                            aria-label={item.label}
                            className="w-full h-full flex"
                            onClick={handleItemClick}
                          >
                            {itemContent}
                          </Link>
                        </motion.div>
                      );
                    } else { // Button items (Deities, Events, Search, Menu)
                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          aria-label={item.label}
                          layout
                          className={combinedItemClasses}
                          animate={{ width: itemWidth }}
                          transition={dockSpringTransition}
                          onClick={handleItemClick}
                          onMouseEnter={handleItemMouseEnter}
                        >
                          {itemContent}
                        </motion.button>
                      );
                    }
                  })}
                </div>
              </div>
            </MotionConfig>
          </motion.div>
        </div>

        {/* Command Dialog - Unchanged */}
        <CommandDialog open={open} onOpenChange={(currentOpenState) => {
          setOpen(currentOpenState);
          if (!currentOpenState) { /* Assuming handleNavClick('/') was for resetting state or sound */ }
        }}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navItems.map((item) => ( // navItems still used for CommandDialog
                <CommandItem
                  key={`cmd-${item.to}`}
                  onSelect={() => {
                    setOpen(false);
                    if (item.to === '/events') {
                      setEventsOpen(true); safePlayClick();
                    } else if (item.to === '/deities') {
                      setDeitiesOpen(true); playTempleBell();
                    } else {
                      // For direct links, navigate using Link's behavior or router.navigate()
                      // This onSelect might trigger navigation if Link component isn't used here.
                      // For now, assuming direct window.location.href for simplicity if not handled by router.
                      // Ideally, use router.navigate({ to: item.to }) if router is in scope.
                      handleNavClick(item.to); // Play sound
                       if (typeof window !== 'undefined' && !['/events', '/deities'].includes(item.to)) {
                         // This is a hacky way to navigate. Prefer <Link> or router.navigate()
                         // For items that are pure links, the CommandItem should probably wrap a Link
                         // or use router.navigate()
                         window.location.assign(item.to);
                       }
                    }
                  }}
                  onMouseEnter={safePlayHover}
                >
                  <item.icon className="mr-2 size-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Add Events Dialog - Unchanged */}
        <TempleEvents 
          open={eventsOpen} 
          onOpenChange={setEventsOpen}
          _onSoundPlay={safePlayClick}
        />
        
        {/* Add Deity Darshan Dialog - Unchanged */}
        <DeityDarshan
          open={deitiesOpen}
          onOpenChange={setDeitiesOpen}
        />

        {/* Safe area spacing - Unchanged */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.nav> {/* Corrected: Added closing tag for motion.nav */}

      {/* Upcoming Event Banner - Placed here to be part of the fixed layout, but styled to be above the dock */}
      <Suspense fallback={null}>
        <LazyUpcomingEventBanner />
      </Suspense>
    </MotionConfig>
  )
}

export default function Navbar() {
  return (
    <SoundProvider>
      <NavbarContent />
    </SoundProvider>
  )
}
