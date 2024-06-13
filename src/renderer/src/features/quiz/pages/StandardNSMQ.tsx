import { useNavigate } from 'react-router-dom'
import { STANDARD_NSMQ_SETTINGS } from '@renderer/data/settings'
import { saveQuiz } from '@renderer/api'
import { JSX } from 'react'

export default function StandardNSMQ(): JSX.Element {
  const navigate = useNavigate()

  const startQuiz = (): void => {
    const quiz = saveQuiz(STANDARD_NSMQ_SETTINGS)
    navigate(`/take-quiz/${quiz}`)
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <p>Click start to begin</p>
      <button onClick={startQuiz}>Start</button>
    </div>
  )
}
