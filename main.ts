import * as path from "path";
import * as url from "url";

import { app, Tray, BrowserWindow, Menu, dialog, ipcMain } from "electron";
import { PythonShell } from "python-shell";

import * as PKG from "./package.json";

const DEV = process.argv.includes("--dev");
const SHELL = new PythonShell(
	app.isPackaged ? path.resolve(process.resourcesPath, "main.pyz") : "main.py",
	{
		mode: "json",
		pythonOptions: [ "-u" ],
		stderrParser: (line) => JSON.stringify(line),
	},
);
let INDICATOR: Tray = null;
let MAIN_WINDOW: BrowserWindow = null;
let PANEL_THEME = "dark";


function getAsset(assetPath: string): string {
	return path.resolve(app.getAppPath(), app.isPackaged ? "dist/angular/assets" : "src/assets", assetPath);
}


function createIndicator(): Tray {
	const menu = Menu.buildFromTemplate([
		{ id: "palette", label: "Palette", click() {
			const route = new url.URL(MAIN_WINDOW.webContents.getURL()).pathname.split("/");
			if (route.includes("category")) {
				if (MAIN_WINDOW.isVisible()) {
					MAIN_WINDOW.hide();
				} else {
					MAIN_WINDOW.show();
					MAIN_WINDOW.setAlwaysOnTop(true);
				}
			} else {
				if (MAIN_WINDOW.isVisible()) {
					MAIN_WINDOW.hide();
				} else {
					MAIN_WINDOW.webContents.send("navigate", "category");
					MAIN_WINDOW.show();
					MAIN_WINDOW.setAlwaysOnTop(true);
				}
			}
		} },
		{ id: "search", label: "Search", click() {
			const route = new url.URL(MAIN_WINDOW.webContents.getURL()).pathname.split("/");
			if (route.includes("search")) {
				if (MAIN_WINDOW.isVisible()) {
					MAIN_WINDOW.hide();
				} else {
					MAIN_WINDOW.show();
					MAIN_WINDOW.setAlwaysOnTop(true);
				}
			} else {
				MAIN_WINDOW.webContents.send("navigate", "search");
				MAIN_WINDOW.show();
				MAIN_WINDOW.setAlwaysOnTop(true);
			}
		} },
		{ id: "prefs", label: "Preferences", click() {
			MAIN_WINDOW.webContents.send("navigate", "settings");
			MAIN_WINDOW.show();
			MAIN_WINDOW.setAlwaysOnTop(true);
		} },
		{ id: "about", label: "About", click() { app.showAboutPanel(); } },
		{ id: "quit", label: "Quit", role: "quit" },
	]);
	INDICATOR = new Tray(getAsset(`icons/icon-${PANEL_THEME}-16.png`));
	INDICATOR.setContextMenu(menu);
	return INDICATOR;
}


<<<<<<< HEAD
	// Create the browser window.
	win = new BrowserWindow({
		x: 0,
		y: 0,
		width: 800,
		height: 600,
		frame: false
=======
function createWindow(): BrowserWindow {

	MAIN_WINDOW = new BrowserWindow({
		width: 490,
		height: 330,
		useContentSize: true,
		center: true,
		maximizable: false,
		// focusable: false,  // setFocusable NOT IMPLEMENTED ON LINUX
		// alwaysOnTop: true,  // ALSO NOT IMPLEMENTED ON LINUX
		fullscreenable: false,
		title: PKG.name.split("-").map((w) => w.slice(0, 1).toUpperCase() + w.slice(1)).join(" "),
		icon: getAsset("icons/icon-48.png"),
		show: false,
		frame: false,
		// backgroundColor: "",  // TODO Theming
		webPreferences: {
			nodeIntegration: true,
			preload: path.resolve(app.getAppPath(), "preload.js"),
			allowRunningInsecureContent: (DEV) ? true : false,
		},
>>>>>>> -
	});

	if (DEV) {
		require('electron-reload')(app.getAppPath(), {
			electron: require(`${app.getAppPath()}/node_modules/electron`)
		});
		MAIN_WINDOW.loadURL('http://localhost:4200');
	} else {
		MAIN_WINDOW.loadURL(url.format({
			pathname: getAsset("../index.html"),
			protocol: 'file:',
			slashes: true,
		}));
	}

<<<<<<< HEAD
	win.webContents.openDevTools();
=======
	if (DEV) {
		MAIN_WINDOW.webContents.openDevTools();
	}
>>>>>>> -

	MAIN_WINDOW.on("ready-to-show", () => {
		// MAIN_WINDOW.show();
		// MAIN_WINDOW.setAlwaysOnTop(true);
		MAIN_WINDOW.webContents.send("indicator", null);
	});

  return MAIN_WINDOW;
}


app.setAboutPanelOptions({
	applicationName: PKG.name.split("-").map((w) => w.slice(0, 1).toUpperCase() + w.slice(1)).join(" "),
	applicationVersion: PKG.version,
	copyright: PKG.license,
	version: PKG.version,
	credits: `${PKG.author.name} <${PKG.author.email}>`,
	authors: [`${PKG.author.name} <${PKG.author.email}>`],
	website: PKG.homepage,
	iconPath: getAsset("icons/icon.svg"),
});
app.on("ready", () => {
	createIndicator();
	createWindow();
});
app.on("before-quit", () => {
	SHELL.end((err, code, signal) => {
		if (!err) {
			console.log(`PYTHON EXITED ${code} SIGNAL ${signal}`);
		} else {
			console.error(`PYTHON THREW ERRORS ${err} CODE ${code} SIGNAL ${signal}`);
		}
	}).terminate();
});
ipcMain.handle("main_window", (event) => MAIN_WINDOW.id);
ipcMain.on("python", (event, msg) => {
	SHELL.send(msg);
});
ipcMain.on("indicator", (event, theme) => {
	INDICATOR.setImage(`src/assets/icons/icon-${theme}-48.png`);
});
SHELL.on("message", (msg) => {
	if (MAIN_WINDOW) {
		if (msg.action === "typed") {
			MAIN_WINDOW.show();
			MAIN_WINDOW.setAlwaysOnTop(true);
		} else if (msg.action === "recent") {
			MAIN_WINDOW.webContents.send("recent", msg);
		}
	}
});
SHELL.on("stderr", (err) => {
	if (err.error && err.msg && err.traceback) {
		dialog.showErrorBox(err.error, `${err.msg}\n\n${err.traceback}`);
	} else {
		dialog.showErrorBox("Uncaught exception!!!", err);
	}
});
SHELL.on("error", (err) => {
	dialog.showErrorBox("Python crashed -- Please restart", err);
});
