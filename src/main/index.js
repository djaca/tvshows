'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
const {download} = require('electron-dl')

ipcMain.on('download-subtitle', (e, {url, showId, season, episode}) => {
  download(BrowserWindow.getFocusedWindow(), url, {
    directory: `${app.getPath('downloads')}/TVShows/subtitles`,
    onStarted: item => {
      // check if file exists...
    }
  })
    .then(dl => {
      mainWindow.webContents.send('subtitle-downloaded', {
        showId,
        season,
        episode,
        path: dl.getSavePath()
      })
    })
    .catch(err => {
      mainWindow.webContents.send('download-subtitle-error', err)
    })
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
