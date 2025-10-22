// Глобальное логирование ошибок для отладки exe-файла
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
console.log('Server starting...');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Определяем путь к папке build. Для бинаря pkg читаем из snapshot через __dirname
const isPackaged = !!process.pkg;
const buildDir = isPackaged
  ? path.join(__dirname, 'build')
  : path.join(__dirname, 'build');
const port = 3000;

// На macOS попытаться убрать атрибут карантина и выставить бит исполнителя
function tryRemoveQuarantineFromSelf() {
  if (process.platform !== 'darwin') return;
  try {
    const execPath = process.execPath;
    console.log('Detected macOS — attempting to remove quarantine from:', execPath);

    // Попытаться выставить бит исполнителя (на случай, если его нет)
    const chmod = spawnSync('chmod', ['+x', execPath]);
    if (chmod.error) {
      console.error('chmod failed:', chmod.error);
    } else if (chmod.status !== 0) {
      console.error('chmod exit code', chmod.status, '-', (chmod.stderr || '').toString());
    }

    // Удалить com.apple.quarantine рекурсивно для файла (не для директории)
    const xattr = spawnSync('xattr', ['-dr', 'com.apple.quarantine', execPath]);
    if (xattr.error) {
      console.error('xattr failed:', xattr.error);
    } else if (xattr.status !== 0) {
      console.error('xattr exit code', xattr.status, '-', (xattr.stderr || '').toString());
    } else {
      console.log('xattr: quarantine attribute removed (if it existed)');
    }
  } catch (err) {
    console.error('Error while trying to remove quarantine:', err);
  }
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  // Удаляем ведущий слэш
  if (urlPath.startsWith('/')) urlPath = urlPath.slice(1);
  // Если путь начинается с 'static/', ищем в build/static
  let filePath;
  if (urlPath.startsWith('static/')) {
    filePath = path.join(buildDir, urlPath);
  } else {
    filePath = path.join(buildDir, urlPath === '' ? 'index.html' : urlPath);
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      // Определяем Content-Type для картинок
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.ico')) {
        res.setHeader('Content-Type', 'image/x-icon');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA fallback: serve index.html только для путей без расширения
      if (path.extname(urlPath) === '') {
        const indexPath = path.join(buildDir, 'index.html');
        fs.stat(indexPath, (indexErr, indexStat) => {
          if (!indexErr && indexStat.isFile()) {
            fs.createReadStream(indexPath).pipe(res);
          } else {
            res.statusCode = 500;
            res.end('Index file not found');
          }
        });
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    }
  });
});

// Попытаемся убрать карантин (только на macOS) перед запуском сервера
tryRemoveQuarantineFromSelf();

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // Автоматически открыть браузер
  const { spawn } = require('child_process');
  const url = `http://localhost:${port}`;
  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }
  spawn(cmd, args, { stdio: 'ignore', detached: true });
});
