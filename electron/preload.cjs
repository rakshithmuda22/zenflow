const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('zenflowElectron', {
  toggleMini: () => ipcRenderer.send('toggle-mini'),
  openMini: () => ipcRenderer.send('open-mini'),
  closeMini: () => ipcRenderer.send('close-mini'),
  sendTimerState: (state) => ipcRenderer.send('timer-state', state),
  resizeMini: (width, height) => ipcRenderer.send('resize-mini', { width, height }),
  onTimerState: (cb) => {
    ipcRenderer.on('timer-state', (_e, state) => cb(state))
  },
  onMiniClosed: (cb) => {
    ipcRenderer.on('mini-closed', () => cb())
  },
  isElectron: true,
})
