const electron = require('electron')
const { remote, ipcRenderer } = electron
const Break = require('./utils/break.js')

const win = remote.getCurrentWindow()

const body = document.body
const heading = document.querySelector('.heading h2')
const bar = document.querySelector('#bar')
const timeLeft = document.querySelector('.timeLeft')
const stopBtn = document.querySelector('#stopBtn')
const postponeBtn = document.querySelector('#postponeBtn')
const settingsStore = remote.getGlobal('settingsStore')

const incrementPeriod = 50

let breakTime = settingsStore.get('microBreakTime') * 1000
let repeatInterval = settingsStore.get('microRepeatInterval') * 1000 * 60
let postponeTime = breakTime
let microBreak = new Break('micro', breakTime, repeatInterval, postponeTime, incrementPeriod)

breakTime = settingsStore.get('normalBreakTime') * 1000
repeatInterval = settingsStore.get('normalRepeatInterval') * 1000 * 60
postponeTime = breakTime
let normalBreak = new Break('normal', breakTime, repeatInterval, postponeTime, incrementPeriod)

win.setIgnoreMouseEvents(true)

stopBtn.addEventListener('click', () => {
    //TODO - figure out which one to run (Can figure out using heading.html)
    microBreak.hide(body)
    normalBreak.hide(body)

    microBreak.clearAudioTimer()
    normalBreak.clearAudioTimer()
})

ipcRenderer.on('stop-break', () => { stopBtn.click() })

ipcRenderer.on('pause-breaks', (e, value) => {
    if (value) {
        microBreak.stop()
        normalBreak.stop()
    }
    else {
        microBreak.start()
        normalBreak.start()
    }
})

ipcRenderer.on('settings', (e, data) => {
    microBreak.stop()
    normalBreak.stop()

    repeatInterval = data['microRepeatInterval'] * 1000 * 60
    breakTime = data['microBreakTime'] * 1000
    postponeTime = breakTime
    microBreak = new Break('micro', breakTime, repeatInterval, postponeTime, incrementPeriod)

    repeatInterval = data['normalRepeatInterval'] * 1000 * 60
    breakTime = data['normalBreakTime'] * 1000
    postponeTime = breakTime
    normalBreak = new Break('normal', breakTime, repeatInterval, postponeTime, incrementPeriod)

    microBreak.start()
    normalBreak.start()
})

/*
first hide
then clear previous setInterval
after postponeTime, show the reminder and set up new setInterval 
*/
// postponeBtn.addEventListener('click', () => {
//     hide()
//     clearInterval(toggleDisplayId)

//     setTimeout(() => {
//         toggleDisplay()
//         toggleDisplayId = setInterval(toggleDisplay, repeatInterval + breakTime)
//     }, postponeTime)
// })

let t = 0
let microCount = -microBreak.breakTime

function toggleDisplay(Break) {
    const { name, breakTime, incrementValue } = Break

    if (name == 'micro') {
        microCount += microBreak.repeatInterval + microBreak.breakTime

        if (microCount - (normalBreak.repeatInterval + (normalBreak.repeatInterval + normalBreak.breakTime) * t) >
            (normalBreak.repeatInterval - microBreak.repeatInterval))
            t += 1

        if (check_overlap(microCount) || check_overlap(microCount + microBreak.breakTime)) return

        heading.innerHTML = 'Micro Break'
    }
    else heading.innerHTML = 'Normal Break'

    body.style.opacity = 1
    win.setIgnoreMouseEvents(false)

    let i = 0
    let width = 0
    let id = setInterval(frame, incrementPeriod)

    function frame() {
        //updating value of time left every second
        if (i % 1000 == 0)
            timeLeft.innerHTML = ((breakTime - i) / 1000) + 's'

        //updating progress bar width
        if (width >= 100) clearInterval(id)
        else {
            width += incrementValue
            bar.value = width
        }

        i += incrementPeriod
    }

    Break.setHideTimer(body)
    Break.setAudioTimer()
}

microBreak.start()
normalBreak.start()

//check if time is equal to or in b/w start and end of normal break
function check_overlap(time) {
    return (time >= (normalBreak.repeatInterval + (normalBreak.repeatInterval + normalBreak.breakTime) * t) &&
        time <= normalBreak.repeatInterval + (normalBreak.repeatInterval + normalBreak.breakTime) * t +
        normalBreak.breakTime)
}
