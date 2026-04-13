export type Theme = 'Klassik' | 'Zamonaviy' | 'Tungi';
export type FontSize = 'Kichik' | 'O\'rta' | 'Katta';
export type PaperStyle = 'Oddiy' | 'Chiziqli' | 'Katakli';
export type ViewMode = 'Ro\'yxat' | 'Taqvim';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  completed?: boolean;
}

export interface ThemeStyles {
  bg: string;
  text: string;
  accent: string;
  border: string;
}
