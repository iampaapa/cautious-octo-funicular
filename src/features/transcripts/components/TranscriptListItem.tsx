import React from 'react'
import { NavLink } from 'react-router-dom'
import type { SetupType } from '@/types/types'


interface TranscriptListItem {
  id: string
  quizName: string
  date: string
  setupType: SetupType
}

const TranscriptListItem: React.FC<TranscriptListItem> = ({ id, date, quizName, setupType }) => {
  return (
    <NavLink to={`/transcript/${id}`} className="flex flex-col">
      <span className="text-3xl">{`${quizName} - ${date}`}</span>
      <span>{setupType}</span>
    </NavLink>
  )
}

export default TranscriptListItem