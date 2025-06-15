import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useWeather } from "@/hooks/useWeather";
import { useTempleStatus } from "@/hooks/useTempleStatus";

// Define types based on hook return types
type WeatherData = ReturnType<typeof useWeather>;
type TempleStatusData = ReturnType<typeof useTempleStatus>;

// Define a local interface for daily forecast items based on useWeather.ts structure
interface DailyForecastDisplay {
  date: string;
  day: string;
  weatherCode: number;
  maxTempRaw: number;
  minTempRaw: number;
  tempUnit: string;
}

// Import icons from lucide-react (those used in this component)
import {
  BellIcon,
  ClockIcon,
  ThermometerIcon,
  DropletIcon as DropIcon, // Renamed to avoid conflict if another DropIcon exists
  WindIcon,
} from 'lucide-react';

// Import weather condition icons from iconify
import CloudIcon from '~icons/lucide/cloud';
import CloudRainIcon from '~icons/lucide/cloud-rain';
import CloudSnowIcon from '~icons/lucide/cloud-snow';
import SunIcon from '~icons/lucide/sun';
import CloudLightningIcon from '~icons/lucide/cloud-lightning';
import CloudDrizzleIcon from '~icons/lucide/cloud-drizzle';
import CloudFogIcon from '~icons/lucide/cloud-fog';

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

interface TempleWeatherPopoverProps {
  weather: WeatherData;
  templeStatus: TempleStatusData;
  isMobile: boolean;
  safePlayClick?: () => void;
  safePlayHover?: () => void; // Added for PopoverTrigger hover
}

