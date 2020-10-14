// const { remote } = require('electron')
// const win = remote.getCurrentWindow()

const { BrowserWindow } = require('electron').remote
const win = BrowserWindow.getAllWindows()[0]

const body = document.body
body.style.opacity = 1
setInterval(toggleDisplay, 3000)

let displayOn = true
function toggleDisplay() {
    if (displayOn) {
        body.style.opacity = 0
        body.style.background = 'transparent'
        win.setIgnoreMouseEvents(true)
    }
    else {
        body.style.opacity = 1
        body.style.background = 'rgb(216, 216, 216)'
        win.setIgnoreMouseEvents(false)
    }
    displayOn = !displayOn
}