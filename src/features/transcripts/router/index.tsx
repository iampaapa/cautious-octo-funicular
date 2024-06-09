import { RouteObject } from 'react-router-dom'
import Transcripts from '@/features/transcripts/pages/Transcripts.tsx'
import { getQuiz, getQuizList } from '@/api'


export const router: RouteObject[] = [
  {
    path: '/viewTranscripts',
    element: <Transcripts />,
    loader: async () => {
      return await getQuizList()
    }
  },
  {
    path: '/viewTranscripts/:quizId',
    element: <Transcripts />,
    loader: async ({ params }) => {
      if (params.quizId)
        return await getQuiz(params.quizId)
      return null
    }
  }
]