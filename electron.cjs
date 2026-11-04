const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const WEBSITE_URL = "https://hotel-management-khaki-three.vercel.app/";

let mainWindow = null;
let updateProgressWindow = null;

function createUpdateProgressWindow() {
  if (updateProgressWindow) return;

  updateProgressWindow = new BrowserWindow({
    width: 430,
    height: 230,
    parent: mainWindow,
    modal: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    title: "Downloading Update",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #ffffff;
          color: #222;
          padding: 25px;
          text-align: center;
          overflow: hidden;
          margin: 0;
          box-sizing: border-box;
        }

        h2 { margin-bottom: 10px; }

        #status {
          color: #666;
          font-size: 14px;
        }

        .progress-container {
          width: 100%;
          height: 12px;
          background: #e5e5e5;
          border-radius: 10px;
          margin-top: 25px;
          overflow: hidden;
        }

        #progress {
          width: 0%;
          height: 100%;
          background: #2563eb;
          transition: width 0.2s;
        }

        #details {
          margin-top: 15px;
          font-size: 13px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <h2>Downloading Update</h2>
      <div id="status">Please wait while we download the latest version.</div>

      <div class="progress-container">
        <div id="progress"></div>
      </div>

      <div id="details">Starting download...</div>
    </body>
    </html>
  `;

  updateProgressWindow.loadURL(
    "data:text/html;charset=utf-8," + encodeURIComponent(html),
  );

  updateProgressWindow.on("closed", () => {
    updateProgressWindow = null;
  });
}

function closeUpdateProgressWindow() {
  if (updateProgressWindow && !updateProgressWindow.isDestroyed()) {
    updateProgressWindow.close();
  }

  updateProgressWindow = null;
}

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
        createUpdateProgressWindow();
        await autoUpdater.downloadUpdate();
      } catch (error) {
        closeUpdateProgressWindow();
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
    const percent = Math.round(progress.percent);

    const transferred = (progress.transferred / (1024 * 1024)).toFixed(2);

    const total = (progress.total / (1024 * 1024)).toFixed(2);

    if (updateProgressWindow && !updateProgressWindow.isDestroyed()) {
      updateProgressWindow.webContents
        .executeJavaScript(
          `
        document.getElementById("progress").style.width = "${percent}%";
        document.getElementById("status").innerText =
          "Downloading update... ${percent}%";
        document.getElementById("details").innerText =
          "${transferred} MB / ${total} MB downloaded";
      `,
        )
        .catch(console.error);
    }
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
    if (app.isPackaged) {
      //Installed desktop app: load its bundled frontend
      await mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
    } else {
      await mainWindow.loadURL("http://localhost:5173");
    }
  } catch (error) {
    console.error("Application loading failed:", error);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }

    await dialog.showMessageBox({
      type: "error",
      title: "Application Loading Error",
      message: "Unable to load the Hotel Management Application.",
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
