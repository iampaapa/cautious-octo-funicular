import { createBrowserRouter } from 'react-router-dom'
import RewardsBadges from '@/routes/RewardsBadges'
import Settings from '@/routes/Settings'
import Round from '@/routes/Round'
import ErrorPage from '@/routes/error-page'
import App from '@/App.tsx'
import { router as quizRouter } from '@/features/quiz/router'
import { router as transcriptRouter } from '@/features/transcripts/router'
import NewQuizSetup from '@/routes/NewQuizSetup'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...quizRouter,
      ...transcriptRouter,
      {
        path: '/rewardsBadge',
        element: <RewardsBadges />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/kwame-ai',
        element: <NewQuizSetup />
      },
      {
        path: '/round',
        element: <Round />
      }
    ]
  }
])
