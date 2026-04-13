/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Settings, 
  Type, 
  Palette, 
  Clock, 
  Pencil,
  Save,
  X,
  Calendar as CalendarIcon,
  LayoutGrid,
  List as ListIcon,
  Menu,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Theme = 'Klassik' | 'Zamonaviy' | 'Tungi';
type FontSize = 'Kichik' | 'O\'rta' | 'Katta';
type PaperStyle = 'Oddiy' | 'Chiziqli' | 'Katakli';
type ViewMode = 'Ro\'yxat' | 'Taqvim';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

// --- Constants ---

const THEMES: Record<Theme, { bg: string; text: string; accent: string; border: string }> = {
  'Klassik': { bg: '#FFFFFF', text: '#000000', accent: '#000000', border: '#000000' },
  'Zamonaviy': { bg: '#F5F5F5', text: '#333333', accent: '#666666', border: '#333333' },
  'Tungi': { bg: '#222222', text: '#FFFFFF', accent: '#FFFFFF', border: '#FFFFFF' },
};

const BACKGROUND_IMAGES = [
  { id: 'none', name: 'Yo\'q', url: '' },
  { id: 'night', name: 'Tun', url: 'https://i.pinimg.com/736x/cc/88/81/cc88817498df297e574323427a7c4430.jpg' },
  { id: 'forest', name: "O'rmon", url: 'https://i.pinimg.com/736x/14/85/1d/14851d161855fc11e842fd392dc6340b.jpg' },
  { id: 'mountains', name: 'Tog\'lar', url: 'https://i.pinimg.com/1200x/8d/82/c4/8d82c4f2233a0c4b39feaa299f00e111.jpg' },
];

const FONT_SIZES: Record<FontSize, string> = {
  'Kichik': 'text-sm',
  'O\'rta': 'text-base',
  'Katta': 'text-xl',
};

const LINE_HEIGHTS: Record<FontSize, string> = {
  'Kichik': '1.5rem',
  'O\'rta': '2rem',
  'Katta': '2.5rem',
};

// --- Utils ---

const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min o'qish`;
};

// --- Components ---

