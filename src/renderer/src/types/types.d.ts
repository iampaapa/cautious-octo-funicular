import { QuizSettings } from '@/features/quiz/types'

export type SetupType = 'single' | 'multiplayer'

export interface UserQuiz {
  id: string
  settings: QuizSettings
}
