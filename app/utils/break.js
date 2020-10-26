class Break {
    constructor(name, breakTime, repeatInterval, postponeTime, incrementPeriod) {
        this.name = name
        //time period of break
        this.breakTime = breakTime
        //time between two breaks
        this.repeatInterval = repeatInterval
        //postponeTime has to be atleast equal to BreakTime so that call to toggleDisplay finishes
        this.postponeTime = postponeTime
        //value by which progress bar width will be incremented
        this.incrementValue = incrementPeriod / breakTime * 100
        //audio to play at break end
        this.audio = new Audio('./assets/audio/1.mp3')
    }

    start() {
        setTimeout(() => {
            toggleDisplay(this)
            this.timer = setInterval(() => { toggleDisplay(this) }, this.repeatInterval + this.breakTime)
        }, this.repeatInterval)
    }

    stop() {
        clearInterval(this.timer)
    }

    setAudioTimer() {
        this.audioTimer = setTimeout(() => { this.playSound() }, this.breakTime - 300)
    }

    clearAudioTimer() {
        clearTimeout(this.audioTimer)
    }

    playSound() {
        if (this.audio.paused) this.audio.play()
    }

    stopSound() {
        this.audio.pause()
        this.audio.currentTime = 0
    }

    setHideTimer(body) {
        setTimeout(() => { this.hide(body) }, this.breakTime)
    }

    hide(body) {
        body.style.opacity = 0
        win.setIgnoreMouseEvents(true)
        this.stopSound()
    }
}

module.exports = Break