interface NoteCardProps {
  note: Note;
  currentThemeStyles: any;
  getPaperStyle: (size?: FontSize) => React.CSSProperties;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  currentThemeStyles, 
  getPaperStyle, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="relative overflow-hidden rounded-sm group touch-pan-y">
      {/* Swipe Backgrounds */}
      <div className="absolute inset-0 flex items-center justify-between px-6 opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-[10px] tracking-widest">
          <Pencil size={16} />
          <span>Tahrirlash</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
          <span>O'chirish</span>
          <Trash2 size={16} />
        </div>
      </div>

      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80) {
            onEdit();
          } else if (info.offset.x < -80) {
            onDelete();
          }
        }}
        onClick={onEdit}
        className="relative z-10 cursor-pointer border-2 p-4 rounded-sm h-28 flex flex-col transition-shadow hover:shadow-lg active:scale-[0.99] bg-white"
        style={{ 
          backgroundColor: currentThemeStyles.bg,
          borderColor: `${currentThemeStyles.border}20`,
          willChange: 'transform'
        }}
      >
        <h2 className="text-lg font-bold mb-1 line-clamp-1">
          {note.title || 'Sarlavhasiz'}
        </h2>
        <div className="mt-auto text-xs font-bold uppercase tracking-widest opacity-40">
          {new Date(note.updatedAt).toLocaleString('uz-UZ', { 
            day: 'numeric', 
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  // State
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('qaydlar_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('qaydlar_theme') as Theme;
    return (saved && THEMES[saved]) ? saved : 'Klassik';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('qaydlar_font_size') as FontSize) || 'O\'rta');
  const [showSettings, setShowSettings] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>(() => (localStorage.getItem('qaydlar_paper_style') as PaperStyle) || 'Oddiy');
  const [bgImage, setBgImage] = useState<string>(() => localStorage.getItem('qaydlar_bg_image') || '');
  const [viewMode, setViewMode] = useState<ViewMode>('Ro\'yxat');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Persistence
  useEffect(() => {
    localStorage.setItem('qaydlar_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('qaydlar_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('qaydlar_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('qaydlar_paper_style', paperStyle);
  }, [paperStyle]);

  useEffect(() => {
    localStorage.setItem('qaydlar_bg_image', bgImage);
  }, [bgImage]);

  // Derived State
  const currentNote = useMemo(() => notes.find(n => n.id === currentNoteId), [notes, currentNoteId]);
  
  const filteredNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  const readingTime = useMemo(() => {
    if (!currentNote) return '0 min o\'qish';
    return calculateReadingTime(currentNote.content);
  }, [currentNote]);

  // Handlers
  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNoteId(newNote.id);
    setIsEditing(true);
    setIsLocked(false);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDeleteId(id);
  };

  const confirmDelete = () => {
    if (noteToDeleteId) {
      setNotes(notes.filter(n => n.id !== noteToDeleteId));
      if (currentNoteId === noteToDeleteId) {
        setCurrentNoteId(null);
        setIsEditing(false);
      }
      setNoteToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setNoteToDeleteId(null);
  };

  const currentThemeStyles = THEMES[theme];

  const getPaperStyle = (size: FontSize = 'O\'rta') => {
    if (paperStyle === 'Oddiy') return {};
    
    const lh = LINE_HEIGHTS[size];
    const color = `${currentThemeStyles.text}15`; // 15 is hex for ~8% opacity
    
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

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Adjust for Monday start if needed, but standard is Sunday (0)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 sm:h-20" />);
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
    
    return (
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest">
            {currentMonth.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
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

  return (
    <div 
      className="min-h-screen transition-colors duration-500 flex flex-col items-center overflow-x-hidden relative"
      style={{ 
        backgroundColor: currentThemeStyles.bg, 
        color: currentThemeStyles.text,
      }}
    >
      {/* Background Image Overlay */}
      {bgImage && (
        <div 
          className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Main Container */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative z-10 px-4 py-6 md:px-8">
        
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-8">
          {isEditing ? (
            <div className="flex items-center gap-2 opacity-60 text-xs font-medium uppercase tracking-widest">
              <Clock size={14} />
              <span>{readingTime}</span>
            </div>
          ) : (
            <div />
          )}
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Menyu"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {isEditing && currentNote ? (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 -ml-2 hover:opacity-70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <input
                    type="text"
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
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-bold tracking-tighter">Qaydlar</h1>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode(viewMode === 'Ro\'yxat' ? 'Taqvim' : 'Ro\'yxat')}
                      className="p-3 rounded-full border-2 hover:scale-110 transition-transform"
                      style={{ borderColor: currentThemeStyles.border }}
                      title={viewMode === 'Ro\'yxat' ? 'Taqvim ko\'rinishi' : 'Ro\'yxat ko\'rinishi'}
                    >
                      {viewMode === 'Ro\'yxat' ? <CalendarIcon size={24} /> : <ListIcon size={24} />}
                    </button>
                    <button 
                      onClick={handleCreateNote}
                      className="p-3 rounded-full border-2 hover:scale-110 transition-transform"
                      style={{ borderColor: currentThemeStyles.border }}
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>

                {viewMode === 'Taqvim' ? (
                  renderCalendar()
                ) : (
                  <>
                    {/* Notes List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredNotes.length > 0 ? (
                        filteredNotes.map(note => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            currentThemeStyles={currentThemeStyles}
                            getPaperStyle={getPaperStyle}
                            onEdit={() => {
                              setCurrentNoteId(note.id);
                              setIsEditing(true);
                              setIsLocked(true);
                            }}
                            onDelete={() => handleDeleteNote(note.id)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30 text-center">
                          <Plus size={48} className="mb-4" />
                          <p>Hozircha hech qanday qayd yo'q</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Hamburger Menu (Settings Drawer) */}
        <AnimatePresence>
          {showSettings && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-[280px] p-8 flex flex-col shadow-2xl"
                style={{ 
                  backgroundColor: currentThemeStyles.bg,
                  color: currentThemeStyles.text,
                  borderLeft: `2px solid ${currentThemeStyles.border}20`
                }}
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-xl font-bold uppercase tracking-[0.2em]">Menyu</h3>
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:rotate-90 transition-transform">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-10">
                  {/* Font Size */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                      <Type size={14} />
                      <span>Shrift o'lchami</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(FONT_SIZES) as FontSize[]).map(size => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`w-full py-3 px-4 text-left border-2 rounded-sm transition-all flex justify-between items-center ${fontSize === size ? 'font-bold' : 'opacity-40'}`}
                          style={{ 
                            borderColor: fontSize === size ? currentThemeStyles.border : `${currentThemeStyles.border}20`,
                            backgroundColor: fontSize === size ? `${currentThemeStyles.text}10` : 'transparent'
                          }}
                        >
                          <span>{size}</span>
                          {fontSize === size && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paper Style */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                      <LayoutGrid size={14} />
                      <span>Qog'oz uslubi</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {(['Oddiy', 'Chiziqli', 'Katakli'] as PaperStyle[]).map(style => (
                        <button
                          key={style}
                          onClick={() => setPaperStyle(style)}
                          className={`w-full py-3 px-4 text-left border-2 rounded-sm transition-all flex justify-between items-center ${paperStyle === style ? 'font-bold' : 'opacity-40'}`}
                          style={{ 
                            borderColor: paperStyle === style ? currentThemeStyles.border : `${currentThemeStyles.border}20`,
                            backgroundColor: paperStyle === style ? `${currentThemeStyles.text}10` : 'transparent'
                          }}
                        >
                          <span>{style}</span>
                          {paperStyle === style && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themes */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                      <Palette size={14} />
                      <span>Mavzular</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(THEMES) as Theme[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`w-full py-3 px-4 text-left border-2 rounded-sm transition-all flex justify-between items-center ${theme === t ? 'font-bold' : 'opacity-40'}`}
                          style={{ 
                            borderColor: theme === t ? currentThemeStyles.border : `${currentThemeStyles.border}20`,
                            backgroundColor: theme === t ? `${currentThemeStyles.text}10` : 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: THEMES[t].bg, borderColor: THEMES[t].border }} />
                            <span>{t}</span>
                          </div>
                          {theme === t && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Images */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                      <ImageIcon size={14} />
                      <span>Fon rasmi</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BACKGROUND_IMAGES.map(img => (
                        <button
                          key={img.id}
                          onClick={() => setBgImage(img.url)}
                          className={`relative h-20 border-2 rounded-sm overflow-hidden transition-all ${bgImage === img.url ? 'border-current' : 'opacity-40 border-transparent'}`}
                          style={{ borderColor: bgImage === img.url ? currentThemeStyles.border : 'transparent' }}
                        >
                          {img.url ? (
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase" style={{ backgroundColor: `${currentThemeStyles.text}10` }}>
                              {img.name}
                            </div>
                          )}
                          {bgImage === img.url && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Version Info */}
                <div className="mt-auto pt-8 border-t border-black/5 opacity-30 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Qaydlar v1.2.0</p>
                  <p className="text-[8px] mt-1">© 2026 Barcha huquqlar himoyalangan</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {noteToDeleteId && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={cancelDelete}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[90%] max-w-sm p-8 rounded-sm border-4 shadow-2xl text-center"
                style={{ 
                  backgroundColor: currentThemeStyles.bg,
                  borderColor: currentThemeStyles.border,
                  color: currentThemeStyles.text
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                    <Trash2 size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">O'chirishni tasdiqlaysizmi?</h3>
                <p className="opacity-60 mb-8 text-sm leading-relaxed">
                  Ushbu qayd butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmDelete}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-sm hover:bg-red-600 transition-colors"
                  >
                    Ha, o'chirilsin
                  </button>
                  <button 
                    onClick={cancelDelete}
                    className="w-full py-3 border-2 font-bold rounded-sm transition-opacity hover:opacity-70"
                    style={{ borderColor: currentThemeStyles.border }}
                  >
                    Bekor qilish
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
