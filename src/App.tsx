/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  ChevronLeft, 
  Settings, 
  Type, 
  Palette, 
  Clock, 
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Theme = 'Klassik' | 'An\'anaviy' | 'Zamonaviy' | 'Tungi' | 'Yozuv mashinkasi';
type FontSize = 'Kichik' | 'O\'rta' | 'Katta';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

// --- Constants ---

const THEMES: Record<Theme, { bg: string; text: string; accent: string; border: string }> = {
  'Klassik': { bg: '#FFFFFF', text: '#000000', accent: '#000000', border: '#000000' },
  'An\'anaviy': { bg: '#F4ECD8', text: '#5D4037', accent: '#8D6E63', border: '#5D4037' },
  'Zamonaviy': { bg: '#F5F5F5', text: '#333333', accent: '#666666', border: '#333333' },
  'Tungi': { bg: '#000000', text: '#FFFFFF', accent: '#FF2D55', border: '#FFFFFF' },
  'Yozuv mashinkasi': { bg: '#E3F2FD', text: '#0D47A1', accent: '#1976D2', border: '#0D47A1' },
};

const FONT_SIZES: Record<FontSize, string> = {
  'Kichik': 'text-sm',
  'O\'rta': 'text-base',
  'Katta': 'text-xl',
};

// --- Utils ---

const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min o'qish`;
};

// --- Components ---

export default function App() {
  // State
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('qaydlar_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('qaydlar_theme') as Theme) || 'Klassik');
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('qaydlar_font_size') as FontSize) || 'O\'rta');
  const [showSettings, setShowSettings] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);

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

  // Derived State
  const currentNote = useMemo(() => notes.find(n => n.id === currentNoteId), [notes, currentNoteId]);
  
  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

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

  return (
    <div 
      className="min-h-screen transition-colors duration-500 flex flex-col items-center overflow-x-hidden"
      style={{ 
        backgroundColor: currentThemeStyles.bg, 
        color: currentThemeStyles.text,
      }}
    >
      {/* Main Container */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col relative px-4 py-6 md:px-8">
        
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
              aria-label="Sozlamalar"
            >
              <Settings size={20} />
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
                    autoFocus
                  />
                </div>
                
                <textarea
                  placeholder="Fikrlaringizni shu yerga yozing..."
                  value={currentNote.content}
                  onChange={(e) => handleUpdateNote(currentNote.id, { content: e.target.value })}
                  className={`flex-1 bg-transparent resize-none focus:outline-none placeholder:opacity-30 leading-relaxed ${FONT_SIZES[fontSize]}`}
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
                  <button 
                    onClick={() => setIsEditing(false)}
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
                </div>

                {/* Search */}
                <div 
                  className="flex items-center gap-3 px-4 py-3 border-2 rounded-sm mb-8"
                  style={{ borderColor: currentThemeStyles.border }}
                >
                  <Search size={18} className="opacity-40" />
                  <input 
                    type="text"
                    placeholder="Qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none placeholder:opacity-30"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="opacity-40 hover:opacity-100">
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Notes List */}
                <div className="space-y-6">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map(note => (
                      <motion.div 
                        layout
                        key={note.id}
                        onClick={() => {
                          setCurrentNoteId(note.id);
                          setIsEditing(true);
                        }}
                        className="group cursor-pointer border-b-2 pb-6 transition-opacity hover:opacity-70"
                        style={{ borderColor: `${currentThemeStyles.border}20` }}
                      >
                        <h2 className="text-xl font-bold mb-2 truncate">
                          {note.title || 'Sarlavhasiz'}
                        </h2>
                        <p className="opacity-60 line-clamp-2 text-sm leading-relaxed">
                          {note.content || 'Hech qanday matn yo\'q...'}
                        </p>
                        <div className="mt-3 text-[10px] uppercase tracking-widest opacity-40">
                          {new Date(note.updatedAt).toLocaleDateString('uz-UZ', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                      <Plus size={48} className="mb-4" />
                      <p>Hozircha hech qanday qayd yo'q</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl border-t-4 shadow-2xl"
                style={{ 
                  backgroundColor: currentThemeStyles.bg,
                  borderColor: currentThemeStyles.border,
                  color: currentThemeStyles.text
                }}
              >
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold uppercase tracking-widest">Sozlamalar</h3>
                    <button onClick={() => setShowSettings(false)} className="p-2">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Font Size */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 opacity-60 text-xs font-bold uppercase tracking-widest">
                      <Type size={14} />
                      <span>Shrift o'lchami</span>
                    </div>
                    <div className="flex gap-2">
                      {(Object.keys(FONT_SIZES) as FontSize[]).map(size => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`flex-1 py-3 border-2 rounded-sm transition-all ${fontSize === size ? 'font-bold' : 'opacity-40'}`}
                          style={{ 
                            borderColor: currentThemeStyles.border,
                            backgroundColor: fontSize === size ? currentThemeStyles.text : 'transparent',
                            color: fontSize === size ? currentThemeStyles.bg : currentThemeStyles.text
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themes */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 opacity-60 text-xs font-bold uppercase tracking-widest">
                      <Palette size={14} />
                      <span>Mavzular</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(Object.keys(THEMES) as Theme[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`flex flex-col items-center gap-2 p-3 border-2 rounded-sm transition-all ${theme === t ? 'ring-4 ring-offset-2' : 'opacity-60'}`}
                          style={{ 
                            borderColor: currentThemeStyles.border,
                            backgroundColor: THEMES[t].bg,
                            color: THEMES[t].text,
                            // @ts-ignore
                            '--tw-ring-color': currentThemeStyles.border
                          }}
                        >
                          <div className="w-full h-8 border border-current opacity-20" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Action Bar (Mobile) */}
        {!isEditing && !showSettings && !noteToDeleteId && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full border-4 shadow-xl z-30"
            style={{ 
              backgroundColor: currentThemeStyles.bg,
              borderColor: currentThemeStyles.border
            }}
          >
            <button 
              onClick={handleCreateNote}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
              style={{ 
                backgroundColor: currentThemeStyles.text,
                color: currentThemeStyles.bg
              }}
            >
              <Plus size={20} />
              <span>Yangi qayd</span>
            </button>
          </motion.div>
        )}

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
