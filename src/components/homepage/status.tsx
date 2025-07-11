import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { motion, AnimatePresence, MotionConfig, type Transition } from 'motion/react';
import { useWeather } from "@/hooks/useWeather";
import { useTempleStatus } from "@/hooks/useTempleStatus";

// Define types
type WeatherData = ReturnType<typeof useWeather>;
type TempleStatusData = ReturnType<typeof useTempleStatus>;

interface DailyForecastDisplay {
  date: string;
  day: string;
  weatherCode: number;
  maxTempRaw: number;
  minTempRaw: number;
  tempUnit: string;
}

// Import icons
import {
  BellIcon,
  ClockIcon,
  ThermometerIcon,
  DropletIcon as DropIcon,
  WindIcon,
  ArrowLeftIcon,
} from 'lucide-react';

import CloudIcon from '~icons/lucide/cloud';
import CloudRainIcon from '~icons/lucide/cloud-rain';
import CloudSnowIcon from '~icons/lucide/cloud-snow';
import SunIcon from '~icons/lucide/sun';
import CloudLightningIcon from '~icons/lucide/cloud-lightning';
import CloudDrizzleIcon from '~icons/lucide/cloud-drizzle';
import CloudFogIcon from '~icons/lucide/cloud-fog';

// WeatherIcon component
function WeatherIcon({ weatherCode, isDay = true, ...props }: { weatherCode: number; isDay?: boolean } & React.SVGProps<SVGSVGElement>) {
  const getIcon = () => {
    if (weatherCode === 0) return isDay ? <SunIcon {...props} /> : <SunIcon {...props} />;
    if (weatherCode <= 2) return <CloudIcon {...props} />;
    if (weatherCode === 3) return <CloudIcon {...props} />;
    if (weatherCode <= 48) return <CloudFogIcon {...props} />;
    if (weatherCode <= 57) return <CloudDrizzleIcon {...props} />;
    if (weatherCode <= 67 || (weatherCode >= 80 && weatherCode <= 82)) return <CloudRainIcon {...props} />;
    if (weatherCode <= 77 || weatherCode === 85 || weatherCode === 86) return <CloudSnowIcon {...props} />;
    if (weatherCode <= 99) return <CloudLightningIcon {...props} />;
    return <CloudIcon {...props} />;
  };
  return getIcon();
}

interface TempleWeatherPopoverProps {
  weather: WeatherData;
  templeStatus: TempleStatusData;
  isMobile: boolean;
  safePlayClick?: () => void;
  safePlayHover?: () => void;
}

