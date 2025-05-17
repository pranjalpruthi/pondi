import * as React from "react";
import { Link } from '@tanstack/react-router';
import { useSound } from 'use-sound';
import { useSoundSettings, SoundProvider } from "@/components/context/sound-context";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { HomeIcon, InfoIcon, NewspaperIcon, HeartHandshakeIcon, ShoppingBagIcon, GiftIcon, User, Menu, Globe as GlobeIcon, X } from 'lucide-react'; // Added X
import { motion, AnimatePresence } from "motion/react";
import useMeasure from 'react-use-measure';
import useClickOutside from '@/components/motion-primitives/useClickOutside';
import { RainbowButton } from "./ui/rainbow-button";
// Drawer imports will be removed if not used elsewhere, or conditionally kept.
// For now, assuming the mobile menu is the only user of Drawer here.
// import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface NavItemType {
  icon: React.ReactNode;
  title: string;
  to: string;
}

interface NavBarProps {
  className?: string;
}

function NavBarComponent({ className }: NavBarProps) {
    // const [isOpen, setIsOpen] = React.useState(false); // Old Drawer state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [mobileMenuContentRef, { height: mobileMenuHeight }] = useMeasure();
    const mobileMenuWrapperRef = React.useRef<HTMLDivElement>(null);

    const [lastScrollY, setLastScrollY] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(true);

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
    
    
    // Handle scroll behavior
    React.useEffect(() => {
      const controlNavbar = () => {
        // For mobile - don't hide if mobile menu is open
        if (isMobileMenuOpen) {
          setIsVisible(true);
          return;
        }
        
        const scrollY = window.scrollY;
        
        // Determine scroll direction and distance
        if (scrollY > lastScrollY && scrollY > 80) {
          // Scrolling DOWN & past navbar height - hide
          setIsVisible(false);
        } else {
          // Scrolling UP or at top - show
          setIsVisible(true);
        }
        
        // Update scroll position
        setLastScrollY(scrollY);
      };
      
      // Add scroll event listener
      window.addEventListener('scroll', controlNavbar);
      
      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }, [lastScrollY, isMobileMenuOpen]);

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
    
    const springTransition = { type: "spring", stiffness: 400, damping: 35, mass: 0.8 };
    const mobileMenuSpringTransition = { type: "spring", stiffness: 300, damping: 30, bounce: 0.1 };


    return (
    <>
        <motion.nav 
            ref={mobileMenuWrapperRef} // Ref for click outside
            className={cn(
                "fixed w-full z-30 bg-background/80 dark:bg-background/60 backdrop-blur-lg transition-transform duration-300", // Increased z-index
                className
            )}
            initial={{ translateY: 0 }}
            animate={{
                translateY: isVisible ? 0 : '-100%'
            }}
            transition={springTransition} // Use spring transition here
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Left side with ModeToggle and Temple Name */}
                    <div className="relative flex items-center space-x-3">
                        <ModeToggle />
                        <Link 
                            to="/" 
                            className="flex flex-col hover:opacity-80 transition-opacity"
                            onClick={safePlayClick}
                            onMouseEnter={safePlayHover}
                        >
                            <h1 className="text-base font-semibold text-foreground">
                                ISKM Pudhuvai
                            </h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                International Sri Krishna Mandir
                            </p>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Simplified */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {Object.values(navItems).map((item) => (
                            item.title !== 'Donate' && (
                                <Link
                                    key={item.title}
                                    to={item.to}
                                    onClick={safePlayClick}
                                    onMouseEnter={safePlayHover}
                                    className="inline-flex items-center justify-center text-sm font-medium h-9 py-2 px-3
                                        text-muted-foreground hover:text-primary
                                        hover:bg-primary/10
                                        rounded-full transition-all duration-200"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.title}</span>
                                </Link>
                            )
                        ))}
                        <Link to="/donate" onClick={safePlayClick} onMouseEnter={safePlayHover}>
                            <RainbowButton className="flex items-center gap-2 ml-2">
                                <img 
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" 
                                    alt="Beating Heart" width="20" height="20" 
                                />
                                <span>Donate</span>
                            </RainbowButton>
                        </Link>
                    </div>

                    {/* Right side items (Mobile Menu Trigger, Mobile Donate, Sign In) */}
                    <div className="flex items-center space-x-2">
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
                            className="w-9 h-9 lg:hidden text-foreground"
                            onClick={toggleMobileMenu}
                            onMouseEnter={safePlayHover}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
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
                        className="overflow-hidden lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0 }} // Removed zIndex: -1
                    >
                        <div ref={mobileMenuContentRef} className="p-4 space-y-2">
                            {Object.values(navItems).map((item) => (
                                <Link
                                    key={`mobile-${item.title}`}
                                    to={item.to}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      safePlayClick();
                                      safePlayMenuClose();
                                    }}
                                    onMouseEnter={safePlayHover}
                                    className="w-full p-3 flex items-center gap-3 text-foreground hover:bg-accent rounded-md transition-colors text-base"
                                >
                                    <div className="text-primary">{item.icon}</div>
                                    <span className="font-medium">{item.title}</span>
                                </Link>
                            ))}
                            <a href="/sign-in" className="sm:hidden w-full p-3 flex items-center gap-3 text-foreground hover:bg-accent rounded-md transition-colors text-base" onClick={() => { setIsMobileMenuOpen(false); safePlayClick(); safePlayMenuClose(); }} onMouseEnter={safePlayHover}>
                                <User className="text-primary w-5 h-5" />
                                <span className="font-medium">Sign In / Sign Up</span>
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
    icon: <HomeIcon className="w-4 h-4" />,
    title: "Home",
    to: "/"
  },
  contribute: {
    icon: <HeartHandshakeIcon className="w-4 h-4" />,
    title: "Contribute",
    to: "/coming-soon" // Updated to /coming-soon
  },
  blog: {
    icon: <NewspaperIcon className="w-4 h-4" />,
    title: "Blog",
    to: "/coming-soon" // Updated to /coming-soon
  },
  shop: {
    icon: <ShoppingBagIcon className="w-4 h-4" />,
    title: "Shop",
    to: "/coming-soon" // Updated to /coming-soon
  },
  about: {
    icon: <InfoIcon className="w-4 h-4" />,
    title: "About",
    to: "/about"
  },
  donate: {
    icon: <GiftIcon className="w-4 h-4" />,
    title: "Donate",
    to: "/donate"
  },
  centers: { // Added Centers item
    icon: <GlobeIcon className="w-4 h-4" />,
    title: "Centers",
    to: "/centers"
  }
};
