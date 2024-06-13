import { createBrowserRouter } from 'react-router-dom'
import RewardsBadges from '@renderer/routes/RewardsBadges'
import Settings from '@renderer/routes/Settings'
import Round from '@renderer/routes/Round'
import ErrorPage from '@renderer/routes/error-page'
import App from '@renderer/App'
import { router as quizRouter } from '@renderer/features/quiz/router'
import { router as transcriptRouter } from '@renderer/features/transcripts/router'
import NewQuizSetup from '@renderer/routes/NewQuizSetup'

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
