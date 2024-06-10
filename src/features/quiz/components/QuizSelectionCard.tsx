import { useNavigate } from 'react-router-dom'
import React from 'react'

interface QuizSelectionCardProps {
  className?: string
  icon: string
  to: string
  label: string
}

const QuizSelectionCard: React.FC<QuizSelectionCardProps> = ({ to, icon, label, className }) => {
  const navigate = useNavigate()
  const handleCardClick = (route: string) => {
    navigate(route)
  }

  return (
    <div
      className={className}
      onClick={() => handleCardClick(to)}
    >
      <div className={`icon ${icon}`}></div>
      <div className="label">{label}</div>
    </div>
  )
}

export default QuizSelectionCard