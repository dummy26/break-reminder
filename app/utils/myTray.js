const { Tray, Menu } = require('electron')

class myTray extends Tray {
    constructor(iconPath, createSettingsWindow) {
        super(iconPath)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Settings',
                click() {
                    createSettingsWindow()
                }
            }
        ])

        this.setToolTip('Break-Reminder')
        this.setContextMenu(contextMenu)
    }
}

module.exports = myTray