// src/utils/cookies.js

const COOKIE_NAME = "textValues";

export function saveTextValuesToCookies(values) {
  document.cookie = `textValues=${JSON.stringify(values)}; path=/`;
}

export function loadTextValuesFromCookies() {
  const match = document.cookie.match(/(^| )textValues=([^;]+)/);
  try {
    const decoded = match ? decodeURIComponent(match[2]) : null;
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
}

// ⬇️ Новые функции для чекбоксов:
export function saveCheckboxesToCookies({
  includeCoffee,
  isArrowLeft,
  isGasOn,
}) {
  const state = { includeCoffee, isArrowLeft, isGasOn };
  document.cookie = `checkboxStates=${JSON.stringify(state)}; path=/`;
}

export function loadCheckboxesFromCookies() {
  const match = document.cookie.match(/(^| )checkboxStates=([^;]+)/);
  try {
    const decoded = match ? decodeURIComponent(match[2]) : null;
    const parsed = decoded ? JSON.parse(decoded) : {};
    return {
      includeCoffee: parsed.includeCoffee ?? true,
      isArrowLeft: parsed.isArrowLeft ?? false,
      isGasOn: parsed.isGasOn ?? true,
    };
  } catch {
    return {
      includeCoffee: true,
      isArrowLeft: false,
      isGasOn: true,
    };
  }
}
