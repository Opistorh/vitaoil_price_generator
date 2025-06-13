"use strict";
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const log = (...args) => {
  const message = args.map(
    (arg) => typeof arg === "object" ? JSON.stringify(arg) : arg
  ).join(" ");
  console.log(message);
  fs.appendFileSync(
    path.join(app.getPath("userData"), "app.log"),
    `${(/* @__PURE__ */ new Date()).toISOString()} ${message}
`
  );
};
let mainWindow = null;
const createWindow = () => {
  log("Creating main window...");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js")
    },
    show: false
  });
  log("Main window created");
  const rendererPath = path.join(__dirname, "renderer", "index.html");
  const devServerUrl = "http://localhost:3000";
  log("Development server URL:", devServerUrl);
  log("Renderer path:", rendererPath);
  try {
    if (process.env.NODE_ENV === "development") {
      log("Loading development URL");
      mainWindow.loadURL(devServerUrl);
      mainWindow.webContents.openDevTools();
    } else {
      log("Loading production path");
      mainWindow.loadFile(rendererPath);
    }
  } catch (err) {
    log("Error loading window:", err);
  }
  mainWindow.once("ready-to-show", () => {
    log("Window ready to show");
    mainWindow.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
