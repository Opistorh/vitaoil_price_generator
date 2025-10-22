## 🚀 Как запустить на MacOS:

1. Открыть "Терминал"

2. Запустить команду
```curl -fsSLO https://raw.githubusercontent.com/Opistorh/vitaoil_price_generator/main/quick-start.command
chmod +x quick-start.command
./quick-start.command```

3. Наблюдать за ходом установки. Иногда может казаться что ничего не происходит, но на самом деле установка идет в фоне. Это нормально

4. На рабочем столе появится ярлычок "VitaOil Price Generator.command". Для запуска проекта открывать его двойным щелчком.

5. УРА! Все необходимое установлено, и в дальнейшем достаточно только запускать ярлык с рабочего стола.


## 📹 Как это работает

1. Загружается Rive-анимация
2. Пользователь настраивает параметры
3. Записывается видео с холста
4. При необходимости добавляется интро-ролик
5. Пользователь скачивает итоговый ролик

> ⚠️ Используется FFmpeg в браузере — убедитесь, что у вас достаточно ресурсов.

## 🔍 Примеры использования

- Промо-видео по клику в интерфейсе
- Автогенерация демо-анимаций для showcase
- Интерактивные презентации и экспорт

## 💡 Моя роль

- Продумал UX и UI приложения
- Разработал архитектуру и бизнес-логику
- Реализовал интеграцию FFmpeg, Rive и механизм экспорта
- Настроил механизм автозапоминания настроек и загрузки из cookie
- Отладил баг со склейкой и увеличенной длительностью финального видео (см. `-shortest` fix в ffmpegController.js)

## 🧩 Сборка исполняемых файлов (macOS и Windows)

Требования:
- Node.js 18
- `pkg` уже в devDependencies

Сборка:
```bash
# macOS (ARM64)
npm run pkg:mac

# Windows (x64)
npm run pkg:win

# Кросс-сборка (macOS ARM + Windows x64)
npm run pkg:all
```

Результат:
- В `dist/` появится самодостаточный бинарь:
  - macOS: `dist/vitaoil_price_generator-macos-arm64`
  - Windows: `dist/vitaoil_price_generator-win.exe`

Запуск:
```bash
# macOS
./dist/vitaoil_price_generator-macos-arm64
# Windows
./dist/vitaoil_price_generator-win.exe
```

Примечания:
- Все файлы из `build/**` вшиваются внутрь бинаря (см. `pkg.assets` в `package.json`).
- `server.js` читает ассеты из snapshot (`__dirname/build/...`) — дополнительные папки рядом не требуются.
- macOS может запросить разрешение на запуск (Settings → Privacy & Security → Open Anyway).

## 📬 Связаться со мной

- 👨‍💻 Артём Кашаков — [@LinkedIn](https://www.linkedin.com/in/artem-kashakov/) / [Telegram](t.me/artem_kashakov)
- 🌐 Сайт-портфолио - [kashakov.art](https://kashakov.art)
- 📩 Почта: [kashakovartem@gmail.com]

---
