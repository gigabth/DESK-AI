
const { app, BrowserWindow } = require('electron');
const path = require('path');

// ตรวจสอบการเริ่มต้นของ Squirrel (เฉพาะ Windows) อย่างปลอดภัย
try {
  const squirrelStartup = require('electron-squirrel-startup');
  if (squirrelStartup) {
    app.quit();
  }
} catch (e) {
  // ข้ามไปหากไม่พบโมดูลหรือไม่ได้รันบนสภาพแวดล้อมที่ต้องการ
  console.log('Note: electron-squirrel-startup skipped or not found.');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#f9fafb',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      webSecurity: false 
    },
    autoHideMenuBar: true,
  });

  const isDev = !app.isPackaged;
  
  if (isDev) {
    const loadDevServer = () => {
      mainWindow.loadURL('http://127.0.0.1:5173').catch(() => {
        setTimeout(loadDevServer, 1000);
      });
    };
    loadDevServer();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // เปิด DevTools เมื่อกด F12 หรือ Ctrl+Shift+I เพื่อช่วยในการ Debug
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      mainWindow.webContents.openDevTools();
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
