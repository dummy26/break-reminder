const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')

let mainWindow, settingsWindow
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
        }
    })

    settingsWindow.loadFile('settings.html')

    settingsWindow.on('closed', () => { settingsWindow = null })

}

ipcMain.on('settings', (e, data) => {
    mainWindow.webContents.send('settings', data)
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
