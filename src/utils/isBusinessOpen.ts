const TIMEZONE = 'America/Los_Angeles';

type HoursRange = { open: number; close: number };

const HOURS: Record<number, HoursRange> = {
  0: { open: 8, close: 21 }, // Sunday
  1: { open: 8, close: 20 }, // Monday
  2: { open: 8, close: 20 },
  3: { open: 8, close: 20 },
  4: { open: 8, close: 20 }, // Thursday
  5: { open: 8, close: 21 }, // Friday
  6: { open: 8, close: 21 }, // Saturday
};

export function isBusinessOpen(now?: Date): boolean {
  const date = now ?? new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(date);
  const weekdayPart = parts.find((p) => p.type === 'weekday');
  const hourPart = parts.find((p) => p.type === 'hour');
  const minutePart = parts.find((p) => p.type === 'minute');

  if (!weekdayPart || !hourPart || !minutePart) return false;

  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const day = dayMap[weekdayPart.value];
  if (day === undefined) return false;

  const hour = parseInt(hourPart.value, 10);
  const minute = parseInt(minutePart.value, 10);
  const currentMinutes = hour * 60 + minute;

  const range = HOURS[day];
  if (!range) return false;

  const openMinutes = range.open * 60;
  const closeMinutes = range.close * 60;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function getBusinessHoursDisplay(): string {
  return 'Mon–Thu: 8:00 AM – 8:00 PM\nFri–Sun: 8:00 AM – 9:00 PM';
}
