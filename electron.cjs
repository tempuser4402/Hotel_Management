const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

const WEBSITE_URL = "https://hotel-management-khaki-three.vercel.app/";

async function checkInternetConnection() {
  try {
    const response = await fetch(WEBSITE_URL, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking internet connection:", error.message);
    return false;
  }
}

async function createWindow() {
  const isConnected = await checkInternetConnection();

  if (!isConnected) {
    const result = await dialog.showMessageBox({
      type: "warning",
      title: "No Internet Connection",
      message: "Internet Connection is unavailable",
      detail: "Please connect to the internet and try again",
      buttons: ["retry", "Exit"],
      defaultId: 0,
    });

    if (result.response === 0) {
      return createWindow();
    }

    app.quit();
    return;
  }

  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    maximizable: true,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // win.loadURL("http://localhost:5173");
    win.loadURL("https://hotel-management-khaki-three.vercel.app/");
    win.maximize();
    win.show();
  } else {
    win.loadFile(path.join(__dirname, "../build/index.html"));
  }
}

// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
