'use client';

import { useState, useEffect } from 'react';
import { format, isFriday, isBefore, startOfDay } from 'date-fns';
import Calendar from 'react-calendar';
import { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  availableSlots?: TimeSlot[];
}

const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শনি', 'রবি'];
const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  availableSlots,
}: TimeSlotPickerProps) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [loadingDates, setLoadingDates] = useState(true);

  // Fetch available dates on mount
  useEffect(() => {
    fetchAvailableDates();
  }, []);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    setLoadingDates(true);
    try {
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      
      const response = await fetch(`/api/booking/available-dates?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (data.success) {
        setAvailableDates(new Set(data.availableDates || []));
        setUnavailableDates(new Set(data.unavailableDates || []));
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/booking/slots?date=${dateStr}`);
      const data = await response.json();

      if (data.success && data.slots) {
        setAvailableTimeSlots(data.slots);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateTimeSlots = (): string[] => {
    if (availableTimeSlots.length > 0) {
      return availableTimeSlots.map(slot => slot.time);
    }
    const slots: string[] = [];
    for (let hour = 7; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isSlotAvailable = (time: string): boolean => {
    if (availableTimeSlots.length > 0) {
      const slot = availableTimeSlots.find((s) => s.time === time);
      return slot ? slot.available : false;
    }
    if (availableSlots) {
      const slot = availableSlots.find((s) => s.time === time);
      return slot ? slot.available : true;
    }
    return true;
  };

  // Check if a date is available for booking
  const isDateAvailable = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Past dates are not available
    if (isBefore(date, startOfDay(new Date()))) {
      return false;
    }
    
    // Fridays are not available
    if (isFriday(date)) {
      return false;
    }
    
    // If we have loaded dates, check if it's in unavailable set
    // Otherwise, allow it (will be checked when slots are fetched)
    if (unavailableDates.size > 0 && unavailableDates.has(dateKey)) {
      return false;
    }
    
    // If available dates are loaded and this date is in the set, it's available
    if (availableDates.size > 0) {
      return availableDates.has(dateKey);
    }
    
    // If dates haven't loaded yet, allow non-Friday future dates
    return true;
  };

  // Custom tile content for calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      
      // Past dates
      if (isBefore(date, startOfDay(new Date()))) {
        return 'calendar-past-date';
      }
      
      // Fridays
      if (isFriday(date)) {
        return 'calendar-friday';
      }
      
      // Available dates
      if (availableDates.has(dateKey)) {
        return 'calendar-available';
      }
      
      // Unavailable dates
      if (unavailableDates.has(dateKey)) {
        return 'calendar-unavailable';
      }
      
      // Default (future dates not yet checked) - treat as available
      if (!unavailableDates.has(dateKey)) {
        return 'calendar-available';
      }
      return 'calendar-default';
    }
    return '';
  };

  // Disable dates that are not available
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      return !isDateAvailable(date);
    }
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
        তারিখ ও সময় নির্বাচন করুন
      </h2>
      
      {/* Calendar Selection */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-6 text-gray-800">তারিখ নির্বাচন করুন</h3>
        
        {loadingDates && (
          <div className="text-center py-8 text-gray-600 font-medium">
            তারিখ লোড হচ্ছে...
          </div>
        )}
        
        <div className="flex justify-center">
          <div className="calendar-wrapper">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  onDateSelect(value);
                }
              }}
              value={selectedDate}
              minDate={new Date()}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              locale="bn-BD"
              className="custom-calendar"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border-2 border-green-400"></div>
            <span className="text-gray-700 font-medium">উপলব্ধ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400"></div>
            <span className="text-gray-700 font-medium">অপেক্ষমাণ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border-2 border-red-400"></div>
            <span className="text-gray-700 font-medium">শুক্রবার/অপলব্ধ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-200 border-2 border-blue-400"></div>
            <span className="text-gray-700 font-medium">নির্বাচিত</span>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="time-selection-wrapper">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            সময় নির্বাচন করুন (সকাল ৭টা - ১১টা ৫৯ মিনিট)
          </h3>
          {loadingSlots && (
            <div className="mb-4 text-center text-gray-600 font-medium">স্লট লোড হচ্ছে...</div>
          )}
          <div className="time-slots-grid">
            {timeSlots.map((time) => {
              const available = isSlotAvailable(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => available && onTimeSelect(time)}
                  disabled={!available}
                  className={`time-slot-button ${
                    !available
                      ? 'time-slot-unavailable'
                      : isSelected
                      ? 'time-slot-selected'
                      : 'time-slot-available'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
          {timeSlots.length === 0 && !loadingSlots && (
            <div className="text-center py-8 text-red-600 font-medium">
              এই তারিখে কোনো স্লট উপলব্ধ নেই
            </div>
          )}
        </div>
      )}
      
      <style jsx global>{`
        .calendar-wrapper {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .custom-calendar {
          width: 100%;
          max-width: 500px;
          border: none;
          font-family: inherit;
        }
        
        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }
        
        .custom-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          font-weight: bold;
          color: #E91E63;
        }
        
        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #fce4ec;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #666;
        }
        
        .custom-calendar .react-calendar__month-view__days__day {
          padding: 8px;
        }
        
        .custom-calendar .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6px;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #fce4ec;
          transform: scale(1.05);
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: #E91E63 !important;
          color: white !important;
          font-weight: bold;
        }
        
        .custom-calendar .react-calendar__tile--now {
          background: #fff3e0;
          font-weight: bold;
        }
        
        .custom-calendar .calendar-available {
          background: #c8e6c9;
          border: 2px solid #4caf50;
          color: #2e7d32;
          font-weight: bold;
        }
        
        .custom-calendar .calendar-unavailable {
          background: #ffcdd2;
          border: 2px solid #f44336;
          color: #c62828;
          opacity: 0.6;
        }
        
        .custom-calendar .calendar-friday {
          background: #ffcdd2;
          border: 2px solid #f44336;
          color: #c62828;
          opacity: 0.6;
        }
        
        .custom-calendar .calendar-past-date {
          background: #e0e0e0;
          color: #9e9e9e;
          opacity: 0.5;
        }
        
        .custom-calendar .react-calendar__tile:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        /* Time Selection Styling - Matching Calendar */
        .time-selection-wrapper {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }
        
        .time-slot-button {
          padding: 16px 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          transition: all 0.2s;
          border: 2px solid;
          cursor: pointer;
        }
        
        .time-slot-available {
          background: #c8e6c9;
          border-color: #4caf50;
          color: #2e7d32;
        }
        
        .time-slot-available:hover {
          background: #a5d6a7;
          border-color: #388e3c;
          transform: scale(1.05);
        }
        
        .time-slot-selected {
          background: #E91E63 !important;
          border-color: #E91E63 !important;
          color: white !important;
          box-shadow: 0 4px 20px rgba(233, 30, 99, 0.3);
        }
        
        .time-slot-unavailable {
          background: #e0e0e0;
          border-color: #9e9e9e;
          color: #9e9e9e;
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
