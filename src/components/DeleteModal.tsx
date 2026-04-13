import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeStyles } from '../types';

interface DeleteModalProps {
  noteToDeleteId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  currentThemeStyles: ThemeStyles;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  noteToDeleteId,
  onCancel,
  onConfirm,
  currentThemeStyles
}) => {
  return (
    <AnimatePresence>
      {noteToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-xs p-6 rounded-sm shadow-2xl border-2"
            style={{ 
              backgroundColor: currentThemeStyles.bg,
              color: currentThemeStyles.text,
              borderColor: currentThemeStyles.border
            }}
          >
            <h3 className="text-xl font-bold mb-2">O'chirishni tasdiqlaysizmi?</h3>
            <p className="opacity-60 mb-6 text-sm">Bu amalni ortga qaytarib bo'lmaydi.</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={onConfirm}
                className="w-full py-3 bg-red-500 text-white font-bold rounded-sm hover:bg-red-600 transition-colors"
              >
                O'chirish
              </button>
              <button 
                onClick={onCancel}
                className="w-full py-3 font-bold rounded-sm border-2 transition-all opacity-60 hover:opacity-100"
                style={{ borderColor: `${currentThemeStyles.border}20` }}
              >
                Bekor qilish
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
