const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function checkCommand(command) {
    try {
        execSync(`which ${command}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

async function installHomebrew() {
    console.log('🍺 Установка Homebrew...');
    const script = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
    execSync(script, { stdio: 'inherit' });
    console.log('✅ Homebrew установлен');
}

async function installNode() {
    console.log('📦 Установка Node.js...');
    execSync('brew install node', { stdio: 'inherit' });
    console.log('✅ Node.js установлен');
}

async function installGit() {
    console.log('📦 Установка Git...');
    execSync('brew install git', { stdio: 'inherit' });
    console.log('✅ Git установлен');
}

async function main() {
    console.log('🚀 Начинаем установку VitaOil Price Generator...');
    
    // Проверяем наличие Homebrew
    if (!await checkCommand('brew')) {
        console.log('⚙️ Homebrew не найден');
        await installHomebrew();
    }

    // Проверяем наличие Node.js
    if (!await checkCommand('node')) {
        console.log('⚙️ Node.js не найден');
        await installNode();
    }

    // Проверяем наличие Git
    if (!await checkCommand('git')) {
        console.log('⚙️ Git не найден');
        await installGit();
    }

    const desktopPath = path.join(os.homedir(), 'Desktop');
    const appPath = path.join(os.homedir(), '.vitaoil-price');
    
    // Создаем директорию приложения
    if (!fs.existsSync(appPath)) {
        fs.mkdirSync(appPath);
    }
    
    // Клонируем репозиторий
    console.log('📦 Загружаем файлы...');
    execSync('git clone https://github.com/Opistorh/vitaoil_price_generator.git .', {
        cwd: appPath,
        stdio: 'inherit'
    });
    
    // Устанавливаем зависимости проекта
    console.log('📚 Устанавливаем зависимости проекта...');
    execSync('npm install', {
        cwd: appPath,
        stdio: 'inherit'
    });
    
    // Создаем launch script
    const launchScript = `#!/bin/bash
cd "${appPath}"
npm start`;
    
    const scriptPath = path.join(appPath, 'launch.sh');
    fs.writeFileSync(scriptPath, launchScript);
    execSync(`chmod +x "${scriptPath}"`);
    
    // Создаем .command файл на рабочем столе
    const desktopShortcut = path.join(desktopPath, 'VitaOil Price Generator.command');
    fs.writeFileSync(desktopShortcut, launchScript);
    execSync(`chmod +x "${desktopShortcut}"`);
    
    console.log('✅ Установка завершена!');
    console.log('🎯 Ярлык для запуска создан на рабочем столе');
}

main().catch(console.error);