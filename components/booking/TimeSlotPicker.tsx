'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isFriday, startOfDay } from 'date-fns';
import Button from '../ui/Button';
import { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  availableSlots?: TimeSlot[];
}

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  availableSlots,
}: TimeSlotPickerProps) {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate next 30 days, excluding Fridays
    const dateList: Date[] = [];
    let currentDate = new Date();
    let count = 0;
    
    while (count < 30) {
      if (!isFriday(currentDate)) {
        dateList.push(new Date(currentDate));
        count++;
      }
      currentDate = addDays(currentDate, 1);
    }
    setDates(dateList);
  }, []);

  // Generate time slots from 7:00 AM to 11:59 AM (30-minute intervals)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 7; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isSlotAvailable = (time: string): boolean => {
    if (!availableSlots) return true;
    const slot = availableSlots.find((s) => s.time === time);
    return slot ? slot.available : true;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
      
      {/* Date Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {dates.map((date) => {
            const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateSelect(date)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-400 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                <div className="text-lg font-bold">{format(date, 'd')}</div>
                <div className="text-xs text-gray-500">{format(date, 'MMM')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Time (7:00 AM - 11:59 AM)</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map((time) => {
              const available = isSlotAvailable(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => available && onTimeSelect(time)}
                  disabled={!available}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    !available
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
