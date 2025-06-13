// logger.js

import React from "react";

// Функция для подсветки прогресс-бара в логах
export function parseLog(log) {
  const progressBarRegex = /\[[#-]+\]\s?\d+%/;
  const match = log.match(progressBarRegex);
  if (!match) return log;
  const index = match.index;
  const progressPart = match[0];
  const before = log.slice(0, index);
  const after = log.slice(index + progressPart.length);

  return (
    <>
      {before}
      <span className="log-highlight">{progressPart}</span>
      {after}
    </>
  );
}

// Добавление нового лога
export function addLog(setLogs, message) {
  setLogs((prevLogs) => [message, ...prevLogs].slice(0, 200));
  console.log(message);
}

// Обновление последнего лога
export function updateLastLog(setLogs, newMessage) {
  setLogs((prevLogs) => {
    if (prevLogs.length === 0) return [newMessage];
    const newLogs = [...prevLogs];
    newLogs[0] = newMessage;
    return newLogs;
  });
  console.log("\r" + newMessage);
}
