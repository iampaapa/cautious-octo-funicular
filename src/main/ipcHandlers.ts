import fs from 'node:fs'
import { Question } from '../renderer/src/features/quiz/types'
import { ipcMain } from 'electron'
import database from '../../build/data.db?asset'
import generateAudio from './generateAudio?modulePath'
import { Worker } from 'node:worker_threads'

ipcMain.handle('get-questions', async (_event, args) => {
  const initSqlJs = require('sql.js')

  const { subject, questionType, numberOfQuestions } = args

  const SQL = await initSqlJs({
    locateFile: (file: string) => `./node_modules/sql.js/dist/${file}`
  })

  const data = fs.readFileSync(database)
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

    const stmt = db.prepare(query, {
      ':subject': subject,
      ':questionType': questionType,
      ':limit': numberOfQuestions
    })
    const result: Question[] = []

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

ipcMain.handle('generate-audio', async (_event, { text }) => {
  const worker = new Worker(generateAudio)

  worker.postMessage(text)

  return new Promise((resolve, reject) => {
    worker.on('message', () => {
      resolve(true)
    })

    worker.on('error', () => {
      reject(false)
    })
  })
})
