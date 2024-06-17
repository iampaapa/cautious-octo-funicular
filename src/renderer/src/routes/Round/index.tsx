import React, { useRef, useState, useEffect, useCallback } from 'react'
// import Visualizer from '../../Components/Visualizer'
import './Round.css'

const Index: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const stopRecording = useCallback(() => {
    audioContext?.close()
    setAudioContext(null)
    setAnalyser(null)
    setIsRecording(false)
  }, [audioContext])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        if (isRecording) {
          stopRecording()
        } else {
          startRecording()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isRecording, stopRecording])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream)
    const analyserNode = audioCtx.createAnalyser()

    source.connect(analyserNode)
    setAudioContext(audioCtx)
    setAnalyser(analyserNode)
    setIsRecording(true)
  }

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaElementSource(audioElement)
      const analyserNode = audioCtx.createAnalyser()

      source.connect(analyserNode)
      analyserNode.connect(audioCtx.destination)

      setAudioContext(audioCtx)
      setAnalyser(analyserNode)
    }
  }, [])

  return (
    <div className="round-page">
      <header className="round-header">
        <div className="timer">00:30</div>
        <div className="round-title">
          <h1>Round 1</h1>
          <h2>Fundamental Questions Round</h2>
        </div>
        <div className="next-arrow">➔</div>
      </header>
      <main className="round-main">
        {/*{analyser && <Visualizer analyser={analyser} />}*/}
        <div className="score-board">
          <p>Number of Points Gained in the Round so far</p>
          <p>Number of Points in Total</p>
        </div>
      </main>
      <footer className="round-footer">
        <audio ref={audioRef} src="../../assets/audio/audio_video9.mp3" controls />
        <p>
          {isRecording
            ? 'Click space to stop recording'
            : 'Click space to record'}
        </p>
      </footer>
    </div>
  )
}

export default Index
