import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as fs from 'node:fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const initSqlJs = require('sql.js')

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

async function createWindow() {
  win = new BrowserWindow({
    icon: path.join(
      process.env.VITE_PUBLIC,
      '/Users/paapakwesiquansah/Desktop/electron/work/electron-vite-project/public/icon-app.png'
    ),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true, // Ensure Node integration
      contextIsolation: false, // Disable context isolation
      nodeIntegrationInWorker: true
    }
  })

  ipcMain.handle('get-questions', async (_event, args) => {
    const { subject, questionType, numberOfQuestions } = args

    const SQL = await initSqlJs({
      locateFile: (file: string) => `./node_modules/sql.js/dist/${file}`
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
    })
    const data = fs.readFileSync('./electron/data.db')
    const db = new SQL.Database(data)

    try {
      const query = `
          SELECT *
          FROM questions
          WHERE subject = :subject
            AND question_type = :questionType
          ORDER BY random()
          LIMIT :limit;
      `

      const stmt = await db.prepare(query, {
        ':subject': subject,
        ':questionType': questionType,
        ':limit': numberOfQuestions
      })
      const result = []

      while (stmt.step()) {
        const row = stmt.getAsObject()
        result.push(row)
      }

      stmt.free()

      return result
    } catch (error) {
      console.error('Error fetching questions:', error)
      return [] // Return an empty array on error
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Open DevTools for debugging
  win.webContents.openDevTools()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)