import * as React from "react";
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useSound } from 'use-sound';
import { useSoundSettings, SoundProvider } from "@/components/context/sound-context";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
// Switch, Label, and weather-specific icons (CloudIcon, SunIcon etc.) and related Lucide icons (ClockIcon, BellIcon etc.) are removed as they are now in TempleWeatherPopover
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";
import { User, Menu, X, ChevronDown, Home, Handshake, PenSquare, ShoppingCart, Info, Globe } from 'lucide-react';
import { motion, AnimatePresence, type Transition } from "motion/react";
import useMeasure from 'react-use-measure';
import useClickOutside from '@/hooks/useClickOutside';
import { RainbowButton } from "./ui/rainbow-button";
import { useTempleStatus } from "@/hooks/useTempleStatus"; // Added
import { useIsMobile } from "@/hooks/use-mobile";
import { TempleWeatherPopover } from "./homepage/status"; // Import the new component
import { LanguageSwitcher } from "./language-switcher";
import { useNavbarVisibility } from "@/hooks/use-navbar-visibility";

interface NavItemType {
  icon: React.ReactNode;
  title: string;
  to?: string;
  subItems?: { title: string; to: string; }[];
}

interface IconWithFallbackProps {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  fallback: React.ReactNode;
}

const IconWithFallback: React.FC<IconWithFallbackProps> = ({ src, alt, width, height, fallback }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return <>{fallback}</>;
  }

  return <img src={src} alt={alt} width={width} height={height} onError={handleError} />;
};

interface NavBarProps {
  className?: string;
}

