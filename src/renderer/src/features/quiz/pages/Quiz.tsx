import Timer from '@renderer/features/quiz/components/Timer'
import { useLoaderData } from 'react-router-dom'
import type { Question } from '@renderer/features/quiz/types'
import QuestionWaveform from '@renderer/features/quiz/components/QuestionWaveform'
import { JSX, useEffect, useRef, useState } from 'react'
import { generateAudio } from '@renderer/api'
import Countdown, { CountdownApi } from 'react-countdown'
import { io, type Socket } from 'socket.io-client'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3124')

export default function Quiz(): JSX.Element {
  const data = useLoaderData() as Question[]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [countDownFrom, setCountDownFrom] = useState(Date.now() + 15000)
  const [currentRound, setCurrentRound] = useState(1)
  const [isChangingRounds, setIsChangingRounds] = useState(false)

  const timerRef = useRef<CountdownApi | null>(null)

  const setTimerRef = (countdown: Countdown | null): void => {
    if (countdown) {
      timerRef.current = countdown.getApi()
    }
  }

  const handleNextQuestion = async (): Promise<void> => {
    const nextQuestion = currentQuestion + 1

    if (data[nextQuestion].question_type != currentRound.toString()) {
      setIsChangingRounds(true)
      setCurrentRound((prevState) => prevState + 1)
      return
    }

    setCurrentQuestion((prevState) => prevState + 1)
    setCountDownFrom(Date.now() + 5000)

    await generateAudio(data[nextQuestion].question)
    timerRef.current?.start()
  }

  const handleStartNextRound = async (): Promise<void> => {
    setIsChangingRounds(false)
    setCurrentQuestion((prevState) => prevState + 1)

    await readQuestion()
    setCountDownFrom(Date.now() + 5000)
    timerRef.current?.start()
  }

  async function readQuestion(): Promise<void> {
    await generateAudio(data[currentQuestion].question)
  }

  // useEffect being called twice is normal and doesn't happen in prod
  // see react blog for explainer
  useEffect(() => {
    readQuestion().then(() => timerRef.current?.start())
  }, [])

  const [recording, setRecording] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (recording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioContextRef.current = new window.AudioContext()
        // const source = audioContextRef.current.createMediaStreamSource(stream)
        mediaRecorderRef.current = new MediaRecorder(stream)

        mediaRecorderRef.current.ondataavailable = (event): void => {
          socket.emit('audioData', event.data)
        }

        mediaRecorderRef.current.start(250) // Send data every 250ms
      })
    } else {
      mediaRecorderRef.current?.stop()
      audioContextRef.current?.close()
    }
  }, [recording])

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
                setRef={setTimerRef}
                className=""
                onTimerComplete={handleNextQuestion}
                countDownFrom={countDownFrom}
              />
              <span>Round {currentRound}</span>
            </div>
            <br />
            <QuestionWaveform question={data[currentQuestion]} />

            <button onClick={() => setRecording(!recording)}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
