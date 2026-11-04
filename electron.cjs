const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

const WEBSITE_URL = "https://hotel-management-khaki-three.vercel.app/";

let mainWindow = null;

async function setAutoUpdates() {
  if (!app.isPackaged) {
    console.log("Auto-updates disabled in development.");
    return;
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
  });

  autoUpdater.on("update-available", async (info) => {
    console.log("New version available:", info.version);

    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Hotel Management Update",
      message: `New version ${info.version} is available!`,
      detail: "Would you like to download the latest version?",
      buttons: ["Update Now", "Later"],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 0) {
      try {
        await autoUpdater.downloadUpdate();
      } catch (error) {
        console.error("Download failed:", error);

        dialog.showMessageBox(mainWindow, {
          type: "error",
          title: "Update Failed",
          message: "Unable to download the update.",
          detail: error.message,
          buttons: ["OK"],
        });
      }
    }
  });

  autoUpdater.on("update-not-available", (info) => {
    console.log("You are using the latest version:", info.version);
  });

  autoUpdater.on("download-progress", (progress) => {
    console.log(`Downloading: ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", async (info) => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Update Ready",
      message: `Version ${info.version} is ready to install.`,
      detail: "Restart the application to complete the update.",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on("error", (error) => {
    console.error("Updater error:", error);
  });

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error("Update check failed:", error);
  }
}

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

app.whenReady().then(async () => {
  try {
    await createWindow();

    // Check for updates only after the application opens.
    if (mainWindow && !mainWindow.isDestroyed()) {
      setAutoUpdates();
    }
  } catch (error) {
    console.error("Startup error:", error);
    app.quit();
  }

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
