import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Note, ThemeStyles } from '../types';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  notes: Note[];
  currentThemeStyles: ThemeStyles;
  setFilterDate: (date: string | null) => void;
  setViewMode: (mode: 'Ro\'yxat' | 'Taqvim') => void;
  filterDate?: string | null;
}

const ScribbleMark: React.FC<{ color?: string }> = ({ color = '#2596be' }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="absolute -inset-2 w-[140%] h-[140%] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
    style={{ color }}
  >
    <motion.path
      d="M50,15 C28,15 15,35 15,50 C15,65 28,85 50,85 C72,85 85,65 85,50 C85,35 72,15 50,15 C35,15 20,30 20,55"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.8 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    <motion.path
      d="M55,20 C40,18 25,25 22,45 C19,65 30,80 50,82 C70,84 82,70 80,50 C78,30 65,22 55,25"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    />
  </svg>
);

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  setCurrentMonth,
  notes,
  currentThemeStyles,
  setFilterDate,
  setViewMode,
  filterDate
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toDateString();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div 
        key={`empty-${i}`} 
        className="h-16 sm:h-20 border-t border-l" 
        style={{ borderColor: `${currentThemeStyles.border}20` }}
      />
    );
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateString = date.toDateString();
    const isToday = dateString === today;
    const isSelected = filterDate === dateString;
    const dayNotes = notes.filter(n => {
      const noteDate = n.reminderAt ? new Date(n.reminderAt) : new Date(n.createdAt);
      return noteDate.toDateString() === dateString;
    });
    
    days.push(
      <div 
        key={d} 
        className={`h-16 sm:h-20 border-t border-l flex flex-col p-1.5 sm:p-2 transition-colors hover:bg-black/5 cursor-pointer ${dayNotes.length > 0 ? 'font-bold' : 'opacity-40'}`}
        style={{ borderColor: `${currentThemeStyles.border}20` }}
        onClick={() => {
          setFilterDate(dateString);
          if (dayNotes.length > 0) {
            setViewMode('Ro\'yxat');
          }
        }}
      >
        <div className="relative inline-flex items-center justify-center w-6 h-6">
          {dayNotes.length > 0 && (isToday || isSelected) && d > 0 && (
            <ScribbleMark color={isToday ? '#00c67b' : '#ffffff'} />
          )}
          <span className="text-sm sm:text-xs relative z-10">{d}</span>
        </div>
        {dayNotes.length > 0 && (
          <div className="mt-auto flex gap-1 flex-wrap">
            {dayNotes.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />
            ))}
            {dayNotes.length > 3 && <span className="text-[8px]">+{dayNotes.length - 3}</span>}
          </div>
        )}
      </div>
    );
  }
  
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let i = firstDay + daysInMonth; i < totalCells; i++) {
    days.push(
      <div 
        key={`empty-end-${i}`} 
        className="h-16 sm:h-20 border-t border-l" 
        style={{ borderColor: `${currentThemeStyles.border}20` }}
      />
    );
  }
  
  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest">
          {currentMonth.toLocaleDateString('uz-UZ', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())} {currentMonth.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(new Date(year, month - 1))}
            className="p-2 border-2 rounded-sm"
            style={{ borderColor: currentThemeStyles.border }}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(year, month + 1))}
            className="p-2 border-2 rounded-sm"
            style={{ borderColor: currentThemeStyles.border }}
          >
            <ChevronLeft size={18} className="rotate-180" />
          </button>
        </div>
      </div>
      
      <div 
        className="grid grid-cols-7 border-r border-b"
        style={{ borderColor: `${currentThemeStyles.border}20` }}
      >
        {['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha'].map(day => (
          <div key={day} className="h-12 flex items-center justify-center text-[10px] font-bold uppercase opacity-40 border-l border-t" style={{ borderColor: `${currentThemeStyles.border}20` }}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};
