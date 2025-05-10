import * as React from "react";
import { Link } from '@tanstack/react-router';
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { HomeIcon, InfoIcon, NewspaperIcon, HeartHandshakeIcon, ShoppingBagIcon, GiftIcon, User, Menu } from 'lucide-react';
import { motion } from "motion/react";
import { RainbowButton } from "./ui/rainbow-button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface NavItemType {
  icon: React.ReactNode;
  title: string;
  to: string;
}

interface NavBarProps {
  className?: string;
}

export function NavBar({ className }: NavBarProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(true);
    
    // Handle scroll behavior
    React.useEffect(() => {
      const controlNavbar = () => {
        // For mobile - don't hide if drawer is open
        if (isOpen) {
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
    }, [lastScrollY, isOpen]);

    const renderMobileMenu = () => (
        <div className="px-4 py-2">
            <DrawerHeader className="border-b pb-4">
                <div className="flex items-center gap-2">
                    <img 
                        src="/assets/iskmj.jpg" 
                        alt="ISKM Logo" 
                        width={32} 
                        height={32} 
                        className="rounded-full" 
                    />
                    <DrawerTitle className="text-md font-semibold text-primary">
                        ISKM Pudhuvai
                    </DrawerTitle>
                </div>
            </DrawerHeader>

            {/* Simplified Mobile Navigation */}
            <div className="space-y-3 mt-4 pb-6">
                {Object.values(navItems).map((item) => (
                    <Link
                        key={item.title}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="w-full p-3 flex items-center gap-3 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                        <div className="text-primary">{item.icon}</div>
                        <span className="font-medium">{item.title}</span>
                    </Link>
                ))}
            </div>
            
            <DrawerFooter className="border-t pt-4">
                <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                </DrawerClose>
            </DrawerFooter>
        </div>
    );

    return (
        <motion.nav 
            className={cn(
                "fixed w-full z-20 bg-white/10 dark:bg-black/10 backdrop-blur-xl transition-transform duration-300",
                className
            )}
            initial={{ translateY: 0 }}
            animate={{
                translateY: isVisible ? 0 : '-100%'
            }}
            transition={{ duration: 0.3 }}
        >
            {/* <RainbowGlow position="top" className="opacity-70" containerClassName="h-20" /> Removed RainbowGlow for Navbar */}
            <div className="container mx-auto px-4"> {/* Removed relative z-10 */}
                <div className="flex justify-between items-center h-16">
                    {/* Left side with ModeToggle and Temple Name */}
                    <div className="relative flex items-center space-x-3">
                        <ModeToggle />
                        <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
                            <h1 className="text-base font-semibold text-black dark:text-white">
                                ISKM Pudhuvai
                            </h1>
                            <p className="text-xs text-black/80 dark:text-white/80 hidden sm:block">
                                International Sri Krishna Mandir
                            </p>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Simplified */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {Object.values(navItems).map((item) => (
                            item.title !== 'Donate' && (
                                <Link
                                    key={item.title}
                                    to={item.to}
                                    className="inline-flex items-center justify-center text-sm font-medium h-9 py-2 px-4 
                                        bg-white/80 dark:bg-transparent text-[#b5387d] dark:text-[#ee96d4] 
                                        hover:bg-white/90 dark:hover:bg-accent 
                                        rounded-full transition-all duration-200"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.title}</span>
                                </Link>
                            )
                        ))}

                        {/* Prominent Donate Button with animated heart */}
                        <Link to="/donate">
                            <RainbowButton 
                                className="flex items-center gap-2"
                            >
                                <img 
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" 
                                    alt="Beating Heart" 
                                    width="25" 
                                    height="25" 
                                />
                                <span>Donate</span>
                            </RainbowButton>
                        </Link>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-2">
                        {/* Mobile Donate Button */}
                        <Link to="/donate">
                            <Button 
                                variant="default"
                                className="bg-white text-[#b5387d] sm:hidden rounded-full hover:bg-white/90"
                            >
                                <img 
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" 
                                    alt="Beating Heart" 
                                    width="20" 
                                    height="20" 
                                />
                            </Button>
                        </Link>

                        {/* Mobile Menu using Shadcn Drawer */}
                        <Drawer open={isOpen} onOpenChange={setIsOpen}>
                            <DrawerTrigger asChild>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="w-8 h-8 lg:hidden"
                                >
                                    <Menu className="text-white" />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                {renderMobileMenu()}
                            </DrawerContent>
                        </Drawer>

                        {/* Sign In Button */}
                        <a href="/sign-in" className="hidden sm:inline-block">
                            <Button 
                                size="icon"
                                className="bg-white/80 dark:bg-transparent text-[#b5387d] dark:text-[#ee96d4] 
                                   hover:bg-white/90 dark:hover:bg-accent 
                                   rounded-full w-10 h-10"
                            >
                                <User className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </motion.nav>
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
  }
};
