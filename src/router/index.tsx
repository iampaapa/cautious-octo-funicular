import { createBrowserRouter } from 'react-router-dom'
import QuizSettingPage from '../routes/QuizSettingPage'
import GenerateReport from '../routes/GenerateReport'
import RewardsBadges from '../routes/RewardsBadges'
import Settings from '../routes/Settings'
import StandardNSMQ from '../routes/StandardNSMQ'
import CreateSetup from '../routes/CreateSetup'
import Round from '../routes/Round'
import ErrorPage from '../routes/error-page'
import App from '../App.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
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
        path: '/standard-nsmq',
        element: <StandardNSMQ />
      },
      {
        path: '/kwame-ai',
        element: <StandardNSMQ />
      },
      {
        path: '/create-setup',
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