export function TempleWeatherPopover({ weather, templeStatus, isMobile, safePlayClick, safePlayHover }: TempleWeatherPopoverProps) {
  const [isFahrenheit, setIsFahrenheit] = React.useState(false);
  const [is24HourFormat, setIs24HourFormat] = React.useState(false);
  const [view, setView] = React.useState<'timings' | 'weather'>('timings');

  // Reset view to 'timings' when the popover closes
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setView('timings'), 150); // Delay to allow exit animation
    }
  };

  const formatTemperature = (tempC: number | null, unit: string | null, toFahrenheit: boolean): string => {
    if (tempC === null || unit === null) return '--°';
    return toFahrenheit ? `${Math.round((tempC * 9/5) + 32)}°F` : `${Math.round(tempC)}${unit}`;
  };

  const formatTime = (timeStr: string | null, use24Hour: boolean): string => {
    if (!timeStr) return '--:-- --';
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (use24Hour) {
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const tabTransition: Transition = { type: "spring", stiffness: 350, damping: 30, mass: 0.9 };
  const animationProps = {
    initial: { opacity: 0, x: view === 'weather' ? 30 : -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: view === 'weather' ? -30 : 30 },
    transition: tabTransition,
  };

  const timingsContent = (
    <motion.div key="timings" {...animationProps}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <BellIcon className="w-4 h-4" />
            <div className={cn("absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full", templeStatus.colorClass)} />
          </div>
          <p className="font-semibold text-base">{templeStatus.label}</p>
        </div>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setView('weather')}>
          <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-5 h-5 text-blue-500" />
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{templeStatus.detailedText}</p>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Daily Schedule:</p>
            <div className="flex items-center space-x-2">
                <Switch id="timeformat-toggle" checked={is24HourFormat} onCheckedChange={setIs24HourFormat} aria-label="Toggle 24h format" />
                <Label htmlFor="timeformat-toggle" className="text-sm">24h</Label>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          {/* Schedule items */}
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Mangal Aarati:</span><Badge variant="default">{formatTime('4:30 AM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Darshan Aarati:</span><Badge variant="default">{formatTime('7:15 AM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Guru Puja:</span><Badge variant="default">{formatTime('7:20 AM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Bhagvatam:</span><Badge variant="default">{formatTime('8:00 AM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Darshan Closes:</span><Badge variant="default">{formatTime('12:00 PM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Gaura Arati:</span><Badge variant="default">{formatTime('5:30 PM', is24HourFormat)}</Badge></div>
          <div className="flex items-center justify-between bg-accent/30 rounded-md px-2 py-1.5"><span className="text-muted-foreground">Darshan Closes:</span><Badge variant="default">{formatTime('6:30 PM', is24HourFormat)}</Badge></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Darshan Open</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500" /><span>Aarati Ongoing</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /><span>Temple Open</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span>Closed</span></div>
      </div>
    </motion.div>
  );

  const weatherContent = (
    <motion.div key="weather" {...animationProps}>
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setView('timings')}><ArrowLeftIcon className="w-5 h-5" /></Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
            <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="w-7 h-7 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <p className="font-semibold text-base">{formatTemperature(weather.currentTemperatureRaw, weather.currentTemperatureUnit, isFahrenheit)}</p>
            <p className="text-sm text-muted-foreground capitalize">{weather.weatherDescription || 'Weather'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="fahrenheit-toggle" checked={isFahrenheit} onCheckedChange={setIsFahrenheit} aria-label="Toggle Fahrenheit" />
          <Label htmlFor="fahrenheit-toggle" className="text-sm">°F</Label>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5"><DropIcon className="w-4 h-4 text-blue-500" /><span>Humidity: {weather.currentHumidityRaw}%</span></div>
        <div className="flex items-center gap-1.5"><ThermometerIcon className="w-4 h-4 text-red-500" /><span>Feels like: {formatTemperature(weather.currentTemperatureRaw ? weather.currentTemperatureRaw - 2 : null, '°C', isFahrenheit)}</span></div>
        <div className="flex items-center gap-1.5"><WindIcon className="w-4 h-4 text-teal-500" /><span>Wind: {weather.currentWindSpeedRaw} {weather.currentWindSpeedUnit}</span></div>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <h4 className="font-medium text-sm mb-3 text-muted-foreground">7-Day Forecast</h4>
        <div className="grid grid-cols-7 gap-1">
          {weather.forecast.map((day: DailyForecastDisplay, index: number) => (
            <div key={day.date} className="flex flex-col items-center text-center">
              <span className="text-xs font-medium">{index === 0 ? 'Today' : day.day}</span>
              <WeatherIcon weatherCode={day.weatherCode} isDay={true} className="w-5 h-5 my-1 text-blue-600" />
              <span className="text-xs font-medium">{formatTemperature(day.maxTempRaw, day.tempUnit, isFahrenheit)}</span>
              <span className="text-xs text-muted-foreground">{formatTemperature(day.minTempRaw, day.tempUnit, isFahrenheit)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const popoverContent = (
    <div className="p-4 overflow-hidden">
      <MotionConfig transition={tabTransition}>
        <AnimatePresence mode="wait" initial={false}>
          {view === 'timings' ? timingsContent : weatherContent}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full p-0" aria-label="Temple Status" onClick={safePlayClick}>
            <div className={cn("absolute top-1 right-1 h-2 w-2 rounded-full", templeStatus.colorClass, !templeStatus.colorClass.includes('red') && !templeStatus.colorClass.includes('gray') && "animate-ping opacity-75")} />
            <div className={cn("absolute top-1 right-1 h-2 w-2 rounded-full ring-1 ring-background", templeStatus.colorClass)} />
            <BellIcon className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-auto flex flex-col">
          <DrawerHeader className="text-left sr-only"><DrawerTitle>Status</DrawerTitle></DrawerHeader>
          {popoverContent}
          <DrawerFooter>
            <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 px-2.5 mr-2 flex items-center gap-2 text-xs font-semibold border-2 shadow-sm hover:shadow-md transition-all relative rounded-full",
            "bg-background/70 backdrop-blur-sm",
            {
              'border-green-500/50 text-green-700 dark:text-green-400': templeStatus.colorClass === 'bg-green-500',
              'border-pink-500/50 text-pink-700 dark:text-pink-400': templeStatus.colorClass === 'bg-pink-500',
              'border-yellow-500/50 text-yellow-600 dark:text-yellow-400': templeStatus.colorClass === 'bg-yellow-500',
              'border-red-500/50 text-red-700 dark:text-red-400': templeStatus.colorClass === 'bg-red-500',
              'border-gray-500/50 text-gray-600 dark:text-gray-400': templeStatus.colorClass === 'bg-gray-500',
            }
          )}
          aria-label="Temple Status"
          onClick={safePlayClick}
          onMouseEnter={safePlayHover}
        >
          <div className={cn("absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-background", templeStatus.colorClass, !templeStatus.colorClass.includes('red') && !templeStatus.colorClass.includes('gray') && "animate-ping opacity-75")} />
          <div className={cn("absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full", templeStatus.colorClass)} />
          <div className="flex items-center gap-1.5">
            <ClockIcon className={cn("w-4 h-4", {
              'text-green-600 dark:text-green-400': templeStatus.colorClass === 'bg-green-500',
              'text-pink-600 dark:text-pink-400': templeStatus.colorClass === 'bg-pink-500',
              'text-yellow-600 dark:text-yellow-400': templeStatus.colorClass === 'bg-yellow-500',
              'text-red-600 dark:text-red-400': templeStatus.colorClass === 'bg-red-500',
              'text-gray-500 dark:text-gray-400': templeStatus.colorClass === 'bg-gray-500',
            })} />
            <span className="text-xs xs:text-sm">
              {formatTime(templeStatus.nextEventTime, is24HourFormat)}
              {templeStatus.nextEventLabel && ` (${templeStatus.nextEventLabel})`}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-sm p-0 overflow-hidden" sideOffset={10} align="end">
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}
