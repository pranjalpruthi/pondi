export type DailyScheduleItem = {
  time: string; // e.g., "4:30 AM"
  activity: string;
  description?: string;
};

export const dailySchedule: DailyScheduleItem[] = [
  { time: '4:30 AM', activity: 'Mangal Aarati', description: 'Early morning worship' },
  { time: '7:15 AM', activity: 'Darshan Aarati', description: 'Morning darshan ceremony' },
  { time: '7:20 AM', activity: 'Guru Puja', description: 'Worship of Srila Prabhupada' },
  { time: '8:00 AM', activity: 'Bhagvatam Discourse', description: 'Morning scripture class' },
  { time: '12:00 PM', activity: 'Darshan Closes', description: 'Darshan of the Deities concludes for the morning. oopen; evening Darshan from 5:30 PM.' },
  { time: '5:30 PM', activity: 'Gaura Arati', description: 'Evening worship ceremony' },
  { time: '6:30 PM', activity: 'Darshan Closes', description: 'Darshan of the Deities concludes; temple may remain open for other activities.' }
];

// Enhanced schedule for status determination logic
export interface TempleStatusInfo {
  label: string; // Short status for badge, e.g., "Darshan Open"
  colorClass: string; // Tailwind CSS color class for the dot, e.g., "bg-green-500"
  detailedText: string; // More descriptive text for popover
  nextEventTime: string | null; // Time of the next upcoming event
  nextEventLabel: string | null; // Label of the next upcoming event
}

export const scheduleIntervals: Array<{ start: string; end: string; status: TempleStatusInfo }> = [
  {
    start: '00:00 AM', // Midnight
    end: '4:29 AM',
    status: { label: 'Closed', colorClass: 'bg-gray-500', detailedText: 'Temple is closed. Mangal Aarati at 4:30 AM.', nextEventTime: null, nextEventLabel: null },
  },
  {
    start: '4:30 AM',
    end: '7:14 AM', // Up to, but not including, 7:15 AM
    status: { label: 'Aarati', colorClass: 'bg-pink-500', detailedText: 'Mangal Aarati ongoing (4:30 AM - 7:15 AM).', nextEventTime: null, nextEventLabel: null },
  },
  {
    start: '7:15 AM',
    end: '11:59 AM',
    status: { label: 'Darshan', colorClass: 'bg-green-500', detailedText: 'Darshan is open. Activities: Darshan Aarati (7:15 AM), Guru Puja (7:20 AM), Bhagvatam Discourse (8:00 AM).', nextEventTime: null, nextEventLabel: null },
  },
  {
    start: '12:00 PM',
    end: '5:29 PM',
    status: { label: 'Darshan Closed', colorClass: 'bg-yellow-500', detailedText: 'Darshan is currently closed. Temple remains open. Evening Darshan (Gaura Aarati) at 5:30 PM.', nextEventTime: null, nextEventLabel: null },
  },
  {
    start: '5:30 PM',
    end: '6:29 PM',
    status: { label: 'Darshan', colorClass: 'bg-green-500', detailedText: 'Gaura Aarati / Darshan is open (5:30 PM - 6:30 PM).', nextEventTime: null, nextEventLabel: null },
  },
  {
    start: '6:30 PM',
    end: '11:59 PM', // Until just before midnight
    status: { label: 'Darshan Closed', colorClass: 'bg-red-500', detailedText: 'Darshan is closed for the day.', nextEventTime: null, nextEventLabel: null },
  },
];
