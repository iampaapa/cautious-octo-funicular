import React from 'react'
import { useLoaderData } from 'react-router-dom'
import TranscriptListItem from '@/features/transcripts/components/TranscriptListItem.tsx'
import { UserQuiz } from '@/types/types'

const Transcripts: React.FC = () => {
  const data = useLoaderData() as UserQuiz[]

  const transcripts = data.map((quiz) => {
    return (
      <li>
        <TranscriptListItem key={quiz.id} setupType={quiz.settings.playerSetup} id={quiz.id}
                            quizName={quiz.settings.name}
                            date={new Date().toDateString()}>
        </TranscriptListItem>
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