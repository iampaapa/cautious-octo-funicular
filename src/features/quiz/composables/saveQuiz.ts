import { v4 as uuidv4 } from 'uuid'
import type { QuizSettings, UserQuiz } from '@/features/quiz/types'

/**
 * Starts a new quiz and stores it in the user's localStorage.
 * @param settings - The settings for the quiz.
 * @returns The ID of the newly created quiz.
 */
export default function saveQuiz(settings: QuizSettings): string {
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
