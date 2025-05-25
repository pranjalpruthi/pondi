import { useState, useEffect } from 'react';
import { scheduleIntervals, dailySchedule, type TempleStatusInfo, type DailyScheduleItem } from '@/data/temple-schedule';

const DEFAULT_STATUS: TempleStatusInfo = {
  label: 'Loading...',
  colorClass: 'bg-gray-400',
  detailedText: 'Fetching current temple status...',
  nextEventTime: null,
  nextEventLabel: null,
};

const PONDICHERRY_TIMEZONE = 'Asia/Kolkata';

/**
 * Converts a time string (e.g., "4:30 AM", "11:59 PM") to minutes since midnight.
 * @param timeStr The time string to convert.
 * @returns The number of minutes since midnight.
 */
const timeToMinutes = (timeStr: string): number => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) { // Midnight case
    hours = 0;
  }
  return hours * 60 + minutes;
};

/**
 * Finds the next upcoming event from the daily schedule.
 * @param currentTimeInMinutes The current time in minutes since midnight.
 * @returns The next DailyScheduleItem or null if no future events today.
 */
const findNextEvent = (currentTimeInMinutes: number): DailyScheduleItem | null => {
  // Filter out events that have already passed today
  const upcomingEvents = dailySchedule.filter(event => {
    const eventMinutes = timeToMinutes(event.time);
    return eventMinutes > currentTimeInMinutes;
  });

  // If there are upcoming events, return the first one
  if (upcomingEvents.length > 0) {
    return upcomingEvents[0];
  }

  // If no upcoming events today, return the first event of the next day (e.g., Mangal Aarati)
  // This assumes the schedule repeats daily.
  if (dailySchedule.length > 0) {
    return dailySchedule[0];
  }

  return null;
};

/**
 * Custom hook to determine the current temple status based on the daily schedule
 * for Pondicherry time.
 * @returns {TempleStatusInfo & { nextEventTime: string | null; nextEventLabel: string | null }} The current status of the temple and the next event.
 */
export function useTempleStatus(): TempleStatusInfo & { nextEventTime: string | null; nextEventLabel: string | null } {
  const [currentStatus, setCurrentStatus] = useState<TempleStatusInfo & { nextEventTime: string | null; nextEventLabel: string | null }>(DEFAULT_STATUS);

  useEffect(() => {
    const updateStatus = () => {
      try {
        const nowPondicherry = new Date();
        // Get current hours and minutes in Pondicherry timezone
        const currentHoursPondicherry = parseInt(
          nowPondicherry.toLocaleTimeString('en-US', {
            timeZone: PONDICHERRY_TIMEZONE,
            hour12: false, // Use 24-hour format for easier parsing
            hour: '2-digit',
          }),
          10
        );
        const currentMinutesPondicherry = parseInt(
          nowPondicherry.toLocaleTimeString('en-US', {
            timeZone: PONDICHERRY_TIMEZONE,
            minute: '2-digit',
          }),
          10
        );
        
        const currentTimeInMinutes = currentHoursPondicherry * 60 + currentMinutesPondicherry;

        let activeStatus: TempleStatusInfo | null = null;

        for (const interval of scheduleIntervals) {
          const startMinutes = timeToMinutes(interval.start);
          const endMinutes = timeToMinutes(interval.end);

          // Handle overnight intervals (e.g. 10:00 PM to 2:00 AM) - not strictly needed for current schedule but good practice
          if (startMinutes > endMinutes) { // Interval crosses midnight
            if (currentTimeInMinutes >= startMinutes || currentTimeInMinutes <= endMinutes) {
              activeStatus = interval.status;
              break;
            }
          } else { // Interval within the same day
            if (currentTimeInMinutes >= startMinutes && currentTimeInMinutes <= endMinutes) {
              activeStatus = interval.status;
              break;
            }
          }
        }
        
        const nextEvent = findNextEvent(currentTimeInMinutes);

        setCurrentStatus({ 
          ...(activeStatus || { 
            label: 'N/A', 
            colorClass: 'bg-yellow-500', 
            detailedText: 'Current temple status is temporarily unavailable. Please check back later.' 
          }),
          nextEventTime: nextEvent ? nextEvent.time : null,
          nextEventLabel: nextEvent ? nextEvent.activity : null,
        });

      } catch (error) {
        console.error("Error updating temple status:", error);
        setCurrentStatus({ 
          label: 'Error', 
          colorClass: 'bg-orange-500', 
          detailedText: 'Could not determine temple status due to an error.',
          nextEventTime: null,
          nextEventLabel: null,
        });
      }
    };

    updateStatus(); // Initial update
    const intervalId = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return currentStatus;
}
