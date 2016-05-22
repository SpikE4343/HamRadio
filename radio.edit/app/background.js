// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow;

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: 1280,
        height: 768
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');
    mainWindow.on('close', function () {
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
