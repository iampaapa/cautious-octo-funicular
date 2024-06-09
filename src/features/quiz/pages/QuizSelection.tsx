import React from 'react'
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import '@/features/quiz/assets/quiz_selection.css'
import { QuizSettings } from '@/features/quiz/types'

const settingsData = [
  {
    icon: 'microscope-icon',
    label: 'Standard NSMQ Setting',
    route: '/standard-nsmq',
  },
  {
    icon: 'apple-icon',
    label: 'Kwame AI Setting',
    route: '/kwame-ai',
  },
  {
    icon: 'plus-icon',
    label: 'Create a New Setup',
    route: '/create-setup',
  },
]

const Index: React.FC = () => {
  const data = useLoaderData() as QuizSettings[]
  const navigate = useNavigate()

  console.log(data)

  const handleCardClick = (route: string) => {
    navigate(route)
  }

  const CustomQuizzes = data.map((quiz) => {
    return (
      <li>
        <NavLink key={quiz.id} to={`/create-setup/${quiz.id}`}>
          {quiz.name ? quiz.name : 'no name'}
        </NavLink>
      </li>
    )
  })

  return (
    <div className="flex flex-col min-h-full min-w-full m-8">
      <div className="quiz-setting-page">
        <div className="settings-container">
          {settingsData.map((setting, index) => (
            <div
              key={index}
              className="setting-option"
              onClick={() => handleCardClick(setting.route)}
            >
              <div className={`icon ${setting.icon}`}></div>
              <div className="label">{setting.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Custom Setups</h1>
        <ul>{CustomQuizzes}</ul>
      </div>
    </div>
  )
}

export default Index
