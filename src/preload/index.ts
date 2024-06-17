import * as Electron from 'electron'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Question } from '../renderer/src/features/quiz/types'

export interface API {
  generateAudio(text: string): Promise<void>

  getQuestions(subject: string, limit: number, questionType: number): Promise<Question[]>

  invoke(...args: Parameters<typeof ipcRenderer.invoke>): Promise<unknown>

  judgeAnswer(answer: string, question: string, rightAnswer: string): void

  off(...args: Parameters<typeof ipcRenderer.off>): Electron.IpcRenderer

  on(...args: Parameters<typeof ipcRenderer.on>): Electron.IpcRenderer

  onJudgeAnswerComplete: (callback: (score: number) => void) => void

  onTranscriptionComplete: (callback: (text: string) => void) => void

  send(...args: Parameters<typeof ipcRenderer.send>): void

  startRecording(): void

  stopRecording(): void
}

// Custom APIs for renderer
const api: API = {
  onJudgeAnswerComplete: (callback: (score: number) => void) => {
    ipcRenderer.on('judge-answer-complete', (_event, score: number) => {
      callback(score)
    })
  },

  judgeAnswer(answer: string, question: string, rightAnswer: string): void {
    ipcRenderer.send('judge-answer', { answer, question, rightAnswer })
  },

  onTranscriptionComplete: (callback: (text: string) => void) =>
    ipcRenderer.on('transcription-complete', (_event, text: string) => {
      callback(text)
    }),

  startRecording(): void {
    ipcRenderer.send('start-recording')
  },
  stopRecording() {
    ipcRenderer.send('stop-recording')
  },
  generateAudio(text: string): Promise<void> {
    return ipcRenderer.invoke('generate-audio', { text })
  },
  getQuestions(subject: string, limit: number, questionType: number) {
    return ipcRenderer.invoke('get-questions', {
      subject: subject,
      numberOfQuestions: limit,
      questionType: questionType
    })
  },
  on(...args: Parameters<typeof ipcRenderer.on>): Electron.IpcRenderer {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>): Electron.IpcRenderer {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>): void {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>): Promise<unknown> {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
