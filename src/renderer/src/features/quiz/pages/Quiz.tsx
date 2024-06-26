import Timer from '@renderer/features/quiz/components/Timer'
import { useLoaderData } from 'react-router-dom'
import type { Question } from '@renderer/features/quiz/types'
import QuestionWaveform from '@renderer/features/quiz/components/QuestionWaveform'
import { JSX, useEffect, useRef, useState } from 'react'
import { generateAudio } from '@renderer/api'
import Countdown, { CountdownApi } from 'react-countdown'
import ChangingRounds from '../components/ChangingRounds'
import ProcessingTranscript from '../components/ProcessingTranscript'

enum STATUS {
  IDLE,
  READING_QUESTION,
  RECORDING,
  PROCESSING_TRANSCRIPTION,
  TRANSCRIPTION_COMPLETE,
  ERROR,
  CHANGING_ROUNDS
}

export default function Quiz(): JSX.Element {
  const data = useLoaderData() as Question[]

  const [status, setStatus] = useState(STATUS.IDLE)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [countDownFrom, setCountDownFrom] = useState(Date.now() + 15000)
  const [currentRound, setCurrentRound] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [preamble, setPreamble] = useState('')

  const timerRef = useRef<CountdownApi | null>(null)

  const setTimerRef = (countdown: Countdown | null): void => {
    if (countdown) {
      timerRef.current = countdown.getApi()
    }
  }

  const handleNextQuestion = async (): Promise<void> => {
    const nextQuestion = currentQuestion + 1

    if (data[nextQuestion].has_preamble && preamble !== data[nextQuestion].preamble_text) {
      await generateAudio(data[nextQuestion].preamble_text)
    }
    if (data[nextQuestion].question_type != currentRound.toString()) {
      setStatus(STATUS.CHANGING_ROUNDS)
      setCurrentRound((prevState) => prevState + 1)
      return
    }

    setCurrentQuestion((prevState) => prevState + 1)
    setCountDownFrom(Date.now() + 5000)

    await generateAudio(data[nextQuestion].question)
    timerRef.current?.start()
  }

  const handleStartNextRound = async (): Promise<void> => {
    setStatus(STATUS.IDLE)
    setCurrentQuestion((prevState) => prevState + 1)

    await readQuestion()
    setCountDownFrom(Date.now() + 5000)
    timerRef.current?.start()
  }

  async function readQuestion(): Promise<void> {
    setStatus(STATUS.READING_QUESTION)
    await generateAudio(data[currentQuestion].question)
    setStatus(STATUS.IDLE)
  }

  // useEffect being called twice is normal and doesn't happen in prod
  // see react blog for explainer
  useEffect(() => {
    window.api.onTranscriptionComplete((text) => {
      setUserAnswer(text)
      setStatus(STATUS.PROCESSING_TRANSCRIPTION)
    })

    window.api.onJudgeAnswerComplete((score) => {
      setScore(score)
      setStatus(STATUS.TRANSCRIPTION_COMPLETE)
    })

    readQuestion().then(() => timerRef.current?.start())
  }, [])

  useEffect(() => {
    if (status === STATUS.PROCESSING_TRANSCRIPTION) {
      window.api.judgeAnswer(
        userAnswer,
        data[currentQuestion].question,
        data[currentQuestion].answer
      )
    } else if (status === STATUS.TRANSCRIPTION_COMPLETE) {
      setStatus(STATUS.IDLE)
      handleNextQuestion().then(() => {})
    }
  }, [status])

  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (recording) {
      window.api.startRecording()
    } else {
      window.api.stopRecording()
    }
  }, [recording])

  return (
    <div className="h-full w-full flex justify-center items-center">
      <span>Score: {score}</span>
      <div className="p-8 min-h-[70%] w-9/12 flex flex-col items-center">
        <div className="w-full flex justify-between">
          <Timer
            setRef={setTimerRef}
            className=""
            onTimerComplete={handleNextQuestion}
            countDownFrom={countDownFrom}
          />
          <span>Round {currentRound}</span>
        </div>

        {status === STATUS.CHANGING_ROUNDS ? (
          <ChangingRounds currentRound={currentRound} handleStartNextRound={handleStartNextRound} />
        ) : status === STATUS.PROCESSING_TRANSCRIPTION ? (
          <ProcessingTranscript userAnswer={userAnswer} />
        ) : status === STATUS.READING_QUESTION ? (
          <QuestionWaveform />
        ) : (
          <></>
        )}

        <button onClick={() => setRecording(!recording)}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  )
}
