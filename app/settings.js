const electron = require('electron')
const { remote } = electron
const { ipcRenderer } = electron

const settingsStore = remote.getGlobal('settingsStore')

const microRepeatInterval = document.querySelector(('input[ name="microRepeatInterval"]'))
const normalRepeatInterval = document.querySelector(('input[ name="normalRepeatInterval"]'))

microRepeatInterval.value = settingsStore.get('microRepeatInterval')
normalRepeatInterval.value = settingsStore.get('normalRepeatInterval')

const microBreakTime = document.querySelector(('input[ name="microBreakTime"]'))
const normalBreakTime = document.querySelector(('input[ name="normalBreakTime"]'))

microBreakTime.value = settingsStore.get('microBreakTime')
normalBreakTime.value = settingsStore.get('normalBreakTime')

const saveBtn = document.querySelector('#saveBtn')

saveBtn.addEventListener('click', () => {
    ipcRenderer.send('settings',
        {
            'microRepeatInterval': Number(microRepeatInterval.value), 'normalRepeatInterval': Number(normalRepeatInterval.value),
            'microBreakTime': Number(microBreakTime.value), 'normalBreakTime': Number(normalBreakTime.value)
        })
})