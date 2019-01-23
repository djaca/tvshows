'use strict'
import { app, BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'

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

let subtitlesFolder = `${app.getPath('downloads')}/TVShows/subtitles`

ipcMain.on('download-subtitle', (e, payload) => {
  download(BrowserWindow.getFocusedWindow(), payload.url, {
    directory: subtitlesFolder,
    onStarted: item => {
      // check if file exists...
      let fs = require('fs')

      fs.readdir(subtitlesFolder, (err, files) => {
        if (!err) {
          files.forEach(file => {
            if (file === item.getFilename()) {
              mainWindow.webContents.send('subtitle-downloaded', { ...payload, path: `${subtitlesFolder}/${file}` })

              item.cancel()
            }
          })
        }
      })
    }
  })
    .then(dl => {
      mainWindow.webContents.send('subtitle-downloaded', { ...payload, path: dl.getSavePath() })
    })
    .catch(err => {
      mainWindow.webContents.send('download-subtitle-error', err)
    })
})
