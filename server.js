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

const buildDir = path.join(__dirname, 'build');
const port = 3000;

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
      }
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA fallback: serve index.html только для путей без расширения
      if (path.extname(urlPath) === '') {
        fs.createReadStream(path.join(buildDir, 'index.html')).pipe(res);
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    }
  });
});

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
