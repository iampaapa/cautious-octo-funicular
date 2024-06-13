import { RouteObject } from 'react-router-dom'
import Quiz from '@renderer/features/quiz/pages/Quiz'
import { getQuestions } from '@renderer/api'
import type { QuizSettings, Rounds } from '@renderer/features/quiz/types'
import type { UserQuiz } from '@renderer/types/types'
import StandardNSMQ from '@renderer/features/quiz/pages/StandardNSMQ'
import CustomQuizSetup from '@renderer/features/quiz/pages/CustomQuizSetup'
import QuizSelection from '@renderer/features/quiz/pages/QuizSelection'

export const router: RouteObject[] = [
  {
    path: '/take-quiz/:quizId',
    element: <Quiz />,
    loader: async ({ params }): Promise<null | any> => {
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

      const quiz = userQuizzesParsed.find((value) => value.id === params.quizId)
      const questions = []

      if (quiz) {
        const rounds = Object.keys(quiz.settings.rounds) as Rounds[]
        for (const round of rounds) {
          const roundSetting = quiz.settings.rounds[round]
          for (const r of roundSetting.fields) {
            const res = await getQuestions(r.name, r.questionCount, 1)
            questions.push(...res)
          }
        }
      } else {
        return null
      }

      return questions
    }
  },
  {
    path: '/standard-nsmq',
    element: <StandardNSMQ />
  },
  {
    path: '/create-setup/:setupId?',
    element: <CustomQuizSetup />,
    loader: async ({ params }) => {
      if (params.setupId) {
        const userQuizzes = localStorage.getItem('quizTypes')
        let userQuizzesParsed: UserQuiz[] = []

        if (userQuizzes) {
          try {
            userQuizzesParsed = JSON.parse(userQuizzes)
          } catch (error) {
            console.error('Error parsing user quizzes:', error)
            // Handle parsing error gracefully (e.g., clear storage or display message)
          }
        }

        const quiz = userQuizzesParsed.find(
          (value) => value.id === params.setupId
        )

        console.log(quiz)
        return quiz
      } else {
        console.log('no setup id')
        return null
      }
    }
  },
  {
    path: '/',
    element: <QuizSelection />,
    loader: async () => {
      const quizTypes = localStorage.getItem('quizTypes')
      let quizTypesParsed: QuizSettings[] = []

      if (quizTypes) {
        try {
          quizTypesParsed = JSON.parse(quizTypes)
        } catch (error) {
          console.error('Error parsing quiz types:', error)
        }
      }

      return quizTypesParsed
    }
  }
]
