'use client';

import { useState, useEffect, useRef } from 'react';

// --- CustomSelect Component ---

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  error = false,
  disabled = false,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-wrapper ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
      id={id}
    >
      <div
        className={`custom-select-trigger ${error ? 'input-error' : ''}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span className={!selectedOption ? 'select-placeholder' : 'select-value'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="custom-select-arrow"></span>
      </div>

      {isOpen && (
        <ul className="custom-select-options">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? 'is-selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- CustomDatePicker Component ---

interface CustomDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  minDate?: string; // "YYYY-MM-DD"
  error?: boolean;
  disabled?: boolean;
  lng: string;
  placeholder?: string;
  id?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  minDate = '',
  error = false,
  disabled = false,
  lng,
  placeholder = 'Select date...',
  id,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial state date or default to today
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Localized week days dynamically computed based on locale (Monday as first day)
  const weekDays = [];
  const baseDate = new Date(2026, 5, 1); // June 1, 2026 is Monday
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayName = d.toLocaleString(lng, { weekday: 'short' });
    // Capitalize first letter
    weekDays.push(dayName.charAt(0).toUpperCase() + dayName.slice(1));
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update calendar view when selected value changes externally
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentYear(parsed.getFullYear());
        setCurrentMonth(parsed.getMonth());
      }
    }
  }, [value]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const prevMonth = () => {
    // Prevent navigating to past if current view is already the minDate month
    if (minDate) {
      const minDateObj = new Date(minDate);
      if (
        currentYear < minDateObj.getFullYear() ||
        (currentYear === minDateObj.getFullYear() && currentMonth <= minDateObj.getMonth())
      ) {
        return;
      }
    }

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleDateClick = (day: number) => {
    const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Formatting date for trigger field display
  const getDisplayValue = () => {
    if (!value) return '';
    const dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) return value;
    // Format: DD.MM.YYYY
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}.${m}.${y}`;
  };

  // Month & Year header translation
  const getHeaderLabel = () => {
    const date = new Date(currentYear, currentMonth);
    const monthName = date.toLocaleString(lng, { month: 'long' });
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalized} ${currentYear}`;
  };

  // Grid calculations
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (() => {
    const day = new Date(currentYear, currentMonth, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon-indexed (0 = Mon, 6 = Sun)
  })();

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);

  const isDayDisabled = (day: number) => {
    if (!minDate) return false;
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return dateStr < minDate;
  };

  const isDaySelected = (day: number) => {
    if (!value) return false;
    const target = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return target === value;
  };

  const isDayToday = (day: number) => {
    const t = new Date();
    return (
      day === t.getDate() &&
      currentMonth === t.getMonth() &&
      currentYear === t.getFullYear()
    );
  };

  return (
    <div
      ref={containerRef}
      className={`custom-datepicker-wrapper ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
      id={id}
    >
      <div
        className={`custom-datepicker-trigger ${error ? 'input-error' : ''}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span className={!value ? 'select-placeholder' : 'select-value'}>
          {value ? getDisplayValue() : placeholder}
        </span>
        <span className="custom-datepicker-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </span>
      </div>

      {isOpen && (
        <>
          <div className="custom-datepicker-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="custom-datepicker-calendar">
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav-btn prev" onClick={prevMonth}>
              ‹
            </button>
            <span className="datepicker-current-month">{getHeaderLabel()}</span>
            <button type="button" className="datepicker-nav-btn next" onClick={nextMonth}>
              ›
            </button>
          </div>

          <div className="datepicker-weekdays">
            {weekDays.map((wd, index) => (
              <span key={index} className="datepicker-weekday">
                {wd}
              </span>
            ))}
          </div>

          <div className="datepicker-days">
            {emptySlots.map((slot) => (
              <span key={`empty-${slot}`} className="datepicker-day-empty"></span>
            ))}
            {daysArray.map((day) => {
              const disabledDay = isDayDisabled(day);
              const selected = isDaySelected(day);
              const isToday = isDayToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  className={`datepicker-day-btn ${selected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                  disabled={disabledDay}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
