import * as React from "react";
import { Link } from '@tanstack/react-router';
import { useSound } from 'use-sound';
import { useSoundSettings, SoundProvider } from "@/components/context/sound-context";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";
import { User, Menu, X } from 'lucide-react';
// Import icons from iconify
import HomeIcon from '~icons/lucide/home';
import InfoIcon from '~icons/lucide/info';
import NewspaperIcon from '~icons/lucide/newspaper';
import HeartHandshakeIcon from '~icons/lucide/heart-handshake';
import ShoppingBagIcon from '~icons/lucide/shopping-bag';
import GiftIcon from '~icons/lucide/gift';
import GlobeIcon from '~icons/lucide/globe';
import CloudIcon from '~icons/lucide/cloud';
import CloudRainIcon from '~icons/lucide/cloud-rain';
import CloudSnowIcon from '~icons/lucide/cloud-snow';
import SunIcon from '~icons/lucide/sun';
import CloudLightningIcon from '~icons/lucide/cloud-lightning';
import CloudDrizzleIcon from '~icons/lucide/cloud-drizzle';
import CloudFogIcon from '~icons/lucide/cloud-fog';
import ClockIcon from '~icons/lucide/clock';
import ThermometerIcon from '~icons/lucide/thermometer';
import DropIcon from '~icons/lucide/droplet';
import WindIcon from '~icons/lucide/wind';
import BellIcon from '~icons/lucide/bell';

// Weather icon component based on weather code from Open-Meteo API
function WeatherIcon({ weatherCode, isDay = true, ...props }: { weatherCode: number; isDay?: boolean } & React.SVGProps<SVGSVGElement>) {
  const getIcon = () => {
    // Clear sky
    if (weatherCode === 0) return isDay ? <SunIcon {...props} /> : <SunIcon {...props} />;
    
    // Mainly clear, partly cloudy
    if (weatherCode === 1 || weatherCode === 2) return <CloudIcon {...props} />;
    
    // Overcast
    if (weatherCode === 3) return <CloudIcon {...props} />;
    
    // Fog
    if (weatherCode === 45 || weatherCode === 48) return <CloudFogIcon {...props} />;
    
    // Drizzle
    if (weatherCode >= 51 && weatherCode <= 57) return <CloudDrizzleIcon {...props} />;
    
    // Rain
    if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return <CloudRainIcon {...props} />;
    
    // Snow
    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode === 85 || weatherCode === 86)) return <CloudSnowIcon {...props} />;
    
    // Thunderstorm
    if (weatherCode >= 95 && weatherCode <= 99) return <CloudLightningIcon {...props} />;
    
    // Default
    return <CloudIcon {...props} />;
  };
  
  return getIcon();
}

import { motion, AnimatePresence } from "motion/react";
import useMeasure from 'react-use-measure';
import useClickOutside from '@/components/motion-primitives/useClickOutside';
import { RainbowButton } from "./ui/rainbow-button";
import { useTempleStatus } from "@/hooks/useTempleStatus"; // Added
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemType {
  icon: React.ReactNode;
  title: string;
  to: string;
}

interface NavBarProps {
  className?: string;
}

