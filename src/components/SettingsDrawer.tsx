import React from 'react';
import { X, Type, LayoutGrid, Palette, Image as ImageIcon, Bell, Volume2, Vibrate } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme, FontSize, PaperStyle, ThemeStyles } from '../types';
import { THEMES, FONT_SIZES, BACKGROUND_IMAGES } from '../constants';

interface SettingsDrawerProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  currentThemeStyles: ThemeStyles;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  paperStyle: PaperStyle;
  setPaperStyle: (style: PaperStyle) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  bgImage: string;
  setBgImage: (url: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  showSettings,
  setShowSettings,
  currentThemeStyles,
  fontSize,
  setFontSize,
  paperStyle,
  setPaperStyle,
  theme,
  setTheme,
  bgImage,
  setBgImage,
  soundEnabled,
  setSoundEnabled,
  vibrationEnabled,
  setVibrationEnabled
}) => {
  return (
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
            className="fixed top-0 right-0 bottom-0 z-50 w-[290px] pt-4 px-6 pb-2 flex flex-col shadow-2xl"
            style={{ 
              backgroundColor: currentThemeStyles.bg,
              color: currentThemeStyles.text,
              borderLeft: `2px solid ${currentThemeStyles.border}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold uppercase tracking-[0.2em]">Sozlamalar</h3>
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

              {/* Sound & Vibration */}
              <div>
                <div className="flex items-center gap-2 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                  <Bell size={14} />
                  <span>Ovoz va tebranish</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-full py-3 px-4 text-left border-2 rounded-sm transition-all flex justify-between items-center ${soundEnabled ? 'font-bold' : 'opacity-40'}`}
                    style={{ 
                      borderColor: soundEnabled ? currentThemeStyles.border : `${currentThemeStyles.border}20`,
                      backgroundColor: soundEnabled ? `${currentThemeStyles.text}10` : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 size={18} />
                      <span>Ovozli bildirishnoma</span>
                    </div>
                    {soundEnabled && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />}
                  </button>

                  <button
                    onClick={() => setVibrationEnabled(!vibrationEnabled)}
                    className={`w-full py-3 px-4 text-left border-2 rounded-sm transition-all flex justify-between items-center ${vibrationEnabled ? 'font-bold' : 'opacity-40'}`}
                    style={{ 
                      borderColor: vibrationEnabled ? currentThemeStyles.border : `${currentThemeStyles.border}20`,
                      backgroundColor: vibrationEnabled ? `${currentThemeStyles.text}10` : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Vibrate size={18} />
                      <span>Tebranish</span>
                    </div>
                    {vibrationEnabled && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentThemeStyles.text }} />}
                  </button>
                </div>
              </div>

              <footer className="mt-20 pt-8 pb-4 text-center opacity-30 text-[10px] font-bold uppercase tracking-[0.2em]">
                <a 
                  href="https://kvantsystem.uz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-100 transition-opacity"
                >
                  Qaydlar v2.0 • Qaydlar [@2026 - kvant system]
                </a>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
