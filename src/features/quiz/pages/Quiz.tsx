import { Timer } from '@/features/quiz/components/Timer.tsx'
import { useLoaderData } from 'react-router-dom'
import type { Question } from '@/features/quiz/types'
import QuestionWaveform from '@/features/quiz/components/QuestionWaveform.tsx'
import { useState } from 'react'

export default function Quiz() {
  const data = useLoaderData() as Question[]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [countDownFrom, setCountDownFrom] = useState(Date.now() + 5000)
  const [currentRound, setCurrentRound] = useState(1)
  const [isChangingRounds, setIsChangingRounds] = useState(false)

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1

    if (data[nextQuestion].question_type != currentRound.toString()) {
      setIsChangingRounds(true)
      setCurrentRound((prevState) => prevState + 1)
      return
    }

    setCurrentQuestion((prevState) => prevState + 1)
    setCountDownFrom(Date.now() + 5000)
  }

  const handleStartNextRound = () => {
    setIsChangingRounds(false)
    setCurrentQuestion((prevState) => prevState + 1)
    setCountDownFrom(Date.now() + 5000)
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="p-8 min-h-[70%] w-9/12 flex flex-col items-center">
        {isChangingRounds ? (
          <>
            <h1>Round {currentRound}</h1>
            <h2>Get ready for the next round</h2>
            <button onClick={handleStartNextRound}>Start</button>
          </>
        ) : (
          <>
            <div className="w-full flex justify-between">
              <Timer
                className=""
                onTimerComplete={handleNextQuestion}
                countDownFrom={countDownFrom}
              />
              <span>Round {currentRound}</span>
            </div>
            <br />
            <QuestionWaveform question={data[currentQuestion]} />
          </>
        )}
      </div>
    </div>
  )
}
