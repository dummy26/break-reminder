const electron = require('electron')
const { ipcRenderer } = electron

const microRepeatInterval = document.querySelector(('input[ name="microRepeatInterval"]'))
const normalRepeatInterval = document.querySelector(('input[ name="normalRepeatInterval"]'))

const microBreakTime = document.querySelector(('input[ name="microBreakTime"]'))
const normalBreakTime = document.querySelector(('input[ name="normalBreakTime"]'))

const saveBtn = document.querySelector('#saveBtn')

saveBtn.addEventListener('click', () => {
    ipcRenderer.send('settings',
        {
            'microRepeatInterval': Number(microRepeatInterval.value), 'normalRepeatInterval': Number(normalRepeatInterval.value),
            'microBreakTime': Number(microBreakTime.value), 'normalBreakTime': Number(normalBreakTime.value)
        })
})