export function TempleWeatherPopover({ weather, templeStatus, isMobile, safePlayClick, safePlayHover }: TempleWeatherPopoverProps) {
  const [isFahrenheit, setIsFahrenheit] = React.useState(false);
  const [is24HourFormat, setIs24HourFormat] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'timings' | 'weather'>('timings');

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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12; 
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const nextEventTimeDisplay = templeStatus.nextEventTime;
  const nextEventLabelDisplay = templeStatus.nextEventLabel;

  const tabTransition = {
    type: "spring",
    stiffness: 350,
    damping: 30,
    mass: 0.9,
  };

  const animationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: tabTransition,
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full p-0"
            aria-label="Temple Status and Weather"
            onClick={safePlayClick}
          >
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
          <motion.div layout className="p-4 space-y-3 overflow-y-auto flex-1">
            {/* Tabs for Temple Status and Weather */}
            <div className="flex border-b border-border">
              <div 
                className={cn(
                  "flex-1 px-3 py-2 text-center border-r border-border cursor-pointer hover:bg-accent/50 font-medium text-base",
                  activeTab === 'timings' && "bg-accent text-accent-foreground"
                )}
                onClick={() => setActiveTab('timings')}
              >
                Temple Timings
              </div>
              <div 
                className={cn(
                  "flex-1 px-3 py-2 text-center cursor-pointer hover:bg-accent/50 font-medium text-base",
                  activeTab === 'weather' && "bg-accent text-accent-foreground"
                )}
                onClick={() => setActiveTab('weather')}
              >
                Weather
              </div>
            </div>
            
            <MotionConfig transition={tabTransition}>
              <AnimatePresence mode="wait">
                {activeTab === 'timings' && (
                <motion.div
                  key="timingsMobile"
                  initial={animationProps.initial}
                  animate={animationProps.animate}
                  exit={animationProps.exit}
                  className="mb-2"
                >
                  {/* Temple Status & Timings Section - Compact */}
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
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Mangal Aarati:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '04:30' : '4:30 AM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Darshan Aarati:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '07:15' : '7:15 AM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Guru Puja:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '07:20' : '7:20 AM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Bhagvatam:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '08:00' : '8:00 AM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '12:00' : '12:00 PM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Gaura Arati:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '17:30' : '5:30 PM'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base xs:text-lg text-muted-foreground">Darshan Closes:</span>
                    <Badge variant="default" className="text-sm font-medium px-1.5 py-0.5">{is24HourFormat ? '18:30' : '6:30 PM'}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div><span>Darshan Open</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0"></div><span>Aarati Ongoing</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div><span>Temple Open</span></div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div><span>Closed (End of Day)</span></div>
              </div> {/* This div was part of the timings content and should be inside its motion.div */}
                </motion.div>
                )}
                
                {activeTab === 'weather' && (
                <motion.div
                  key="weatherMobile"
                  initial={animationProps.initial}
                  animate={animationProps.animate}
                  exit={animationProps.exit}
                  className="pt-2"
                > 
                  {/* Weather Section - Compact - Removed border-t as it's now conditional */}
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
                      id="fahrenheit-toggle-drawer"
                      checked={isFahrenheit}
                      onCheckedChange={setIsFahrenheit}
                      className="scale-75 data-[state=checked]:bg-blue-500"
                      aria-label="Toggle Fahrenheit"
                    />
                    <Label htmlFor="fahrenheit-toggle-drawer" className="text-sm">°F</Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Switch
                      id="timeformat-toggle-drawer"
                      checked={is24HourFormat}
                      onCheckedChange={setIs24HourFormat}
                      className="scale-75 data-[state=checked]:bg-blue-500"
                      aria-label="Toggle 24-hour time format"
                    />
                    <Label htmlFor="timeformat-toggle-drawer" className="text-sm">24h</Label>
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
            {/* Forecast section moved inside the main weather tab div */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <h4 className="font-medium text-sm mb-2 text-muted-foreground">7-Day Forecast</h4>
              <div className="grid grid-cols-7 gap-1">
                {weather.forecast.map((day: DailyForecastDisplay, index: number) => (
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
            </div> {/* This div was part of the weather content and should be inside its motion.div */}
                </motion.div>
                )}
              </AnimatePresence>
            </MotionConfig>
          </motion.div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
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
          <div className={cn(
            "absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full ring-1 ring-background xs:h-2 xs:w-2 xs:ring-2",
            templeStatus.colorClass,
            (!(templeStatus.colorClass.includes('red-500') || templeStatus.colorClass.includes('gray-500'))) && "animate-ping opacity-75"
          )} />
          <div className={cn(
            "absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full xs:h-2 xs:w-2",
            templeStatus.colorClass
          )} />
          
          <div className="flex items-center">
            <ClockIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground" />
            <span className="text-xs xs:text-sm text-muted-foreground ml-0.5 font-medium">
              {formatTime(nextEventTimeDisplay, is24HourFormat)}
              {nextEventLabelDisplay && ` (${nextEventLabelDisplay})`}
            </span>
          </div>
          
          <div className="h-2.5 w-px bg-gray-300 dark:bg-gray-600 mx-0.5 xs:h-3 xs:mx-1"></div>
          
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
      
      <PopoverContent className="w-auto max-w-sm p-0 overflow-hidden" sideOffset={10} align="end">
        <div className="flex border-b border-border">
          <div 
            className={cn(
              "flex-1 px-3 py-2 text-center border-r border-border cursor-pointer hover:bg-accent/50 font-medium text-base",
              activeTab === 'timings' && "bg-accent text-accent-foreground"
            )}
            onClick={() => setActiveTab('timings')}
          >
            Temple Timings
          </div>
          <div 
            className={cn(
              "flex-1 px-3 py-2 text-center cursor-pointer hover:bg-accent/50 font-medium text-base",
              activeTab === 'weather' && "bg-accent text-accent-foreground"
            )}
            onClick={() => setActiveTab('weather')}
          >
            Weather
          </div>
        </div>
        
        <motion.div layout className="p-4 space-y-4">
          <MotionConfig transition={tabTransition}>
            <AnimatePresence mode="wait">
              {activeTab === 'timings' && (
              <motion.div
                key="timingsDesktop"
                initial={animationProps.initial}
                animate={animationProps.animate}
                exit={animationProps.exit}
                className="mb-2"
              >
                {/* Temple Status & Timings Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <BellIcon className="w-4 h-4" />
                  <div className={cn("absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full", templeStatus.colorClass)} />
                </div>
                <p className="font-semibold text-lg">{templeStatus.label}</p>
              </div>
            </div>
            <p className="mt-1 text-base text-muted-foreground">{templeStatus.detailedText}</p>
            
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-base font-medium mb-2">Daily Schedule:</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-base">
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Mangal Aarati:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '04:30' : '4:30 AM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Darshan Aarati:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '07:15' : '7:15 AM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Guru Puja:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '07:20' : '7:20 AM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Bhagvatam:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '08:00' : '8:00 AM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Darshan Closes:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '12:00' : '12:00 PM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Gaura Arati:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '17:30' : '5:30 PM'}</Badge>
                </div>
                <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1">
                  <span className="text-base text-muted-foreground">Darshan Closes:</span>
                  <Badge variant="default" className="text-base font-medium px-1.5 py-0.5">{is24HourFormat ? '18:30' : '6:30 PM'}</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-x-2 gap-y-1.5 text-base">
              <div className="flex items-center gap-1.5 bg-green-100/50 dark:bg-green-900/20 rounded-md px-2 py-1"><div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div><span className="font-medium text-green-800 dark:text-green-300">Darshan Open</span></div>
              <div className="flex items-center gap-1.5 bg-pink-100/50 dark:bg-pink-900/20 rounded-md px-2 py-1"><div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0"></div><span className="font-medium text-pink-800 dark:text-pink-300">Aarati Ongoing</span></div>
              <div className="flex items-center gap-1.5 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md px-2 py-1"><div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div><span className="font-medium text-yellow-800 dark:text-yellow-300">Temple Open</span></div>
              <div className="flex items-center gap-1.5 bg-red-100/50 dark:bg-red-900/20 rounded-md px-2 py-1"><div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div><span className="font-medium text-red-800 dark:text-red-300">Closed (End of Day)</span></div>
                {/* Legend for status colors */}
                </div>
              </motion.div>
              )}
              
              {activeTab === 'weather' && (
              <motion.div
                key="weatherDesktop"
                initial={animationProps.initial}
                animate={animationProps.animate}
                exit={animationProps.exit}
              >
                {/* Removed React.Fragment wrapper, motion.div can have multiple children */}
                  <div className="pt-0"> 
                    {/* Weather Section - Removed border-t as it's now conditional */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                          <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-base">
                            {formatTemperature(weather.currentTemperatureRaw, weather.currentTemperatureUnit, isFahrenheit)}
                          </p>
                          <p className="text-base text-muted-foreground capitalize">{weather.weatherDescription || 'Weather data'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="fahrenheit-toggle-popover"
                            checked={isFahrenheit}
                            onCheckedChange={setIsFahrenheit}
                            className="data-[state=checked]:bg-blue-500"
                            aria-label="Toggle Fahrenheit"
                          />
                          <Label htmlFor="fahrenheit-toggle-popover" className="text-base">°F</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="timeformat-toggle-popover"
                            checked={is24HourFormat}
                            onCheckedChange={setIs24HourFormat}
                            className="data-[state=checked]:bg-blue-500"
                            aria-label="Toggle 24-hour time format"
                          />
                          <Label htmlFor="timeformat-toggle-popover" className="text-base">24h</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 text-base">
                        <DropIcon className="w-4 h-4 text-blue-500" />
                        <span>Humidity: {weather.currentHumidityRaw !== null ? `${Math.round(weather.currentHumidityRaw)}${weather.currentHumidityUnit}` : '--'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-base">
                        <ThermometerIcon className="w-4 h-4 text-red-500" />
                        <span>Feels like: {weather.currentTemperatureRaw !== null ? `${Math.round(weather.currentTemperatureRaw - 2)}${weather.currentTemperatureUnit}` : '--'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-base">
                        <WindIcon className="w-4 h-4 text-teal-500" />
                        <span>Wind: {weather.currentWindSpeedRaw !== null ? `${Math.round(weather.currentWindSpeedRaw)}${weather.currentWindSpeedUnit}` : '--'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weekly Forecast - ensure this is also part of the weather tab */}
                  <div className="mt-4 pt-4 border-t border-border/50"> 
                    <h4 className="font-medium text-base mb-3 text-muted-foreground">7-Day Forecast</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {weather.forecast.map((day: DailyForecastDisplay, index: number) => (
                        <div key={day.date} className="flex flex-col items-center">
                          <span className="text-base font-medium">{index === 0 ? 'Today' : day.day}</span>
                          <WeatherIcon
                            weatherCode={day.weatherCode}
                            isDay={true}
                            className="w-6 h-6 my-1.5 text-blue-600 dark:text-blue-400"
                          />
                          <span className="text-base font-medium">{formatTemperature(day.maxTempRaw, day.tempUnit, isFahrenheit)}</span>
                          <span className="text-base text-muted-foreground">{formatTemperature(day.minTempRaw, day.tempUnit, isFahrenheit)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                {/* End of React.Fragment wrapper removal */}
              </motion.div>
              )}
            </AnimatePresence>
          </MotionConfig>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
