const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  const publicDir = path.join(__dirname, '../public');
  const distDir = path.join(__dirname, '../dist/renderer');

  try {
    // Создаем директорию, если она не существует
    await fs.ensureDir(distDir);
    
    // Копируем файлы из public в dist/renderer
    await fs.copy(publicDir, distDir, {
      filter: (src) => {
        // Пропускаем .git и node_modules
        return !src.includes('.git') && !src.includes('node_modules');
      }
    });
    
    console.log('Assets copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
}

copyAssets(); 