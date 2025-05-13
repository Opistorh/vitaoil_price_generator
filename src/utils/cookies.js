// src/utils/cookies.js

const COOKIE_NAME = "textValues";

export function saveTextValuesToCookies(values) {
  document.cookie = `textValues=${JSON.stringify(values)}; path=/`;
}

export function loadTextValuesFromCookies() {
  const match = document.cookie.match(/(^| )textValues=([^;]+)/);
  try {
    const decoded = match ? decodeURIComponent(match[2]) : null;
    // console.log(decoded)
    return decoded ? JSON.parse(decoded) : null;
  } catch {
    return null;
  }
}

// ⬇️ Новые функции для чекбоксов:
export function saveCheckboxesToCookies({
  includeCoffee,
  isCoffeeOn,
  isArrowLeft,
  isGasOn,
}) {
  const state = { includeCoffee, isCoffeeOn, isArrowLeft, isGasOn };
  document.cookie = `checkboxStates=${JSON.stringify(state)}; path=/`;
}

export function loadCheckboxesFromCookies() {
  const match = document.cookie.match(/(^| )checkboxStates=([^;]+)/);
  try {
    const decoded = match ? decodeURIComponent(match[2]) : null;
    const parsed = decoded ? JSON.parse(decoded) : {};
    return {
      includeCoffee: parsed.includeCoffee ?? true,
      isCoffeeOn: parsed.isCoffeeOn ?? true,
      isArrowLeft: parsed.isArrowLeft ?? false,
      isGasOn: parsed.isGasOn ?? true,
      arrows_left: parsed.arrows_left ?? false,
      coffee_price_show: parsed.coffee_price_show ?? false,
      gas_price_show: parsed.gas_price_show ?? false,
    };
  } catch {
    return {
      includeCoffee: true,
      isCoffeeOn: true,
      isArrowLeft: false,
      isGasOn: true,
      arrows_left: false,
      coffee_price_show: false,
      gas_price_show: false,
    };
  }
}
