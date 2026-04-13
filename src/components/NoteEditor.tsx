import React from 'react';
import { ChevronLeft, Trash2, Pencil, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Note, ThemeStyles, FontSize } from '../types';
import { FONT_SIZES, LINE_HEIGHTS } from '../constants';

interface NoteEditorProps {
  currentNote: Note;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  setIsEditing: (editing: boolean) => void;
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
  setIsEditing,
  handleUpdateNote,
  handleDeleteNote,
  titleInputRef,
  currentThemeStyles,
  fontSize,
  paperStyle
}) => {
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
          onClick={() => setIsEditing(false)}
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
      
      <textarea
        placeholder="Fikrlaringizni shu yerga yozing..."
        value={currentNote.content}
        onChange={(e) => handleUpdateNote(currentNote.id, { content: e.target.value })}
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
    </motion.div>
  );
};