function NavBarComponent({ className }: NavBarProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [openMobileSubMenu, setOpenMobileSubMenu] = React.useState<string | null>(null);
    const [mobileMenuContentRef, { height: mobileMenuHeight }] = useMeasure();
    const mobileMenuWrapperRef = React.useRef<HTMLDivElement>(null);

    // isFahrenheit and is24HourFormat states moved to TempleWeatherPopover
    const isVisible = useNavbarVisibility(isMobileMenuOpen);

    const templeStatus = useTempleStatus(); // Temple status
    const weather = useWeather(); // Weather information
    const { isSoundEnabled } = useSoundSettings();
    const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });
    const [playClick] = useSound('/sounds/click.wav', { volume: 0.25, soundEnabled: isSoundEnabled });
    const [playMenuOpen] = useSound('/sounds/menu-open.mp3', { volume: 0.4, soundEnabled: isSoundEnabled });
    const [playMenuClose] = useSound('/sounds/pop-off.mp3', { volume: 0.3, soundEnabled: isSoundEnabled });

    const safePlayHover = React.useCallback(() => {
      if (isSoundEnabled) playHover();
    }, [isSoundEnabled, playHover]);

    const safePlayClick = React.useCallback(() => {
      if (isSoundEnabled) playClick();
    }, [isSoundEnabled, playClick]);

    const safePlayMenuOpen = React.useCallback(() => {
      if (isSoundEnabled) playMenuOpen();
    }, [isSoundEnabled, playMenuOpen]);

    const safePlayMenuClose = React.useCallback(() => {
      if (isSoundEnabled) playMenuClose();
    }, [isSoundEnabled, playMenuClose]);
    
    

    // const handleDrawerOpenChange = React.useCallback((openState: boolean) => { // Old Drawer handler
    //   setIsOpen(openState);
    //   if (openState) {
    //     safePlayMenuOpen();
    //   } else {
    //     safePlayMenuClose();
    //   }
    // }, [safePlayMenuOpen, safePlayMenuClose]);

    useClickOutside(mobileMenuWrapperRef, () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
            safePlayMenuClose();
        }
    });

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => {
            if (!prev) safePlayMenuOpen(); else safePlayMenuClose();
            return !prev;
        });
    };
    
    const springTransition: Transition = { type: "spring", stiffness: 400, damping: 35, mass: 0.8 };
    const mobileMenuSpringTransition: Transition = { type: "spring", stiffness: 300, damping: 30, bounce: 0.1 };

    // Helper functions (formatTemperature, formatTime) and related display variables (nextEventTimeDisplay, nextEventLabelDisplay) moved to TempleWeatherPopover

    return (
    <>
        <motion.nav 
            ref={mobileMenuWrapperRef} // Ref for click outside
            className={cn(
                "fixed w-full z-30 bg-background/80 dark:bg-background/60 backdrop-blur-lg transition-transform duration-300 select-none", // Increased z-index and added select-none
                className
            )}
            initial={{ translateY: 0 }}
            animate={{
                translateY: isVisible ? 0 : '-100%'
            }}
            transition={springTransition} // Use spring transition here
        >
            <div className="w-full px-2 sm:px-4">
                <div className="flex justify-between items-center h-16"> {/* Reverted h-14 to h-16 */}
                    {/* Left side with ModeToggle and Temple Name */}
                    {/* Left side with ModeToggle and Temple Name */}
                    <div className="relative flex items-center space-x-2 sm:space-x-3">
                        <ModeToggle className="pt-10" /> {/* Corrected pt-10 to pt-1 */}
                        {/* Temple Name Link - Popover and dot removed from here */}
                        <Link 
                            to="/" 
                            className="flex flex-col hover:opacity-80 transition-opacity min-w-0 flex-grow flex-shrink ml-1 sm:ml-0"
                            onClick={safePlayClick}
                            onMouseEnter={safePlayHover}
                        >
                            <h1 className="text-sm md:text-base font-semibold text-foreground flex flex-col sm:block">
                                <span>{t('navbar.templeName1')}</span>
                                <span className="sm:ml-1">{t('navbar.templeName2')}</span>
                            </h1>
                            <p className="text-xs text-muted-foreground hidden sm:block truncate">
                                {t('navbar.templeSubtitle')}
                            </p>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Simplified */}
                    <div className="hidden xl:flex items-center space-x-0.5">
                        {Object.entries(navItems).map(([key, item]) => (
                            item.title !== 'Donate' && (
                                item.subItems ? (
                                    <div 
                                        key={key} 
                                        className="relative"
                                        onMouseEnter={() => setActiveMenu(item.title)}
                                        onMouseLeave={() => setActiveMenu(null)}
                                    >
                                        <button
                                            className="inline-flex items-center justify-center text-sm font-medium h-8 py-1 px-2
                                                        text-muted-foreground hover:text-primary
                                                        hover:bg-primary/10
                                                        rounded-full transition-all duration-200"
                                        >
                                            {item.icon}
                                            <span className="ml-1.5">{t(item.title)}</span>
                                        </button>
                                        <AnimatePresence>
                                            {activeMenu === item.title && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 origin-top rounded-md bg-background p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
                                                >
                                                    <div className="py-1">
                                                        {item.subItems.map((subItem) => (
                                                            <Link
                                                                key={subItem.title}
                                                                to={subItem.to!}
                                                                onClick={safePlayClick}
                                                                onMouseEnter={safePlayHover}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-foreground hover:bg-accent rounded-md"
                                                            >
                                                                {t(subItem.title)}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.title}
                                        to={item.to!}
                                        onClick={safePlayClick}
                                        onMouseEnter={safePlayHover}
                                        className="inline-flex items-center justify-center text-sm font-medium h-8 py-1 px-2
                                            text-muted-foreground hover:text-primary
                                            hover:bg-primary/10
                                            rounded-full transition-all duration-200"
                                    >
                                        {item.icon}
                                        <span className="ml-1.5">{t(item.title)}</span>
                                    </Link>
                                )
                            )
                        ))}
                        <Link to="/donate" onClick={safePlayClick} onMouseEnter={safePlayHover}>
                            <RainbowButton className="flex items-center gap-2 ml-2">
                                <img 
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" 
                                    alt="Beating Heart" width="20" height="20" 
                                />
                                <span>{t('navbar.donate')}</span>
                            </RainbowButton>
                        </Link>
                    </div>

                    {/* Right side items (Mobile Menu Trigger, Mobile Donate, Temple Status Bell, Sign In) */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Temple Status Indicator removed, functionality merged into Notification Bell */}

                        <Link to="/donate" className="sm:hidden" onClick={safePlayClick} onMouseEnter={safePlayHover}>
                            <Button
                                variant="default"
                                className="bg-white text-[#b5387d] rounded-full hover:bg-white/90 w-9 h-9 p-0 flex items-center justify-center" // Adjusted padding and flex for image
                            >
                                <img
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png"
                                    alt="Beating Heart"
                                    width="20"
                                    height="20"
                                />
                            </Button>
                        </Link>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-9 h-9 xl:hidden text-foreground"
                            onClick={toggleMobileMenu}
                            onMouseEnter={safePlayHover}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        {/* Use the new TempleWeatherPopover component */}
                        <TempleWeatherPopover
                            weather={weather}
                            templeStatus={templeStatus}
                            isMobile={isMobile}
                            safePlayClick={safePlayClick}
                            safePlayHover={safePlayHover}
                        />
                        <LanguageSwitcher />
                        <a href="/sign-in" className="hidden sm:inline-block" onClick={safePlayClick} onMouseEnter={safePlayHover}>
                            <Button size="icon" variant="outline" className="rounded-full w-9 h-9 text-foreground">
                                <User className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Expandable Mobile Menu Panel */}
            <AnimatePresence initial={false}>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: mobileMenuHeight || 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={mobileMenuSpringTransition}
                        className="overflow-hidden xl:hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0 }} // Removed zIndex: -1
                    >
                        <div ref={mobileMenuContentRef} className="p-4 space-y-2">
                            {Object.entries(navItems).map(([key, item]) => (
                                item.subItems ? (
                                    <div key={`mobile-${key}`}>
                                        <button
                                            onClick={() => {
                                                setOpenMobileSubMenu(openMobileSubMenu === item.title ? null : item.title);
                                                safePlayClick();
                                            }}
                                            className="w-full p-3 flex items-center justify-between gap-3 text-foreground hover:bg-accent rounded-md transition-colors text-base"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-primary">{item.icon}</div>
                                                <span className="font-medium">{t(item.title)}</span>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 transition-transform ${openMobileSubMenu === item.title ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openMobileSubMenu === item.title && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden pl-8"
                                                >
                                                    <div className="pt-2 space-y-1">
                                                        {item.subItems.map(subItem => (
                                                            <Link
                                                                key={`mobile-sub-${subItem.title}`}
                                                                to={subItem.to!}
                                                                onClick={() => {
                                                                    setIsMobileMenuOpen(false);
                                                                    safePlayClick();
                                                                    safePlayMenuClose();
                                                                }}
                                                                className="w-full p-2 flex items-center gap-3 text-muted-foreground hover:text-foreground rounded-md transition-colors text-base"
                                                            >
                                                                {t(subItem.title)}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={`mobile-${item.title}`}
                                        to={item.to!}
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          safePlayClick();
                                          safePlayMenuClose();
                                        }}
                                        onMouseEnter={safePlayHover}
                                        className="w-full p-3 flex items-center gap-3 text-foreground hover:bg-accent rounded-md transition-colors text-base"
                                    >
                                        <div className="text-primary">{item.icon}</div>
                                        <span className="font-medium">{t(item.title)}</span>
                                    </Link>
                                )
                            ))}
                            <a href="/sign-in" className="sm:hidden w-full p-3 flex items-center gap-3 text-foreground hover:bg-accent rounded-md transition-colors text-base" onClick={() => { setIsMobileMenuOpen(false); safePlayClick(); safePlayMenuClose(); }} onMouseEnter={safePlayHover}>
                                <User className="text-primary w-5 h-5" />
                                <span className="font-medium">{t('navbar.signIn')}</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    </>
    );
}

export function NavBar({ className }: NavBarProps) {
  return (
    <SoundProvider>
      <NavBarComponent className={className} />
    </SoundProvider>
  );
}

// Simplified navigation items - all as direct links
const navItems: Record<string, NavItemType> = {
  home: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Love%20Hotel.png" alt="Home" width="22" height="22" fallback={<Home className="w-4 h-4" />} />,
    title: "navbar.home",
    to: "/"
  },
  services: {
    icon: <Menu className="w-4 h-4" />,
    title: "navbar.services",
    subItems: [
      { title: 'navbar.annadanam', to: '/coming-soon' },
      { title: 'navbar.goshala', to: '/coming-soon' },
      { title: 'navbar.youth', to: '/coming-soon' },
      { title: 'navbar.construction', to: '/coming-soon' },
    ]
  },
  contribute: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png" alt="Contribute" width="22" height="22" fallback={<Handshake className="w-4 h-4" />} />,
    title: "navbar.contribute",
    to: "/contribute"
  },
  blog: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Writing%20Hand.png" alt="Blog" width="22" height="22" fallback={<PenSquare className="w-4 h-4" />} />,
    title: "navbar.blog",
    to: "/coming-soon"
  },
  shop: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png" alt="Shop" width="22" height="22" fallback={<ShoppingCart className="w-4 h-4" />} />,
    title: "navbar.shop",
    to: "/shop"
  },
  about: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20with%20Meridians.png" alt="About" width="22" height="22" fallback={<Info className="w-4 h-4" />} />,
    title: "navbar.about",
    to: "/about"
  },
  centers: {
    icon: <IconWithFallback src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/World%20Map.png" alt="Centers" width="22" height="22" fallback={<Globe className="w-4 h-4" />} />,
    title: "navbar.centers",
    to: "/centers"
  },
};
