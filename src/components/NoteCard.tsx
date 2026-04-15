import React from 'react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note, ThemeStyles } from '../types';
import { formatReminderTime } from '../utils';

interface NoteCardProps {
  note: Note;
  currentThemeStyles: ThemeStyles;
  onEdit: () => void;
  onToggleComplete: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  currentThemeStyles, 
  onEdit, 
  onToggleComplete
}) => {
  return (
    <div className="relative overflow-hidden rounded-sm group">
      <div 
        onClick={onEdit}
        className={`relative z-10 cursor-pointer border-2 p-4 rounded-sm h-28 flex flex-col transition-all hover:shadow-lg active:scale-[0.99] bg-white ${note.completed ? 'opacity-60' : ''}`}
        style={{ 
          backgroundColor: currentThemeStyles.bg,
          borderColor: note.completed ? `${currentThemeStyles.border}40` : `${currentThemeStyles.border}20`,
        }}
      >
        <div className="flex justify-between items-start gap-3">
          <h2 
            className={`text-lg font-bold mb-1 line-clamp-1 flex-1 ${note.completed ? 'line-through opacity-50' : ''}`}
          >
            {note.title || 'Sarlavhasiz'}
          </h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete();
              }}
              className="relative flex items-center justify-center p-1"
            >
            <AnimatePresence mode="wait" initial={false}>
              {note.completed ? (
                <motion.div
                  key="completed"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-green-500"
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="pending"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="opacity-20 hover:opacity-100 transition-opacity"
                >
                  <Circle size={24} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence initial={false}>
              {note.completed && (
                <motion.div 
                  key="ripple"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 border-2 border-green-500 rounded-full pointer-events-none"
                />
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1">
          <Clock size={10} />
          <span>{formatReminderTime(note.reminderAt)}</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          {(() => {
            const date = new Date(note.createdAt);
            return isNaN(date.getTime()) ? "Noma'lum" : date.toLocaleString('uz-UZ', { 
              day: 'numeric', 
              month: 'short'
            });
          })()}
        </div>
      </div>
    </div>
  </div>
);
};
