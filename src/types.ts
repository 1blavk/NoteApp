export type Theme = 'Klassik' | 'Zamonaviy' | 'Tungi';
export type FontSize = 'Kichik' | 'O\'rta' | 'Katta';
export type PaperStyle = 'Oddiy' | 'Chiziqli' | 'Katakli';
export type ViewMode = 'Ro\'yxat' | 'Taqvim' | 'Analitika';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
  completed?: boolean;
  reminderAt?: number;
}

export interface ThemeStyles {
  bg: string;
  text: string;
  accent: string;
  border: string;
}
