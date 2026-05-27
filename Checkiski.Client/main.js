const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev') || process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset',
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    // Open the DevTools.
    // win.webContents.openDevTools();
  } else {
    // In production, Next.js generates static files into out/
    win.loadFile(path.join(__dirname, 'out/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
