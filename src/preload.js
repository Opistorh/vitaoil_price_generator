// Здесь можно настроить безопасное взаимодействие между рендерером и основным процессом.
const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем необходимые API в окно рендерера
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeListener: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
