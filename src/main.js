const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Настраиваем логирование
const log = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  ).join(' ');
  
  console.log(message);
  fs.appendFileSync(path.join(app.getPath('userData'), 'app.log'), 
    `${new Date().toISOString()} ${message}\n`);
};

let mainWindow = null;

const createWindow = async () => {
  log('Creating main window...');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });
  
  log('Main window created');

  // В режиме разработки загружаем URL с dev сервера
  const rendererPath = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : path.join(__dirname, '../dist/renderer/index.html');

  log('Loading path:', rendererPath);

  try {
    if (process.env.NODE_ENV === 'development') {
      log('Loading development URL');
      await mainWindow.loadURL(rendererPath);
      mainWindow.webContents.openDevTools();
    } else {
      log('Loading production path');
      await mainWindow.loadFile(rendererPath);
    }
  } catch (err) {
    log('Error loading window:', err);
  }

  mainWindow.once('ready-to-show', () => {
    log('Window ready to show');
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
