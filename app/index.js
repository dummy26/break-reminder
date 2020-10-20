const { app, BrowserWindow, ipcMain } = require('electron')
const myTray = require('./utils/myTray')
const Store = require('./utils/store.js');

let mainWindow, settingsWindow

const settingsStore = new Store({
    configName: 'user-preferences',
    defaults: {
        microRepeatInterval: 10,
        microBreakTime: 10,
        normalRepeatInterval: 30,
        normalBreakTime: 60
    }
})

global.settingsStore = settingsStore

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 350,
        height: 280,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        title: 'Break-Reminder',
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile(`${__dirname}/index.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 500,
        height: 500,
        title: 'Settings',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    settingsWindow.loadFile(`${__dirname}/settings.html`)

    settingsWindow.on('closed', () => { settingsWindow = null })

}

ipcMain.on('settings', (e, data) => {
    mainWindow.webContents.send('settings', data)
    for (const [key, value] of Object.entries(data)) {
        settingsStore.set(key, value)
    }
    settingsWindow.close()
})

let tray
app.whenReady().then(() => {
    createWindow()
    tray = new myTray(`${__dirname}/assets/images/icon.png`, createSettingsWindow)

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
