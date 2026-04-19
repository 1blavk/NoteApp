import React, { useState } from 'react';
import { ChevronLeft, Trash2, Pencil, Save, Bell, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Picker from 'react-mobile-picker';
import { Note, ThemeStyles, FontSize } from '../types';
import { FONT_SIZES, LINE_HEIGHTS } from '../constants';
import { formatReminderTime } from '../utils';

interface NoteEditorProps {
  currentNote: Note;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onBack: () => void;
  handleUpdateNote: (id: string, updates: Partial<Note>) => void;
  handleDeleteNote: (id: string) => void;
  titleInputRef: React.RefObject<HTMLInputElement>;
  currentThemeStyles: ThemeStyles;
  fontSize: FontSize;
  paperStyle: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  currentNote,
  isLocked,
  setIsLocked,
  onBack,
  handleUpdateNote,
  handleDeleteNote,
  titleInputRef,
  currentThemeStyles,
  fontSize,
  paperStyle
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isListMode, setIsListMode] = useState(false);

  // Generate picker options
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    let label = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
    const dateStr = d.toDateString();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateStr === today.toDateString()) {
      label = 'Bugun';
    } else if (dateStr === tomorrow.toDateString()) {
      label = 'Ertaga';
    }

    return {
      label,
      value: dateStr
    };
  });

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '10', '20', '30', '40', '50'];

  const [pickerValue, setPickerValue] = useState(() => {
    const date = currentNote.reminderAt ? new Date(currentNote.reminderAt) : new Date();
    const roundedMinutes = Math.round(date.getMinutes() / 10) * 10;
    const finalMinutes = roundedMinutes === 60 ? 50 : roundedMinutes; // Keep it within 0-50
    
    return {
      day: date.toDateString(),
      hour: date.getHours().toString().padStart(2, '0'),
      minute: finalMinutes.toString().padStart(2, '0')
    };
  });

  const handlePickerChange = (newValue: any) => {
    setPickerValue(newValue);
    const date = new Date(newValue.day);
    date.setHours(parseInt(newValue.hour));
    date.setMinutes(parseInt(newValue.minute));
    
    if (date.getTime() < Date.now()) {
      // If past time, don't update the note's reminderAt
      // Optionally we could reset to current time, but for now just skip update
      return;
    }
    
    handleUpdateNote(currentNote.id, { reminderAt: date.getTime() });
  };

  const now = new Date();
  const todayStr = now.toDateString();
  const currentHourStr = now.getHours().toString().padStart(2, '0');
  const currentMinuteStr = (Math.round(now.getMinutes() / 10) * 10 % 60).toString().padStart(2, '0');

  const getPaperStyle = (size: FontSize = 'O\'rta') => {
    if (paperStyle === 'Oddiy') return {};
    
    const lh = LINE_HEIGHTS[size];
    const color = `${currentThemeStyles.text}15`;
    
    if (paperStyle === 'Chiziqli') {
      return {
        backgroundImage: `linear-gradient(transparent calc(${lh} - 1px), ${color} ${lh})`,
        backgroundSize: `100% ${lh}`,
        lineHeight: lh,
        paddingTop: `calc(${lh} / 2)`,
        backgroundPosition: `0 calc(${lh} / 2)`,
        backgroundAttachment: 'local'
      };
    }
    
    if (paperStyle === 'Katakli') {
      return {
        backgroundImage: `linear-gradient(transparent calc(${lh} - 1px), ${color} ${lh}), linear-gradient(90deg, transparent calc(${lh} - 1px), ${color} ${lh})`,
        backgroundSize: `${lh} ${lh}`,
        lineHeight: lh,
        paddingTop: `calc(${lh} / 2)`,
        backgroundPosition: `0 calc(${lh} / 2)`,
        backgroundAttachment: 'local'
      };
    }
    
    return {};
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLocked) return;
    
    if (isListMode && e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.currentTarget;
      const newValue = value.substring(0, selectionStart) + '\n • ' + value.substring(selectionEnd);
      handleUpdateNote(currentNote.id, { content: newValue });
      
      // Set cursor position after the bullet
      setTimeout(() => {
        const target = e.target as HTMLTextAreaElement;
        if (target) {
          target.selectionStart = target.selectionEnd = selectionStart + 4;
        }
      }, 0);
    }
  };

  const toggleListMode = () => {
    const newMode = !isListMode;
    setIsListMode(newMode);
    if (newMode && !currentNote.content.trim()) {
      handleUpdateNote(currentNote.id, { content: ' • ' });
    }
  };

  return (
    <motion.div 
      key="editor"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 pb-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:opacity-70"
        >
          <ChevronLeft size={24} />
        </button>
        <input
          ref={titleInputRef}
          type="text"
          autoFocus
          enterKeyHint="next"
          placeholder="Sarlavha..."
          value={currentNote.title}
          onChange={(e) => handleUpdateNote(currentNote.id, { title: e.target.value })}
          className="flex-1 bg-transparent text-2xl font-bold focus:outline-none placeholder:opacity-30"
          readOnly={isLocked}
        />
      </div>

      <div className="px-4 mb-4 flex items-center gap-2">
        <button
          onClick={() => !isLocked && setShowPicker(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${isLocked ? 'opacity-40' : 'hover:bg-black/5'}`}
          style={{ borderColor: `${currentThemeStyles.border}20` }}
        >
          <Bell size={14} />
          <span>{formatReminderTime(currentNote.reminderAt)}</span>
        </button>

        <button
          onClick={() => !isLocked && toggleListMode()}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${isLocked ? 'opacity-40' : ''} ${isListMode ? '' : 'hover:bg-black/5'}`}
          style={{ 
            borderColor: `${currentThemeStyles.border}20`,
            backgroundColor: isListMode ? currentThemeStyles.text : 'transparent',
            color: isListMode ? currentThemeStyles.bg : 'inherit'
          }}
        >
          <List size={14} />
          <span>Ro'yxat</span>
        </button>
      </div>
      
      <textarea
        placeholder="Fikr, maqsad, qilish kerak bo'lgan ishlaringizni shu yerga yozing..."
        value={currentNote.content}
        onChange={(e) => handleUpdateNote(currentNote.id, { content: e.target.value })}
        onKeyDown={handleKeyDown}
        className={`flex-1 bg-transparent resize-none focus:outline-none placeholder:opacity-30 px-4 pb-4 ${FONT_SIZES[fontSize]}`}
        readOnly={isLocked}
        style={getPaperStyle(fontSize)}
      />
      
      <div className="mt-6 flex justify-end gap-4">
        <button 
          onClick={() => handleDeleteNote(currentNote.id)}
          className="flex items-center gap-2 px-4 py-2 border-2 rounded-sm hover:bg-red-500 hover:text-white transition-all"
          style={{ borderColor: currentThemeStyles.border }}
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">O'chirish</span>
        </button>
        {isLocked ? (
          <button 
            onClick={() => setIsLocked(false)}
            className="flex items-center gap-2 px-6 py-2 border-2 rounded-sm font-bold transition-all"
            style={{ 
              borderColor: currentThemeStyles.border,
              backgroundColor: currentThemeStyles.text,
              color: currentThemeStyles.bg
            }}
          >
            <Pencil size={18} />
            <span>Tahrirlash</span>
          </button>
        ) : (
          <button 
            onClick={() => setIsLocked(true)}
            className="flex items-center gap-2 px-6 py-2 border-2 rounded-sm font-bold transition-all"
            style={{ 
              borderColor: currentThemeStyles.border,
              backgroundColor: currentThemeStyles.text,
              color: currentThemeStyles.bg
            }}
          >
            <Save size={18} />
            <span>Saqlash</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-2xl p-6 rounded-t-2xl shadow-2xl border-t-2"
              style={{ 
                backgroundColor: currentThemeStyles.bg,
                color: currentThemeStyles.text,
                borderColor: currentThemeStyles.border
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-widest">Vaqtni belgilash</h3>
                  {(() => {
                    const date = new Date(pickerValue.day);
                    date.setHours(parseInt(pickerValue.hour));
                    date.setMinutes(parseInt(pickerValue.minute));
                    if (date.getTime() < Date.now()) {
                      return <p className="text-[10px] text-red-500 font-bold uppercase">Vaqt o'tib ketgan!</p>;
                    }
                    return null;
                  })()}
                </div>
                <button 
                  onClick={() => {
                    const date = new Date(pickerValue.day);
                    date.setHours(parseInt(pickerValue.hour));
                    date.setMinutes(parseInt(pickerValue.minute));
                    
                    if (date.getTime() < Date.now()) {
                      const now = new Date();
                      const resetValue = {
                        day: now.toDateString(),
                        hour: now.getHours().toString().padStart(2, '0'),
                        minute: now.getMinutes().toString().padStart(2, '0')
                      };
                      setPickerValue(resetValue);
                      handleUpdateNote(currentNote.id, { reminderAt: now.getTime() });
                    }
                    setShowPicker(false);
                  }}
                  className="p-2 border-2 rounded-sm font-bold"
                  style={{ borderColor: currentThemeStyles.border }}
                >
                  Tayyor
                </button>
              </div>

              <div className="h-48">
                <Picker itemHeight={60} value={pickerValue}  onChange={handlePickerChange} wheelMode="natural">
                  {/* @ts-ignore */}
                  <Picker.Column name="day">
                    {days.map(day => (
                      <Picker.Item key={day.value} value={day.value}>
                        <div className={day.value === todayStr ? 'font-black scale-110' : ''}>
                          {day.label}
                        </div>
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                  {/* @ts-ignore */}
                  <Picker.Column name="hour">
                    {hours.map(hour => (
                      <Picker.Item key={hour} value={hour}>
                        <div className={hour === currentHourStr ? 'font-black scale-110' : ''}>
                          {hour}
                        </div>
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                  {/* @ts-ignore */}
                  <Picker.Column name="minute">
                    {minutes.map(minute => (
                      <Picker.Item key={minute} value={minute}>
                        <div className={minute === currentMinuteStr ? 'font-black scale-110' : ''}>
                          {minute === '00' ? minute : `${minute} daq`}
                        </div>
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                </Picker>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
