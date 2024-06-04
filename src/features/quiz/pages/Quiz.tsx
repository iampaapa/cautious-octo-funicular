import { Timer } from '@/features/quiz/components/Timer.tsx'
import { useLoaderData } from 'react-router-dom'
import type { Question } from '@/features/quiz/types'
import QuestionWaveform from '@/features/quiz/components/QuestionWaveform.tsx'
import { useState } from 'react'

export default function Quiz() {
  const data = useLoaderData() as Question[]

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [countDownFrom, setCountDownFrom] = useState(Date.now() + 5000)

  const handleNextQuestion = () => {
    setCurrentQuestion(prevState => prevState + 1)
    setCountDownFrom(Date.now() + 5000)
  }

  return (
    <>
      <div>quiz screen</div>
      <Timer onTimerComplete={handleNextQuestion} countDownFrom={countDownFrom} />
      <br />
      <QuestionWaveform question={data[currentQuestion]} />

    </>
  )
}