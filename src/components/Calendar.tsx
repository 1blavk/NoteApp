import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Note, ThemeStyles } from '../types';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  notes: Note[];
  currentThemeStyles: ThemeStyles;
  setFilterDate: (date: string | null) => void;
  setViewMode: (mode: 'Ro\'yxat' | 'Taqvim') => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  setCurrentMonth,
  notes,
  currentThemeStyles,
  setFilterDate,
  setViewMode
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div 
        key={`empty-${i}`} 
        className="h-12 sm:h-20 border-t border-l" 
        style={{ borderColor: `${currentThemeStyles.border}20` }}
      />
    );
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateString = date.toDateString();
    const dayNotes = notes.filter(n => new Date(n.updatedAt).toDateString() === dateString);
    
    days.push(
      <div 
        key={d} 
        className={`h-12 sm:h-20 border-t border-l flex flex-col p-1 sm:p-2 transition-colors hover:bg-black/5 cursor-pointer ${dayNotes.length > 0 ? 'font-bold' : 'opacity-40'}`}
        style={{ borderColor: `${currentThemeStyles.border}20` }}
        onClick={() => {
          if (dayNotes.length > 0) {
            setFilterDate(dateString);
            setViewMode('Ro\'yxat');
          }
        }}
      >
        <span className="text-xs">{d}</span>
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
        className="h-12 sm:h-20 border-t border-l" 
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
          <div key={day} className="h-10 flex items-center justify-center text-[10px] font-bold uppercase opacity-40 border-l border-t" style={{ borderColor: `${currentThemeStyles.border}20` }}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};
