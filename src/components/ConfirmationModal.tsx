import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { ThemeStyles } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  currentThemeStyles: ThemeStyles;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  currentThemeStyles
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-sm p-8 border-2 shadow-2xl"
            style={{ 
              backgroundColor: currentThemeStyles.bg,
              color: currentThemeStyles.text,
              borderColor: currentThemeStyles.border
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 rounded-full" style={{ backgroundColor: `${currentThemeStyles.text}10` }}>
                <AlertCircle size={40} className="animate-pulse" />
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-4">
                {title}
              </h3>
              
              <p className="text-sm opacity-60 font-medium leading-relaxed mb-8">
                {message}
              </p>
              
              <div className="grid grid-cols-1 w-full gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                  }}
                  className="py-4 px-6 border-2 font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ 
                    backgroundColor: currentThemeStyles.text,
                    color: currentThemeStyles.bg,
                    borderColor: currentThemeStyles.border
                  }}
                >
                  {confirmLabel}
                </button>
                
                <button
                  onClick={onCancel}
                  className="py-4 px-6 border-2 font-black uppercase tracking-widest text-xs transition-all opacity-40 hover:opacity-100"
                  style={{ borderColor: `${currentThemeStyles.border}40` }}
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
