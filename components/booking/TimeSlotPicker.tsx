'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isFriday } from 'date-fns';
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
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
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

  const formatDateBangla = (date: Date) => {
    const day = dayNames[date.getDay()];
    const month = monthNames[date.getMonth()];
    return { day, month, date: date.getDate() };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
        তারিখ ও সময় নির্বাচন করুন
      </h2>
      
      {/* Date Selection */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-6 text-gray-800">তারিখ নির্বাচন করুন</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {dates.map((date) => {
            const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const { day, month, date: dayNum } = formatDateBangla(date);
            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateSelect(date)}
                className={`p-4 rounded-xl border-2 transition-all font-medium ${
                  isSelected
                    ? 'border-tinder bg-tinder/10 text-tinder shadow-tinder'
                    : 'border-gray-300 hover:border-tinder text-gray-700 hover:bg-pink-50'
                }`}
              >
                <div className="text-base font-bold mb-1">{day}</div>
                <div className="text-2xl font-bold mb-1">{dayNum}</div>
                <div className="text-xs text-gray-600">{month}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            সময় নির্বাচন করুন (সকাল ৭টা - ১১টা ৫৯ মিনিট)
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {timeSlots.map((time) => {
              const available = isSlotAvailable(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => available && onTimeSelect(time)}
                  disabled={!available}
                  className={`p-4 rounded-xl border-2 transition-all font-bold text-lg ${
                    !available
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'border-tinder bg-tinder text-white shadow-tinder'
                      : 'border-gray-300 hover:border-tinder text-gray-700 hover:bg-pink-50'
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
