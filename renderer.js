const { BrowserWindow } = require('electron').remote
const win = BrowserWindow.getAllWindows()[0]

const body = document.body
const bar = document.querySelector('#bar');
const timeLeft = document.querySelector('.timeLeft')
const stopBtn = document.querySelector('#stopBtn')
const postponeBtn = document.querySelector('#postponeBtn')

//time period of break
const breakTime = 5000
//time between two reminders
const repeatInterval = 10000
//postponeTime has to be atleast equal to breakTime so that call to toggleDisplay finishes
const postponeTime = breakTime
//ms after which progress bar will be updated
const incrementPeriod = 50
//value by which progress bar width will be incremented
const incrementValue = breakTime / incrementPeriod / 100

let toggleDisplayId

timeLeft.innerHTML = (breakTime / 1000) + 's'

win.setIgnoreMouseEvents(true)

stopBtn.addEventListener('click', hide)

/*
first hide
then clear previous setInterval
after postponeTime, show the reminder and set up new setInterval 
*/
postponeBtn.addEventListener('click', () => {
    hide()
    clearInterval(toggleDisplayId)

    setTimeout(() => {
        toggleDisplay()
        toggleDisplayId = setInterval(toggleDisplay, repeatInterval + breakTime)
    }, postponeTime)
})

function hide() {
    body.style.opacity = 0
    body.style.background = 'transparent'
    win.setIgnoreMouseEvents(true)
}

function toggleDisplay() {

    body.style.opacity = 1
    body.style.background = 'rgb(216, 216, 216)'
    win.setIgnoreMouseEvents(false)

    let i = 0
    let width = 0
    let id = setInterval(frame, incrementPeriod)

    function frame() {
        //updating value of time left every second
        if (i % 1000 == 0)
            timeLeft.innerHTML = ((breakTime - i) / 1000) + 's'

        //updating progress bar width
        if (width >= 100) {
            clearInterval(id)
        } else {
            width += incrementValue;
            bar.style.width = width + "%"
        }

        i += incrementPeriod
    }

    setTimeout(hide, breakTime)
}

toggleDisplayId = setInterval(toggleDisplay, repeatInterval + breakTime)