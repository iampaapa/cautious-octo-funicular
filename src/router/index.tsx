import { createBrowserRouter } from 'react-router-dom'
import GenerateReport from '@/routes/GenerateReport'
import RewardsBadges from '@/routes/RewardsBadges'
import Settings from '@/routes/Settings'
import CreateSetup from '@/routes/CreateSetup'
import Round from '@/routes/Round'
import ErrorPage from '@/routes/error-page'
import App from '@/App.tsx'
import { router as quizRouter } from '@/features/quiz/router'
import QuizSettingPage from '@/routes/QuizSettingPage'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      ...quizRouter,
      {
        path: '/takeQuiz',
        element: <QuizSettingPage />
      },
      {
        path: '/viewTranscripts',
        element: <GenerateReport />
      },
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
        element: <CreateSetup />
      },
      {
        path: '/round',
        element: <Round />
      }
    ]
  }
])

export { RouterProvider } from 'react-router-dom'