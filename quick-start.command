#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/Opistorh/vitaoil_price_generator.git"
APP_DIR="$HOME/.vitaoil-price"
DESKTOP="$HOME/Desktop"
SHORTCUT="$DESKTOP/VitaOil Price Generator.command"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Этот инсталлер работает только на macOS."
  exit 1
fi

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Inform the user what's about to happen
cat <<'MSG'

== VitaOil quick installer ==

Этот скрипт:
 - установит (через Homebrew) git и node, если их нет
 - клонирует репозиторий в ~/.vitaoil-price
 - установит зависимости проекта (npm install)
 - создаст ярлык на рабочем столе для запуска

Нажмите Enter чтобы продолжить или Ctrl+C чтобы отменить.
MSG

read -r _

# Homebrew
if ! command_exists brew; then
  echo "Homebrew не найден. Устанавливаю Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "Homebrew найден"
fi

# Git
if ! command_exists git; then
  echo "Устанавливаю git..."
  brew install git
else
  echo "git найден"
fi

# Node / npm
if ! command_exists node || ! command_exists npm; then
  echo "Устанавливаю Node.js (и npm)..."
  brew install node
else
  echo "Node.js найден"
fi

# Создаём директорию и клонируем/обновляем репозиторий
mkdir -p "$APP_DIR"
if [[ -d "$APP_DIR/.git" ]]; then
  echo "Обновляю репозиторий в $APP_DIR..."
  git -C "$APP_DIR" pull --rebase
else
  echo "Клонирую репозиторий в $APP_DIR..."
  git clone "$REPO" "$APP_DIR"
fi

# Устанавливаем зависимости
echo "Устанавливаю зависимости проекта..."
cd "$APP_DIR"
npm install --no-audit --no-fund

# Создаём скрипт запуска и ярлык на рабочем столе
LAUNCH_SCRIPT="#!/bin/bash\ncd '$APP_DIR'\nnpm start\n"

echo -e "$LAUNCH_SCRIPT" > "$APP_DIR/launch.sh"
chmod +x "$APP_DIR/launch.sh"

echo -e "$LAUNCH_SCRIPT" > "$SHORTCUT"
chmod +x "$SHORTCUT"

# Try to remove quarantine flag from the launcher if present
if command_exists xattr; then
  xattr -dr com.apple.quarantine "$APP_DIR/launch.sh" 2>/dev/null || true
  xattr -dr com.apple.quarantine "$SHORTCUT" 2>/dev/null || true
fi

echo ""
echo "Установка завершена. Ярлык для запуска создан на рабочем столе: $SHORTCUT"

echo "Если Terminal попросит разрешение — откройте ярлык правой кнопкой → Открыть." 

exit 0
