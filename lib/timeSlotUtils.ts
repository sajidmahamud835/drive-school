import { addDays, isFriday, setHours, setMinutes, format } from 'date-fns';

/**
 * Check if a date is valid for booking (not Friday)
 */
export function isValidBookingDate(date: Date): boolean {
  return !isFriday(date);
}

/**
 * Get available time slots for a given date (7am - 11:59am)
 */
export function getAvailableTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  
  // Generate slots from 7:00 AM to 11:59 AM (every hour)
  for (let hour = 7; hour < 12; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    slots.push(timeString);
  }
  
  return slots;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

/**
 * Check if a time slot is within valid hours (7am - 11:59am)
 */
export function isValidTimeSlot(time: string): boolean {
  const [hours] = time.split(':');
  const hour = parseInt(hours, 10);
  return hour >= 7 && hour < 12;
}

/**
 * Get next available booking date (excluding Fridays)
 */
export function getNextAvailableDate(startDate: Date = new Date()): Date {
  let date = startDate;
  let attempts = 0;
  
  while (isFriday(date) && attempts < 7) {
    date = addDays(date, 1);
    attempts++;
  }
  
  return date;
}
