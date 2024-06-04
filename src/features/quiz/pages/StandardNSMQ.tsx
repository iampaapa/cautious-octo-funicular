import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { STANDARD_NSMQ_SETTINGS } from '@/data/settings.ts'
import type { QuizSettings } from '@/features/quiz/types'

interface UserQuiz {
  id: string;
  settings: QuizSettings;
}

export default function StandardNSMQ() {
  const navigate = useNavigate()

  const startQuiz = () => {
    const quizId = uuidv4()
    const settings: QuizSettings = STANDARD_NSMQ_SETTINGS
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

    navigate(`/take-quiz/${quizId}`)
  }

  return (
    <div>
      <p>
        The quiz would be structured as follows
      </p>
      <button onClick={startQuiz}>Start</button>
    </div>
  )
}
