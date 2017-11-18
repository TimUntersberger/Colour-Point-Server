const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let window;
const createWindow = function() {
    window = new BrowserWindow({
        width: 310,
        height: 383,
        resizable: false,
        frame: false,
        transparent: true
    });
    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    if (process.env.NODE_ENV === "dev") window.webContents.openDevTools();
};
app.on("ready", createWindow);
