import { ipcRenderer } from 'electron'

export const getQuestions = async (subject: string, limit: number, questionType: number) => {
  return await ipcRenderer.invoke('get-questions', {
    subject: subject,
    numberOfQuestions: limit,
    questionType: questionType
  })
}