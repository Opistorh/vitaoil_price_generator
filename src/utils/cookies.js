// src/utils/cookies.js

const COOKIE_NAME = "textValues";

export function saveTextValuesToCookies(values) {
  const json = JSON.stringify(values);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(json)}; path=/; max-age=31536000`; // 1 год
}

export function loadTextValuesFromCookies() {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  }
  return null;
}
