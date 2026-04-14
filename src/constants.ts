import { Theme, FontSize, ThemeStyles } from './types';

export const THEMES: Record<Theme, ThemeStyles> = {
  'Klassik': { bg: '#FFFFFF', text: '#000000', accent: '#000000', border: '#000000' },
  'Zamonaviy': { bg: '#F5F5F5', text: '#333333', accent: '#666666', border: '#333333' },
  'Tungi': { bg: '#222222', text: '#FFFFFF', accent: '#FFFFFF', border: '#FFFFFF' },
};

export const BACKGROUND_IMAGES = [
  { id: 'none', name: 'Yo\'q', url: '' },
  { id: 'themoon', name: 'Oy', url: 'https://i.pinimg.com/736x/d8/e1/79/d8e1790ca78a09f6774f00031cffb236.jpg' }, 
  { id: 'mountain', name: 'tog', url: 'https://i.pinimg.com/736x/2d/86/ea/2d86ea24768f03ac02fd365e3fe3b252.jpg' },
  { id: 'picnik', name: "Pik Nik", url: 'https://i.pinimg.com/736x/8e/7f/6c/8e7f6cff7e25d3a2d9366e39eb18bf13.jpg' },
  { id: 'samarkand', name: 'Samarkand', url: 'https://i.pinimg.com/736x/a1/a1/38/a1a13816eb84ab25d9bd562e3f7f1990.jpg' },
  { id: 'rain', name: 'Yomgir', url: 'https://i.pinimg.com/736x/15/d1/14/15d114562e398c432e2aa3b71dbd14ec.jpg' },
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
