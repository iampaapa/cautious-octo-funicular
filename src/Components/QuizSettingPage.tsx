import React from 'react'
import { useNavigate } from 'react-router-dom'
import './QuizSettingPage.css'
import { settingsData } from '/Users/paapakwesiquansah/Desktop/electron/work/electron-vite-project/src/backend/settings'

const QuizSettingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCardClick = (route: string) => {
    navigate(route)
  }

  return (
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
  )
}

export default QuizSettingPage
