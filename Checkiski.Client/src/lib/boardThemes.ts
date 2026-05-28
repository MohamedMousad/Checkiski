export interface BoardTheme {
  id: string;
  name: string;
  pieceSet: string;        // folder name under /pieces/
  lightSquare: string;
  darkSquare: string;
  selectedSquare: string;
  lastMoveLight: string;
  lastMoveDark: string;
  coordColorLight: string;
  coordColorDark: string;
  validMoveColor: string;
  validMoveCaptureColor: string;
  borderColor: string;
  boardShadow: string;
  boardBg: string;
}

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'classic',
    name: 'Classic Wood',
    pieceSet: 'cburnett',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    selectedSquare: 'rgba(255, 255, 50, 0.5)',
    lastMoveLight: 'rgba(205, 210, 106, 0.6)',
    lastMoveDark: 'rgba(170, 162, 58, 0.6)',
    coordColorLight: '#b58863',
    coordColorDark: '#f0d9b5',
    validMoveColor: 'rgba(0, 0, 0, 0.12)',
    validMoveCaptureColor: 'rgba(0, 0, 0, 0.12)',
    borderColor: '#8b6914',
    boardShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #a07840, #8b6914)',
  },
  {
    id: 'emerald',
    name: 'Emerald Arena',
    pieceSet: 'cburnett',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    selectedSquare: 'rgba(255, 255, 50, 0.5)',
    lastMoveLight: 'rgba(205, 210, 106, 0.7)',
    lastMoveDark: 'rgba(170, 162, 58, 0.7)',
    coordColorLight: '#769656',
    coordColorDark: '#eeeed2',
    validMoveColor: 'rgba(0, 0, 0, 0.12)',
    validMoveCaptureColor: 'rgba(0, 0, 0, 0.12)',
    borderColor: '#4a6930',
    boardShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #5a8040, #3d5c28)',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    pieceSet: 'merida',
    lightSquare: '#dee3e6',
    darkSquare: '#8ca2ad',
    selectedSquare: 'rgba(100, 180, 255, 0.5)',
    lastMoveLight: 'rgba(100, 160, 220, 0.5)',
    lastMoveDark: 'rgba(80, 130, 180, 0.5)',
    coordColorLight: '#8ca2ad',
    coordColorDark: '#dee3e6',
    validMoveColor: 'rgba(0, 0, 0, 0.12)',
    validMoveCaptureColor: 'rgba(0, 0, 0, 0.12)',
    borderColor: '#456078',
    boardShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
    boardBg: 'linear-gradient(145deg, #556878, #3a4f60)',
  },
  {
    id: 'obsidian',
    name: 'Dark Obsidian',
    pieceSet: 'pirouetti',
    lightSquare: '#cccccc',
    darkSquare: '#555555',
    selectedSquare: 'rgba(255, 200, 50, 0.5)',
    lastMoveLight: 'rgba(180, 160, 80, 0.5)',
    lastMoveDark: 'rgba(140, 120, 50, 0.5)',
    coordColorLight: '#555555',
    coordColorDark: '#cccccc',
    validMoveColor: 'rgba(0, 0, 0, 0.15)',
    validMoveCaptureColor: 'rgba(0, 0, 0, 0.15)',
    borderColor: '#333333',
    boardShadow: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
    boardBg: 'linear-gradient(145deg, #444, #2a2a2a)',
  },
  {
    id: 'marble',
    name: 'Royal Marble',
    pieceSet: 'cburnett',
    lightSquare: '#f5f0e8',
    darkSquare: '#9e8b73',
    selectedSquare: 'rgba(218, 165, 32, 0.45)',
    lastMoveLight: 'rgba(195, 170, 110, 0.5)',
    lastMoveDark: 'rgba(160, 130, 70, 0.5)',
    coordColorLight: '#9e8b73',
    coordColorDark: '#f5f0e8',
    validMoveColor: 'rgba(0, 0, 0, 0.10)',
    validMoveCaptureColor: 'rgba(0, 0, 0, 0.10)',
    borderColor: '#7a6b52',
    boardShadow: '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)',
    boardBg: 'linear-gradient(145deg, #8a7b62, #6d5e48)',
  },
];

export function getThemeById(id: string): BoardTheme {
  return BOARD_THEMES.find(t => t.id === id) || BOARD_THEMES[0];
}

const STORAGE_KEY = 'checkiski-board-theme';

export function getSavedThemeId(): string {
  if (typeof window === 'undefined') return 'classic';
  return localStorage.getItem(STORAGE_KEY) || 'classic';
}

export function saveThemeId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, id);
  }
}
