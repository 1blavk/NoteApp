import { Theme, FontSize, ThemeStyles } from './types';

export const THEMES: Record<Theme, ThemeStyles> = {
  'Klassik': { bg: '#FFFFFF', text: '#000000', accent: '#000000', border: '#000000' },
  'Zamonaviy': { bg: '#F5F5F5', text: '#333333', accent: '#666666', border: '#333333' },
  'Tungi': { bg: '#222222', text: '#FFFFFF', accent: '#FFFFFF', border: '#FFFFFF' },
};

export const BACKGROUND_IMAGES = [
  { id: 'none', name: 'Yo\'q', url: '' },
  { id: 'Nature', name: 'Kun', url: 'https://i.pinimg.com/736x/25/8d/ed/258ded0b868d38b2e513d477c66b05f9.jpg' },
  { id: 'forest', name: "O'rmon", url: 'https://i.pinimg.com/736x/14/85/1d/14851d161855fc11e842fd392dc6340b.jpg' },
  { id: 'mountains', name: 'Tog\'lar', url: 'https://i.pinimg.com/736x/d6/1d/fe/d61dfea97ca56afd51cb74f795b6035e.jpg' },
];

export const FONT_SIZES: Record<FontSize, string> = {
  'Kichik': 'text-sm',
  'O\'rta': 'text-base',
  'Katta': 'text-xl',
};

export const LINE_HEIGHTS: Record<FontSize, string> = {
  'Kichik': '1.5rem',
  'O\'rta': '2rem',
  'Katta': '2.5rem',
};
