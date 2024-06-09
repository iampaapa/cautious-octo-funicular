import { ipcRenderer } from 'electron'
import type { QuizSettings } from '@/features/quiz/types'
import { v4 as uuidv4 } from 'uuid'
import { UserQuiz } from '@/types/types'

export const getQuestions = async (subject: string, limit: number, questionType: number) => {
  return await ipcRenderer.invoke('get-questions', {
    subject: subject,
    numberOfQuestions: limit,
    questionType: questionType
  })
}

export const saveSettings = (quizSettings: QuizSettings) => {
  const quizTypes = localStorage.getItem('quizTypes')

  let quizTypesParsed: QuizSettings[] = []

  if (quizTypes) {
    try {
      quizTypesParsed = JSON.parse(quizTypes)
    } catch (error) {
      console.error('Error parsing quiz types:', error)
    }
  }

  if (quizTypesParsed.find((quiz) => quiz.id === quizSettings.id)) {
    quizTypesParsed = quizTypesParsed.map((quiz) => (quiz.id === quizSettings.id ? quizSettings : quiz))
  } else {
    quizTypesParsed.push(quizSettings)
  }

  const updatedQuizTypes = JSON.stringify(quizTypesParsed)

  localStorage.setItem('quizTypes', updatedQuizTypes)
}

export const deleteQuizSetting = (id: string) => {
  const quizTypes = localStorage.getItem('quizTypes')

  let quizTypesParsed: QuizSettings[] = []

  if (quizTypes) {
    try {
      quizTypesParsed = JSON.parse(quizTypes)
    } catch (error) {
      console.error('Error parsing quiz types:', error)
    }
  }

  const indexOfQuiz = quizTypesParsed.findIndex((quiz) => quiz.id === id)

  quizTypesParsed.splice(indexOfQuiz, 1)
  localStorage.setItem('quizTypes', JSON.stringify(quizTypesParsed))
}

/**
 * Starts a new quiz and stores it in the user's localStorage.
 * @param settings - The settings for the quiz.
 * @returns The ID of the newly created quiz.
 */
export function saveQuiz(settings: QuizSettings): string {
  const quizId = uuidv4()
  const userQuiz: UserQuiz = { id: quizId, settings }

  const userQuizzes = localStorage.getItem('quizzes')
  let userQuizzesParsed: UserQuiz[] = []

  if (userQuizzes) {
    try {
      userQuizzesParsed = JSON.parse(userQuizzes)
    } catch (error) {
      console.error('Error parsing user quizzes:', error)
      // Handle parsing error gracefully (e.g., clear storage or display message)
    }
  }

  userQuizzesParsed.push(userQuiz) // Add the new quiz to the array
  const updatedUserQuizzes = JSON.stringify(userQuizzesParsed)

  localStorage.setItem('quizzes', updatedUserQuizzes)

  return quizId
}

export async function getQuizList(): Promise<UserQuiz[]> {
  const userQuizzes = localStorage.getItem('quizzes')
  let userQuizzesParsed: UserQuiz[] = []

  if (userQuizzes) {
    try {
      userQuizzesParsed = JSON.parse(userQuizzes)
      return userQuizzesParsed
    } catch (error) {
      console.error('Error parsing user quizzes:', error)
      return []
    }
  }

  return []
}

export async function getQuiz(quizId: string): Promise<UserQuiz | null> {
  const userQuizzes = await getQuizList()

  const quiz = userQuizzes.find((value) => value.id === quizId)

  if (quiz) return quiz
  return null
}
