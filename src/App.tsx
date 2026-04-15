/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  Clock, 
  X,
  Calendar as CalendarIcon,
  List as ListIcon,
  Menu,
  BarChart2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
import { Note, Theme, FontSize, PaperStyle, ViewMode } from './types';

// --- Constants ---
import { THEMES } from './constants';

// --- Utils ---
import { formatDateUz } from './utils';

// --- Components ---
import { NoteCard } from './components/NoteCard';
import { Calendar } from './components/Calendar';
import { SettingsDrawer } from './components/SettingsDrawer';
import { NoteEditor } from './components/NoteEditor';
import { DeleteModal } from './components/DeleteModal';
import { Analytics } from './components/Analytics';

// --- Services ---
import { getAllNotes, saveNote, deleteNoteFromDB, saveAllNotes } from './services/db';

export default function App() {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDBLoaded, setIsDBLoaded] = useState(false);
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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => localStorage.getItem('qaydlar_sound') !== 'false');
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => localStorage.getItem('qaydlar_vibration') !== 'false');
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isScrolling, setIsScrolling] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when creating or editing
  useEffect(() => {
    if (isEditing && !isLocked) {
      const focus = () => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
          if (titleInputRef.current.value === '') {
            titleInputRef.current.setSelectionRange(0, 0);
          }
        }
      };

      focus();
      const t1 = setTimeout(focus, 100);
      const t2 = setTimeout(focus, 300);
      const t3 = setTimeout(focus, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isEditing, isLocked]);

  // Persistence
  useEffect(() => {
    let timeout: any;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Prevent zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    const handleGestureStart = (e: any) => {
      e.preventDefault();
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('gesturestart', handleGestureStart);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  useEffect(() => {
    if (isScrolling) {
      document.body.classList.add('is-scrolling');
    } else {
      document.body.classList.remove('is-scrolling');
    }
  }, [isScrolling]);

  // Load notes from IndexedDB on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await getAllNotes();
        if (savedNotes.length > 0) {
          setNotes(savedNotes);
        } else {
          // Check localStorage for migration
          const legacyNotes = localStorage.getItem('qaydlar_notes');
          if (legacyNotes) {
            const parsed = JSON.parse(legacyNotes);
            setNotes(parsed);
            await saveAllNotes(parsed);
            // Optionally clear localStorage
            // localStorage.removeItem('qaydlar_notes');
          } else {
            const welcomeNote: Note = {
              id: 'welcome',
              title: 'Xush kelibsiz!',
              content: 'Bu sizning birinchi qaydingiz. Uni tahrirlashingiz yoki o\'chirishingiz mumkin.',
              updatedAt: Date.now(),
              createdAt: Date.now(),
            };
            setNotes([welcomeNote]);
            await saveNote(welcomeNote);
          }
        }
      } catch (error) {
        console.error('Failed to load notes from IndexedDB:', error);
      } finally {
        setIsDBLoaded(true);
      }
    };
    loadNotes();
  }, []);

  // Persistence (Settings still use localStorage for simplicity as they are small)
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

  useEffect(() => {
    localStorage.setItem('qaydlar_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('qaydlar_vibration', String(vibrationEnabled));
  }, [vibrationEnabled]);

  // Reminder Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      notes.forEach(note => {
        if (!note.completed && note.reminderAt && Math.abs(note.reminderAt - now) < 30000) { // Within 30 seconds
          if (soundEnabled) {
            // Ring sound for reminder
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1350/1350-preview.mp3');
            audio.play().catch(() => {});
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notes, soundEnabled]);

  // Derived State
  const currentNote = useMemo(() => notes.find(n => n.id === currentNoteId), [notes, currentNoteId]);
  
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (filterDate) {
      result = result.filter(n => {
        const noteDate = n.reminderAt ? new Date(n.reminderAt) : new Date(n.createdAt);
        return noteDate.toDateString() === filterDate;
      });
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [notes, filterDate]);

  // Handlers
  const handleToggleComplete = (id: string) => {
    setNotes(prev => {
      const updatedNotes = prev.map(note => {
        if (note.id === id) {
          const newCompleted = !note.completed;
          if (newCompleted) {
            if (soundEnabled) {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
              audio.play().catch(() => {});
            }
            if (vibrationEnabled && 'vibrate' in navigator) {
              navigator.vibrate(50);
            }
          }
          const updatedNote = { ...note, completed: newCompleted };
          saveNote(updatedNote); // Async save
          return updatedNote;
        }
        return note;
      });
      return updatedNotes;
    });
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      reminderAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    saveNote(newNote); // Async save
    setCurrentNoteId(newNote.id);
    setIsEditing(true);
    setIsLocked(false);
    setFilterDate(null);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const updated = { ...n, ...updates, updatedAt: Date.now() };
        saveNote(updated); // Async save
        return updated;
      }
      return n;
    }));
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDeleteId(id);
  };

  const confirmDelete = async () => {
    if (noteToDeleteId) {
      setNotes(notes.filter(n => n.id !== noteToDeleteId));
      await deleteNoteFromDB(noteToDeleteId);
      if (currentNoteId === noteToDeleteId) {
        setCurrentNoteId(null);
        setIsEditing(false);
      }
      setNoteToDeleteId(null);
    }
  };

  const currentThemeStyles = THEMES[theme];

  return (
    <div 
      className="min-h-screen transition-colors duration-500 flex flex-col items-center overflow-x-hidden relative"
      style={{ 
        backgroundColor: currentThemeStyles.bg, 
        color: currentThemeStyles.text,
      }}
    >
      {bgImage && (
        <div 
          className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      <div className="w-full max-w-2xl min-h-screen flex flex-col relative z-10 px-4 pt-6 pb-1 md:px-8">
        {!isDBLoaded ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${currentThemeStyles.text}40`, borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            <header className="flex items-center justify-between mb-6">
          <div />
          
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

        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {isEditing && currentNote ? (
              <NoteEditor 
                currentNote={currentNote}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                setIsEditing={setIsEditing}
                handleUpdateNote={handleUpdateNote}
                handleDeleteNote={handleDeleteNote}
                titleInputRef={titleInputRef}
                currentThemeStyles={currentThemeStyles}
                fontSize={fontSize}
                paperStyle={paperStyle}
              />
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col flex-1 pb-1"
              >
                <div className="flex items-center justify-between mb-12">
                  <h1 className="text-4xl font-bold tracking-tighter">Qaydlar</h1>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode('Analitika')}
                      className="p-3 rounded-full border-2 hover:scale-110 transition-transform"
                      style={{ borderColor: currentThemeStyles.border }}
                      title="Analitika"
                    >
                      <BarChart2 size={24} />
                    </button>
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

                {viewMode === 'Analitika' ? (
                  <Analytics 
                    notes={notes}
                    currentThemeStyles={currentThemeStyles}
                    onBack={() => setViewMode('Ro\'yxat')}
                  />
                ) : viewMode === 'Taqvim' ? (
                  <Calendar 
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    notes={notes}
                    currentThemeStyles={currentThemeStyles}
                    setFilterDate={setFilterDate}
                    setViewMode={setViewMode}
                  />
                ) : (
                  <>
                    {filterDate && (
                      <div className="mb-4 flex items-center justify-between p-3 rounded-sm border-2" style={{ borderColor: `${currentThemeStyles.border}40`, backgroundColor: `${currentThemeStyles.text}05` }}>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} className="opacity-60" />
                          <span className="text-sm font-medium">{formatDateUz(filterDate)} dagi qaydlar</span>
                        </div>
                        <button 
                          onClick={() => setFilterDate(null)}
                          className="p-1 hover:opacity-70 transition-opacity"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[10px] pl-[1px]">
                      {filteredNotes.length > 0 ? (
                        filteredNotes.map(note => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            currentThemeStyles={currentThemeStyles}
                            onEdit={() => {
                              setCurrentNoteId(note.id);
                              setIsEditing(true);
                              setIsLocked(true);
                            }}
                            onToggleComplete={() => handleToggleComplete(note.id)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 opacity-30 text-center">
                          <svg width="40" height="40" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
                            <path d="M42 69.5L34 60L40 53.5L49.5 62L42 69.5Z" fill={currentThemeStyles.text}/>
                            <path d="M70 40L54 57.5L44 48L60.5 29L70 37V40Z" fill={currentThemeStyles.text}/>
                            <path d="M44.5 0L0 4.5L7.5 65L11 66L32 60V54L56.5 25.5L53 4.5L44.5 0Z" fill={currentThemeStyles.text}/>
                            <path d="M10.5 34.5V28.5L27 26V33.5L10.5 34.5Z" fill={currentThemeStyles.bg}/>
                            <path d="M9 22L8 14L34.5 10.5L35.5 8.5L39 11L36.5 18.5L9 22Z" fill={currentThemeStyles.bg}/>
                          </svg>
                          <p className="text-lg font-medium">Hozircha hech qanday qayd yo'q</p>
                          <p className="text-sm opacity-60 mt-2">Yangi qayd qo'shish uchun + tugmasini bosing</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <SettingsDrawer 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          currentThemeStyles={currentThemeStyles}
          fontSize={fontSize}
          setFontSize={setFontSize}
          paperStyle={paperStyle}
          setPaperStyle={setPaperStyle}
          theme={theme}
          setTheme={setTheme}
          bgImage={bgImage}
          setBgImage={setBgImage}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          vibrationEnabled={vibrationEnabled}
          setVibrationEnabled={setVibrationEnabled}
        />

        <DeleteModal 
          noteToDeleteId={noteToDeleteId}
          onCancel={() => setNoteToDeleteId(null)}
          onConfirm={confirmDelete}
          currentThemeStyles={currentThemeStyles}
        />
          </>
        )}
      </div>
    </div>
  );
}
