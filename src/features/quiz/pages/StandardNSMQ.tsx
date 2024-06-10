import { useNavigate } from 'react-router-dom'
import { STANDARD_NSMQ_SETTINGS } from '@/data/settings.ts'
import { saveQuiz } from '@/api'

export default function StandardNSMQ() {
  const navigate = useNavigate()

  const startQuiz = () => {
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
