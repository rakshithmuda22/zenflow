const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path')

let mainWindow = null
let miniWindow = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 860,
    minWidth: 380,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0A0A0F',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
    if (miniWindow) {
      miniWindow.close()
      miniWindow = null
    }
  })
}

function createMiniWindow() {
  if (miniWindow) {
    miniWindow.focus()
    return
  }

  const { width: screenW } = screen.getPrimaryDisplay().workAreaSize

  miniWindow = new BrowserWindow({
    width: 280,
    height: 200,
    x: screenW - 300,
    y: 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  miniWindow.loadFile(path.join(__dirname, 'mini-timer.html'))
  miniWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  miniWindow.on('closed', () => {
    miniWindow = null
    if (mainWindow) {
      mainWindow.webContents.send('mini-closed')
    }
  })
}

function closeMiniWindow() {
  if (miniWindow) {
    miniWindow.close()
    miniWindow = null
  }
}

// IPC handlers
ipcMain.on('open-mini', () => createMiniWindow())
ipcMain.on('close-mini', () => closeMiniWindow())
ipcMain.on('toggle-mini', () => {
  if (miniWindow) closeMiniWindow()
  else createMiniWindow()
})

ipcMain.on('timer-state', (_event, state) => {
  if (miniWindow && !miniWindow.isDestroyed()) {
    miniWindow.webContents.send('timer-state', state)
  }
})

ipcMain.on('resize-mini', (_event, { width, height }) => {
  if (miniWindow && !miniWindow.isDestroyed()) {
    miniWindow.setSize(width, height, true)
  }
})

app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (!mainWindow) createMainWindow()
})