function NavBarComponent({ className }: NavBarProps) {
    const isMobile = useIsMobile();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [mobileMenuContentRef, { height: mobileMenuHeight }] = useMeasure();
    const mobileMenuWrapperRef = React.useRef<HTMLDivElement>(null);

    const [isFahrenheit, setIsFahrenheit] = React.useState(false);
    const [is24HourFormat, setIs24HourFormat] = React.useState(false);

    const [lastScrollY, setLastScrollY] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(true);

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

    // Helper functions
    const formatTemperature = (tempC: number | null, unit: string | null, toFahrenheit: boolean): string => {
      if (tempC === null || unit === null) return '--°';
      if (toFahrenheit) {
        const tempF = Math.round((tempC * 9/5) + 32);
        return `${tempF}°F`;
      }
      return `${Math.round(tempC)}${unit}`;
    };

    const formatTime = (timeStr: string | null, use24Hour: boolean): string => {
      if (!timeStr) return '--:-- --';
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (use24Hour) {
        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        }
        if (modifier === 'AM' && hours === 12) { // Midnight case
          hours = 0;
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      // For 12-hour format, the original timeStr already has AM/PM, so we just need to format it
      // if the hours are 0 (midnight) or 12 (noon) to ensure correct 12-hour display.
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
    };
    
    // Use dynamic next event time from useTempleStatus hook
    const nextEventTimeDisplay = templeStatus.nextEventTime;
    const nextEventLabelDisplay = templeStatus.nextEventLabel;


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
            <div className="w-full px-1 xs:px-2 sm:px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Left side with ModeToggle and Temple Name */}
                    <div className="relative flex items-center space-x-2 sm:space-x-3">
                        <ModeToggle />
                        {/* Temple Name Link - Popover and dot removed from here */}
                        <Link 
                            to="/" 
                            className="flex flex-col hover:opacity-80 transition-opacity min-w-0 flex-grow flex-shrink ml-1 sm:ml-0"
                            onClick={safePlayClick}
                            onMouseEnter={safePlayHover}
                        >
                            <h1 className="text-sm md:text-base font-semibold text-foreground flex flex-col sm:block">
                                <span>ISKM</span>
                                <span className="sm:ml-1">Pondicherry</span>
                            </h1>
                            <p className="text-xs text-muted-foreground hidden 2xl:block truncate">
                                Pudhuvai Vrindavanam, Radha Krishna Temple.
                            </p>
                            <p className="text-xs text-muted-foreground hidden sm:block truncate">
                                International Sri Krishna Mandir 
                            </p>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Simplified */}
                    <div className="hidden xl:flex items-center space-x-1">
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

                    {/* Right side items (Mobile Menu Trigger, Mobile Donate, Temple Status Bell, Sign In) */}
                    <div className="flex items-center space-x-2">
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
                        {/* Ultra-Compact Temple Status and Weather Button for all screens including iPhone */}
                        {isMobile ? (
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-8 w-8 rounded-full p-0"
                                aria-label="Temple Status and Weather"
                                onClick={safePlayClick}
                              >
                                {/* Animated ping dot */}
                                <div className={cn(
                                  "absolute top-1 right-1 h-2 w-2 rounded-full",
                                  templeStatus.colorClass,
                                  (!(templeStatus.colorClass.includes('red-500') || templeStatus.colorClass.includes('gray-500'))) && "animate-ping opacity-75"
                                )} />
                                <div className={cn(
                                  "absolute top-1 right-1 h-2 w-2 rounded-full ring-1 ring-background",
                                  templeStatus.colorClass
                                )} />
                                <BellIcon className="h-4 w-4" />
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-[80vh] flex flex-col">
                              <DrawerHeader className="text-left">
                                <DrawerTitle className="text-xl font-bold">Temple Status & Weather</DrawerTitle>
                              </DrawerHeader>
                              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                                {/* Tabs for Temple Status and Weather */}
                                <div className="flex border-b border-border">
                                  <div className="flex-1 px-3 py-2 text-center border-r border-border cursor-pointer hover:bg-accent/50 font-medium text-base">Temple Timings</div>
                                  <div className="flex-1 px-3 py-2 text-center cursor-pointer hover:bg-accent/50 font-medium text-base">Weather</div>
                                </div>
                                
                                {/* Temple Status & Timings Section - Compact */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <div className="relative">
                                        <BellIcon className="w-3.5 h-3.5" />
                                        <div className={cn("absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full", templeStatus.colorClass)} />
                                      </div>
                                      <p className="font-semibold text-base xs:text-lg">{templeStatus.label}</p>
                                    </div>
                                    <span className="text-sm font-medium">Current Status</span>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">{templeStatus.detailedText}</p>
                                  
                                  {/* Daily Schedule with 24h format option */}
                                  <div className="mt-2 pt-2 border-t border-border/50">
                                    <p className="text-sm font-medium mb-1">Daily Schedule:</p>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Mangal Aarati:</span>
                                        <span>{is24HourFormat ? '04:30' : '4:30 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Aarati:</span>
                                        <span>{is24HourFormat ? '07:15' : '7:15 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Guru Puja:</span>
                                        <span>{is24HourFormat ? '07:20' : '7:20 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Bhagvatam:</span>
                                        <span>{is24HourFormat ? '08:00' : '8:00 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                                        <span>{is24HourFormat ? '12:00' : '12:00 PM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Gaura Arati:</span>
                                        <span>{is24HourFormat ? '17:30' : '5:30 PM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                                        <span>{is24HourFormat ? '18:30' : '6:30 PM'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div><span>Darshan Open</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0"></div><span>Aarati Ongoing</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div><span>Temple Open</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div><span>Closed (End of Day)</span></div>
                                  </div>
                                </div>
                                
                                {/* Weather Section - Compact */}
                                <div className="pt-2 border-t border-border/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                        <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-sm">
                                          {formatTemperature(weather.currentTemperatureRaw, weather.currentTemperatureUnit, isFahrenheit)}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">{weather.weatherDescription || 'Weather data'}</p>
                                      </div>
                                    </div>
                                    {/* Settings Toggles - More compact */}
                                    <div className="space-y-1.5">
                                      <div className="flex items-center space-x-1.5">
                                        <Switch
                                          id="fahrenheit-toggle"
                                          checked={isFahrenheit}
                                          onCheckedChange={setIsFahrenheit}
                                          className="scale-75 data-[state=checked]:bg-blue-500"
                                          aria-label="Toggle Fahrenheit"
                                        />
                                        <Label htmlFor="fahrenheit-toggle" className="text-sm">°F</Label>
                                      </div>
                                      <div className="flex items-center space-x-1.5">
                                        <Switch
                                          id="timeformat-toggle"
                                          checked={is24HourFormat}
                                          onCheckedChange={setIs24HourFormat}
                                          className="scale-75 data-[state=checked]:bg-blue-500"
                                          aria-label="Toggle 24-hour time format"
                                        />
                                        <Label htmlFor="timeformat-toggle" className="text-sm">24h</Label>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                                    <div className="flex items-center gap-1 text-sm">
                                      <DropIcon className="w-3 h-3 text-blue-500" />
                                      <span>Humidity: {weather.currentHumidityRaw !== null ? `${Math.round(weather.currentHumidityRaw)}${weather.currentHumidityUnit}` : '--'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                      <ThermometerIcon className="w-3 h-3 text-red-500" />
                                      <span>Feels like: {weather.currentTemperatureRaw !== null ? `${Math.round(weather.currentTemperatureRaw - 2)}${weather.currentTemperatureUnit}` : '--'}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-sm">
                                      <WindIcon className="w-3 h-3 text-teal-500" />
                                      <span>Wind: {weather.currentWindSpeedRaw !== null ? `${Math.round(weather.currentWindSpeedRaw)}${weather.currentWindSpeedUnit}` : '--'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Weekly Forecast */}
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">7-Day Forecast</h4>
                                  <div className="grid grid-cols-7 gap-1">
                                    {weather.forecast.map((day, index) => (
                                      <div key={day.date} className="flex flex-col items-center">
                                        <span className="text-sm font-medium">{index === 0 ? 'Today' : day.day}</span>
                                        <WeatherIcon 
                                          weatherCode={day.weatherCode} 
                                          isDay={true} 
                                          className="w-5 h-5 my-1 text-blue-600 dark:text-blue-400" 
                                        />
                                        <span className="text-sm font-medium">{formatTemperature(day.maxTempRaw, day.tempUnit, isFahrenheit)}</span>
                                        <span className="text-sm text-muted-foreground">{formatTemperature(day.minTempRaw, day.tempUnit, isFahrenheit)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <DrawerFooter>
                                <DrawerClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "h-7 px-1.5 mr-1.5 flex items-center gap-1 text-xs font-medium border shadow-sm hover:shadow transition-all relative xs:h-8 xs:px-2 xs:mr-2 xs:gap-1.5",
                                  "bg-gradient-to-r",
                                  templeStatus.colorClass === 'bg-green-500' ? 'from-green-100 to-blue-50 dark:from-green-900/20 dark:to-blue-900/10 text-green-800 dark:text-green-300 hover:from-green-100 hover:to-blue-100' : '',
                                  templeStatus.colorClass === 'bg-pink-500' ? 'from-pink-100 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/10 text-pink-800 dark:text-pink-300 hover:from-pink-100 hover:to-blue-100' : '',
                                  templeStatus.colorClass === 'bg-yellow-500' ? 'from-yellow-100 to-blue-50 dark:from-yellow-900/20 dark:to-blue-900/10 text-yellow-800 dark:text-yellow-300 hover:from-yellow-100 hover:to-blue-100' : '',
                                  templeStatus.colorClass === 'bg-red-500' ? 'from-red-100 to-blue-50 dark:from-red-900/20 dark:to-blue-900/10 text-red-800 dark:text-red-300 hover:from-red-100 hover:to-blue-100' : '',
                                  templeStatus.colorClass === 'bg-gray-500' ? 'from-gray-100 to-blue-50 dark:from-gray-800/30 dark:to-blue-900/10 text-gray-800 dark:text-gray-300 hover:from-gray-100 hover:to-blue-100' : '',
                                  templeStatus.colorClass === 'bg-orange-500' ? 'from-orange-100 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/10 text-orange-800 dark:text-orange-300 hover:from-orange-100 hover:to-blue-100' : ''
                                )}
                                aria-label="Temple Status and Weather"
                                onClick={safePlayClick}
                                onMouseEnter={safePlayHover}
                              >
                                {/* Animated ping dot in top right */}
                                <div className={cn(
                                  "absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full ring-1 ring-background xs:h-2 xs:w-2 xs:ring-2",
                                  templeStatus.colorClass,
                                  (!(templeStatus.colorClass.includes('red-500') || templeStatus.colorClass.includes('gray-500'))) && "animate-ping opacity-75"
                                )} />
                                <div className={cn(
                                  "absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full xs:h-2 xs:w-2",
                                  templeStatus.colorClass
                                )} />
                                
                                {/* Time and Next Event Label - Further increased font size */}
                                <div className="flex items-center">
                                  <ClockIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground" />
                                  <span className="text-xs xs:text-sm text-muted-foreground ml-0.5 font-medium">
                                    {formatTime(nextEventTimeDisplay, is24HourFormat)}
                                    {nextEventLabelDisplay && ` (${nextEventLabelDisplay})`}
                                  </span>
                                </div>
                                
                                {/* Divider - Smaller for iPhone */}
                                <div className="h-2.5 w-px bg-gray-300 dark:bg-gray-600 mx-0.5 xs:h-3 xs:mx-1"></div>
                                
                                {/* Weather - Further increased font size */}
                                <div className="flex items-center">
                                  {weather.isLoading ? (
                                    <ThermometerIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-blue-500 dark:text-blue-400" />
                                  ) : (
                                    <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-blue-500 dark:text-blue-400" />
                                  )}
                                  <span className="text-xs xs:text-sm text-blue-700 dark:text-blue-300 ml-0.5 font-medium">
                                    {formatTemperature(weather.currentTemperatureRaw, weather.currentTemperatureUnit, isFahrenheit)}
                                  </span>
                                </div>
                              </Button>
                            </PopoverTrigger>
                            
                            <PopoverContent className="w-auto p-0 overflow-hidden" sideOffset={10} align="end">
                              {/* Tabs for Temple Status and Weather */}
                              <div className="flex border-b border-border">
                                <div className="flex-1 px-3 py-1.5 text-center border-r border-border cursor-pointer hover:bg-accent/50 font-medium text-xs">Temple Timings</div>
                                <div className="flex-1 px-3 py-1.5 text-center cursor-pointer hover:bg-accent/50 font-medium text-xs">Weather</div>
                              </div>
                              
                              <div className="p-3 space-y-3">
                                {/* Temple Status & Timings Section - Compact */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <div className="relative">
                                        <BellIcon className="w-3.5 h-3.5" />
                                        <div className={cn("absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full", templeStatus.colorClass)} />
                                      </div>
                                      <p className="font-semibold text-base xs:text-lg">{templeStatus.label}</p>
                                    </div>
                                    <span className="text-sm font-medium">Current Status</span>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">{templeStatus.detailedText}</p>
                                  
                                  {/* Daily Schedule with 24h format option */}
                                  <div className="mt-2 pt-2 border-t border-border/50">
                                    <p className="text-sm font-medium mb-1">Daily Schedule:</p>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Mangal Aarati:</span>
                                        <span>{is24HourFormat ? '04:30' : '4:30 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Aarati:</span>
                                        <span>{is24HourFormat ? '07:15' : '7:15 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Guru Puja:</span>
                                        <span>{is24HourFormat ? '07:20' : '7:20 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Bhagvatam:</span>
                                        <span>{is24HourFormat ? '08:00' : '8:00 AM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                                        <span>{is24HourFormat ? '12:00' : '12:00 PM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Gaura Arati:</span>
                                        <span>{is24HourFormat ? '17:30' : '5:30 PM'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                                        <span>{is24HourFormat ? '18:30' : '6:30 PM'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div><span>Darshan Open</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0"></div><span>Aarati Ongoing</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div><span>Temple Open</span></div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div><span>Closed (End of Day)</span></div>
                                  </div>
                                </div>
                                
                                {/* Weather Section - Compact */}
                                <div className="pt-2 border-t border-border/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                        <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-sm">
                                          {formatTemperature(weather.currentTemperatureRaw, weather.currentTemperatureUnit, isFahrenheit)}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">{weather.weatherDescription || 'Weather data'}</p>
                                      </div>
                                    </div>
                                    {/* Settings Toggles - More compact */}
                                    <div className="space-y-1.5">
                                      <div className="flex items-center space-x-1.5">
                                        <Switch
                                          id="fahrenheit-toggle"
                                          checked={isFahrenheit}
                                          onCheckedChange={setIsFahrenheit}
                                          className="scale-75 data-[state=checked]:bg-blue-500"
                                          aria-label="Toggle Fahrenheit"
                                        />
                                        <Label htmlFor="fahrenheit-toggle" className="text-sm">°F</Label>
                                      </div>
                                      <div className="flex items-center space-x-1.5">
                                        <Switch
                                          id="timeformat-toggle"
                                          checked={is24HourFormat}
                                          onCheckedChange={setIs24HourFormat}
                                          className="scale-75 data-[state=checked]:bg-blue-500"
                                          aria-label="Toggle 24-hour time format"
                                        />
                                        <Label htmlFor="timeformat-toggle" className="text-sm">24h</Label>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                                    <div className="flex items-center gap-1 text-sm">
                                      <DropIcon className="w-3 h-3 text-blue-500" />
                                      <span>Humidity: {weather.currentHumidityRaw !== null ? `${Math.round(weather.currentHumidityRaw)}${weather.currentHumidityUnit}` : '--'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                      <ThermometerIcon className="w-3 h-3 text-red-500" />
                                      <span>Feels like: {weather.currentTemperatureRaw !== null ? `${Math.round(weather.currentTemperatureRaw - 2)}${weather.currentTemperatureUnit}` : '--'}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-sm">
                                      <WindIcon className="w-3 h-3 text-teal-500" />
                                      <span>Wind: {weather.currentWindSpeedRaw !== null ? `${Math.round(weather.currentWindSpeedRaw)}${weather.currentWindSpeedUnit}` : '--'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Weekly Forecast */}
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">7-Day Forecast</h4>
                                  <div className="grid grid-cols-7 gap-1">
                                    {weather.forecast.map((day, index) => (
                                      <div key={day.date} className="flex flex-col items-center">
                                        <span className="text-sm font-medium">{index === 0 ? 'Today' : day.day}</span>
                                        <WeatherIcon 
                                          weatherCode={day.weatherCode} 
                                          isDay={true} 
                                          className="w-5 h-5 my-1 text-blue-600 dark:text-blue-400" 
                                        />
                                        <span className="text-sm font-medium">{formatTemperature(day.maxTempRaw, day.tempUnit, isFahrenheit)}</span>
                                        <span className="text-sm text-muted-foreground">{formatTemperature(day.minTempRaw, day.tempUnit, isFahrenheit)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
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
    to: "/shop" // Updated to /coming-soon
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
