const { app, BrowserWindow, shell, session } = require("electron");
const path = require("path");
const config = require("./config.json");

// FIR_ANALYZER_URL overrides the bundled URL (e.g. to point at a local `npm run dev`).
const APP_URL = process.env.FIR_ANALYZER_URL || config.appUrl;
const APP_ORIGIN = new URL(APP_URL).origin;

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "FIR Analyzer",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true },
  });

  // The site uses the microphone (voice dictation) — allow it only for our own origin.
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback, details) => {
    const fromApp = (details.requestingUrl || "").startsWith(APP_ORIGIN);
    callback(fromApp && ["media", "geolocation", "clipboard-sanitized-write"].includes(permission));
  });

  // Links to other sites open in the normal browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_ORIGIN)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.webContents.on("did-fail-load", (_e, code, desc, url, isMainFrame) => {
    if (!isMainFrame || code === -3) return; // -3 = aborted navigation
    win.loadFile(path.join(__dirname, "offline.html"), { query: { url: APP_URL, error: desc } });
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
