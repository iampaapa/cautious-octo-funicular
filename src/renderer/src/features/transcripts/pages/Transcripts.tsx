import React from 'react'
import { useLoaderData } from 'react-router-dom'
import TranscriptListItem from '@renderer/features/transcripts/components/TranscriptListItem'
import { UserQuiz } from '@renderer/types/types'

const Transcripts: React.FC = () => {
  const data = useLoaderData() as UserQuiz[]

  const transcripts = data.map((quiz) => {
    return (
      <li key={quiz.id}>
        <TranscriptListItem
          setupType={quiz.settings.playerSetup}
          id={quiz.id}
          quizName={quiz.settings.name}
          date={new Date().toDateString()}
        ></TranscriptListItem>
      </li>
    )
  })

  return (
    <>
      <h1>Transcripts</h1>
      <ul>{transcripts}</ul>
    </>
  )
}

export default Transcripts
