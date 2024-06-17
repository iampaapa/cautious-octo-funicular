import fs from 'node:fs'
import { Question } from '../renderer/src/features/quiz/types'
import { ipcMain } from 'electron'
import database from '../../build/data.db?asset'
import generateAudio from './generateAudio?modulePath'
import inference from './ollama/useOllama.js?modulePath'
import startRecording from './stt_online?modulePath'
import { Worker } from 'node:worker_threads'

import { mainWindow } from './index'

const recorderWorker = new Worker(startRecording)
const inferenceWorker = new Worker(inference)

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

let text = ''

ipcMain.on('start-recording', () => {
  recorderWorker.postMessage('start')

  recorderWorker.on('message', (message) => {
    text = message
  })

  ipcMain.on('stop-recording', () => {
    mainWindow.webContents.send('transcription-complete', text)
    recorderWorker.postMessage('stop')
  })
})

ipcMain.on('judge-answer', async (_event, args) => {
  const { answer, question, rightAnswer } = args

  const jsonInput = {
    question: question,
    true_answer: rightAnswer,
    student_answer: answer,
    leniency_level: 3,
    partial_marks: true,
    max_marks: 3
  }

  inferenceWorker.postMessage(jsonInput)

  inferenceWorker.on('message', (message: string) => {
    message = message.replace('```json\n', '').replace('```', '')
    const messageParsed = JSON.parse(message)
    mainWindow.webContents.send('judge-answer-complete', messageParsed.marks_given)
  })
})
