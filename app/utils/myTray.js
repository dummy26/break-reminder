const { Tray, Menu } = require('electron')

class myTray extends Tray {
    constructor(iconPath, createSettingsWindow, mainWindow) {
        super(iconPath)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Settings',
                click: () => {
                    createSettingsWindow()
                }
            },
            {
                label: 'Exit',
                role: 'quit'
            },
            {
                label: 'Pause',
                type: 'checkbox',
                click: e => {
                    mainWindow.webContents.send('pause-breaks', e.checked)
                }
            }
        ])

        this.setToolTip('Break-Reminder')
        this.setContextMenu(contextMenu)
    }
}

module.exports = myTray