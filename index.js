const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')

const Store = require('./store.js');

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
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
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

    settingsWindow.loadFile('settings.html')

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
    tray = new Tray('./icon.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Settings',
            click() {
                createSettingsWindow()
            }
        }
    ])
    tray.setToolTip('Break-Reminder')
    tray.setContextMenu(contextMenu)

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
