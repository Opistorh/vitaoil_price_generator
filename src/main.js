// Polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const fs = require('fs');

// Настройка CORS для FFmpeg
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Embedder-Policy': ['require-corp'],
        'Cross-Origin-Opener-Policy': ['same-origin']
      }
    });
  });
});

// Настраиваем логирование
const log = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  ).join(' ');
  
  console.log(message);
  fs.appendFileSync(path.join(app.getPath('userData'), 'app.log'), 
    `${new Date().toISOString()} ${message}\n`);
};

// GPU and cache configuration
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');
app.commandLine.appendSwitch('disable-gpu-program-cache');
app.commandLine.appendSwitch('disable-gpu-watchdog');
app.commandLine.appendSwitch('disable-gpu-memory-buffer-video-frames');
app.commandLine.appendSwitch('disable-gpu-process-crash-limit');
app.commandLine.appendSwitch('disable-3d-apis');
app.commandLine.appendSwitch('disable-3d');
app.commandLine.appendSwitch('disable-features', 'CanvasOopRasterization,WebGL,WebGL2,VaapiVideoDecoder,VaapiVideoEncoder,WebGPU');
app.commandLine.appendSwitch('no-sandbox');

let mainWindow = null;

const createWindow = async () => {
  log('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: process.env.NODE_ENV !== 'development',
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:main',
      backgroundThrottling: false,
      enableRemoteModule: false,
      spellcheck: false,
      allowRunningInsecureContent: process.env.NODE_ENV === 'development',
    },
    show: true,
  });

  // Отключаем меню в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    mainWindow.setMenu(null);
  }
  
  log('Main window created');

  // В режиме разработки загружаем URL с dev сервера
  const rendererPath = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
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
    log('Content loaded successfully');
  } catch (err) {
    log('Error loading window:', err);
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log('Content finished loading');
  });

  mainWindow.once('ready-to-show', () => {
    log('Window ready to show');
    // mainWindow.show(); // No longer needed, as we set show: true
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
