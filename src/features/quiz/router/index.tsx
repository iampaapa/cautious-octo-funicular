import { RouteObject } from 'react-router-dom'
import Quiz from '@/features/quiz/pages/Quiz.tsx'
import { getQuestions } from '@/features/quiz/api'
import type { Rounds, UserQuiz } from '@/features/quiz/types'
import StandardNSMQ from '@/features/quiz/pages/StandardNSMQ.tsx'

export const router: RouteObject[] = [{
  path: '/take-quiz/:quizId',
  element: <Quiz />,
  loader: async ({ params }) => {

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
  }]