const { app, BrowserWindow, dialog } = require("electron");

const WEBSITE_URL = "https://hotel-management-khaki-three.vercel.app/";

let mainWindow = null;

async function checkInternetConnection() {
  try {
    const response = await fetch(WEBSITE_URL, {
      signal: AbortSignal.timeout(8000),
    });

    return response.ok;
  } catch (error) {
    console.error("Internet check failed:", error.message);
    return false;
  }
}

async function createWindow() {
  while (true) {
    const connected = await checkInternetConnection();

    if (connected) break;

    const result = await dialog.showMessageBox({
      type: "warning",
      title: "Internet Connection",
      message: "Unable to connect to Hotel Management.",
      detail: "Please check your internet connection.",
      buttons: ["Retry", "Exit"],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 1) {
      app.quit();
      return;
    }
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    maximizable: true,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.maximize();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  try {
    await mainWindow.loadURL(WEBSITE_URL);
  } catch (error) {
    console.error("Website loading failed:", error);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }

    await dialog.showMessageBox({
      type: "error",
      title: "Website Loading Error",
      message: "Unable to load the Hotel Management website.",
      detail: error.message,
      buttons: ["OK"],
    });
  }
}

app.whenReady().then(() => {
  createWindow().catch((error) => {
    console.error("Startup error:", error);
    app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch(console.error);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
