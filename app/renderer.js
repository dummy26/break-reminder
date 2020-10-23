const electron = require('electron')
const { remote, ipcRenderer } = electron
const win = remote.getCurrentWindow()

const body = document.body
const heading = document.querySelector('.heading h2')
const bar = document.querySelector('#bar')
const timeLeft = document.querySelector('.timeLeft')
const stopBtn = document.querySelector('#stopBtn')
const postponeBtn = document.querySelector('#postponeBtn')
const settingsStore = remote.getGlobal('settingsStore')

const audio = new Audio('./assets/audio/1.mp3')

const incrementPeriod = 50

//time period of break
let microBreakTime = settingsStore.get('microBreakTime') * 1000
//time between two reminders
let microRepeatInterval = settingsStore.get('microRepeatInterval') * 1000 * 60
//postponeTime has to be atleast equal to BreakTime so that call to toggleDisplay finishes
let microPostponeTime = microBreakTime
//value by which progress bar width will be incremented
let microIncrementValue = incrementPeriod / microBreakTime * 100

const microBreak = { name: 'micro', breakTime: microBreakTime, repeatInterval: microRepeatInterval, postponeTime: microPostponeTime, incrementValue: microIncrementValue }


let normalBreakTime = settingsStore.get('normalBreakTime') * 1000
let normalRepeatInterval = settingsStore.get('normalRepeatInterval') * 1000 * 60
let normalPostponeTime = normalBreakTime
let normalIncrementValue = incrementPeriod / normalBreakTime * 100

const normalBreak = { name: 'normal', breakTime: normalBreakTime, repeatInterval: normalRepeatInterval, postponeTime: normalPostponeTime, incrementValue: normalIncrementValue }

let microSetIntervalId, normalSetIntervalId

win.setIgnoreMouseEvents(true)

stopBtn.addEventListener('click', hide)

// ipcRenderer.on('settings', (e, data) => {
//     //data['microRepeatInterval'] is in minutes so multiply by 60
//     repeatInterval = data['microRepeatInterval'] * 1000 // *60
//     breakTime = data['microBreakTime'] * 1000
//     incrementValue = incrementPeriod / breakTime * 100
//     postponeTime = breakTime

//     clearInterval(toggleDisplayId)

//     setTimeout(() => {
//         toggleDisplay()
//         toggleDisplayId = setInterval(toggleDisplay, repeatInterval + breakTime)
//     }, repeatInterval)
// })

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
let microCount = -microBreakTime

function toggleDisplay(breakObj) {
    const { breakTime, incrementValue, name } = breakObj

    if (name == 'micro') {
        microCount += microRepeatInterval + microBreakTime

        if (microCount - (normalRepeatInterval + (normalRepeatInterval + normalBreakTime) * t) >
            (normalRepeatInterval - microRepeatInterval))
            t += 1

        if (check_overlap(microCount) || check_overlap(microCount + microBreakTime)) return

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

    setTimeout(playSound, breakTime - 500)
    setTimeout(hide, breakTime)
}


setMicroInterval()
setNormalInterval()


function playSound() {
    if (audio.paused) audio.play()
}

function hide() {
    body.style.opacity = 0
    win.setIgnoreMouseEvents(true)
    audio.pause()
    audio.currentTime = 0
}

function setMicroInterval() {
    setTimeout(() => {
        toggleDisplay(microBreak)
        microSetIntervalId = setInterval(() => { toggleDisplay(microBreak) }, microRepeatInterval + microBreakTime)
    }, microRepeatInterval)
}

function setNormalInterval() {
    setTimeout(() => {
        toggleDisplay(normalBreak)
        normalSetIntervalId = setInterval(() => { toggleDisplay(normalBreak) }, normalRepeatInterval + normalBreakTime)
    }, normalRepeatInterval)
}

//check if time is equal to or in b/w start and end of normal break
function check_overlap(time) {
    return (time >= (normalRepeatInterval + (normalRepeatInterval + normalBreakTime) * t) &&
        time <= normalRepeatInterval + (normalRepeatInterval + normalBreakTime) * t + normalBreakTime)
}
