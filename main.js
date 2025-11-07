// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'renderer', 'preload.js'), // preload inside renderer
    }
  });

  // ✅ Correct path: your index.html is inside the renderer folder
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Uncomment for debugging if needed:
  // win.webContents.openDevTools();
}

// Called when Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
