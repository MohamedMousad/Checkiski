export interface BoardTheme {
  id: string;
  name: string;
  pieceSet: string;
  lightSquare: string;
  darkSquare: string;
  selectedSquare: string;
  selectedBorder: string;
  lastMoveLight: string;
  lastMoveDark: string;
  coordColorLight: string;
  coordColorDark: string;
  validMoveColor: string;
  validMoveCaptureColor: string;
  borderColor: string;
  boardShadow: string;
  boardBg: string;
  checkColor: string;
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'cinematic-obsidian',
    name: 'Cinematic Obsidian',
    pieceSet: 'cburnett',
    lightSquare: '#27272A',
    darkSquare: '#18181B',
    selectedSquare: 'rgba(217, 248, 69, 0.15)',
    selectedBorder: '#D9F845',
    lastMoveLight: 'rgba(255, 255, 255, 0.1)',
    lastMoveDark: 'rgba(255, 255, 255, 0.05)',
    coordColorLight: '#71717A',
    coordColorDark: '#3F3F46',
    validMoveColor: 'rgba(217, 248, 69, 0.8)',
    validMoveCaptureColor: 'rgba(229, 62, 62, 0.8)',
    borderColor: 'rgba(255,255,255,0.05)',
    boardShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)',
    boardBg: '#111114',
    checkColor: '#E53E3E',
  },
  {
    id: 'classic',
    name: 'Classic Wood',
    pieceSet: 'cburnett',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    selectedSquare: 'rgba(10, 132, 217, 0.20)',
    selectedBorder: '#0A84D9',
    lastMoveLight: 'rgba(201, 168, 76, 0.35)',
    lastMoveDark: 'rgba(170, 145, 58, 0.35)',
    coordColorLight: '#b58863',
    coordColorDark: '#f0d9b5',
    validMoveColor: 'rgba(10, 132, 217, 0.55)',
    validMoveCaptureColor: 'rgba(10, 132, 217, 0.45)',
    borderColor: '#8b6914',
    boardShadow: '0 16px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #a07840, #8b6914)',
    checkColor: '#E53E3E',
  },
  {
    id: 'emerald',
    name: 'Tournament Green',
    pieceSet: 'cburnett',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    selectedSquare: 'rgba(10, 132, 217, 0.22)',
    selectedBorder: '#0A84D9',
    lastMoveLight: 'rgba(205, 210, 106, 0.45)',
    lastMoveDark: 'rgba(170, 162, 58, 0.45)',
    coordColorLight: '#769656',
    coordColorDark: '#eeeed2',
    validMoveColor: 'rgba(10, 132, 217, 0.55)',
    validMoveCaptureColor: 'rgba(10, 132, 217, 0.45)',
    borderColor: '#4a6930',
    boardShadow: '0 16px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #5a8040, #3d5c28)',
    checkColor: '#E53E3E',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    pieceSet: 'merida',
    lightSquare: '#dee3e6',
    darkSquare: '#8ca2ad',
    selectedSquare: 'rgba(10, 132, 217, 0.25)',
    selectedBorder: '#0A84D9',
    lastMoveLight: 'rgba(100, 160, 220, 0.30)',
    lastMoveDark: 'rgba(80, 130, 180, 0.35)',
    coordColorLight: '#8ca2ad',
    coordColorDark: '#dee3e6',
    validMoveColor: 'rgba(10, 132, 217, 0.55)',
    validMoveCaptureColor: 'rgba(10, 132, 217, 0.45)',
    borderColor: '#456078',
    boardShadow: '0 16px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #556878, #3a4f60)',
    checkColor: '#E53E3E',
  },
  {
    id: 'obsidian',
    name: 'Dark Obsidian',
    pieceSet: 'pirouetti',
    lightSquare: '#cccccc',
    darkSquare: '#555555',
    selectedSquare: 'rgba(201, 168, 76, 0.30)',
    selectedBorder: '#C9A84C',
    lastMoveLight: 'rgba(180, 160, 80, 0.30)',
    lastMoveDark: 'rgba(140, 120, 50, 0.30)',
    coordColorLight: '#555555',
    coordColorDark: '#cccccc',
    validMoveColor: 'rgba(201, 168, 76, 0.55)',
    validMoveCaptureColor: 'rgba(201, 168, 76, 0.45)',
    borderColor: '#333333',
    boardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
    boardBg: 'linear-gradient(145deg, #444, #2a2a2a)',
    checkColor: '#E53E3E',
  },
  {
    id: 'marble',
    name: 'Royal Marble',
    pieceSet: 'cburnett',
    lightSquare: '#f5f0e8',
    darkSquare: '#9e8b73',
    selectedSquare: 'rgba(201, 168, 76, 0.25)',
    selectedBorder: '#C9A84C',
    lastMoveLight: 'rgba(195, 170, 110, 0.30)',
    lastMoveDark: 'rgba(160, 130, 70, 0.30)',
    coordColorLight: '#9e8b73',
    coordColorDark: '#f5f0e8',
    validMoveColor: 'rgba(201, 168, 76, 0.50)',
    validMoveCaptureColor: 'rgba(201, 168, 76, 0.40)',
    borderColor: '#7a6b52',
    boardShadow: '0 20px 56px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)',
    boardBg: 'linear-gradient(145deg, #8a7b62, #6d5e48)',
    checkColor: '#E53E3E',
  },
];

export function getThemeById(id: string): BoardTheme {
  return BOARD_THEMES.find(t => t.id === id) || BOARD_THEMES[0];
}

const STORAGE_KEY = 'checkiski-board-theme';

export function getSavedThemeId(): string {
  if (typeof window === 'undefined') return 'cinematic-obsidian';
  return localStorage.getItem(STORAGE_KEY) || 'cinematic-obsidian';
}

export function saveThemeId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, id);
  }
}
