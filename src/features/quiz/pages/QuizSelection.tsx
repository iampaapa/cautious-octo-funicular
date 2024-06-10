import React from 'react'
import { useLoaderData } from 'react-router-dom'
import '@/features/quiz/assets/quiz_selection.css'
import type { QuizSettings } from '@/features/quiz/types'
import QuizSelectionCard from '@/features/quiz/components/QuizSelectionCard.tsx'

const settingsData = [
  {
    icon: 'microscope-icon',
    label: 'Standard NSMQ Setting',
    route: '/standard-nsmq'
  },
  {
    icon: 'apple-icon',
    label: 'Kwame AI Setting',
    route: '/kwame-ai'
  },
  {
    icon: 'plus-icon',
    label: 'Create a New Setup',
    route: '/create-setup'
  }
]

const QuizSelection: React.FC = () => {
  const data = useLoaderData() as QuizSettings[]

  const CustomQuizzes = data.map((quiz) => {
    return (
      <QuizSelectionCard className="setting-option" to={`/create-setup/${quiz.id}`}
                         label={quiz.name ? quiz.name : 'no name'} icon="microscope-icon" />
    )
  })

  return (
    <div className="flex flex-col min-h-full min-w-full m-8 gap-8">
      <div className="flex gap-8">
        {settingsData.map((setting, index) => (
          <QuizSelectionCard key={index} className="setting-option" to={setting.route} icon={setting.icon}
                             label={setting.label} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-3xl">Custom Setups</span>
        <ul className="flex gap-8">{CustomQuizzes}</ul>
      </div>
    </div>
  )
}

export default QuizSelection
