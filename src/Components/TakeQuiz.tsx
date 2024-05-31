import { useState, useEffect } from 'react'
import './TakeQuiz.css'

function TakeQuiz() {
  const [seconds, setSeconds] = useState(60) // Timer starts at 60 seconds
  const [points] = useState(0) // Initial points

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0))
    }, 1000)

    return () => clearInterval(timer) // Cleanup timer on component unmount
  }, [])

  return (
    <div className="quiz-container">
      <div className="sidebar">
        <div className="timer">
          <h3>Time Left</h3>
          <p>{seconds}s</p>
        </div>
        <div className="points">
          <h3>Points</h3>
          <p>{points}</p>
        </div>
        <div className="additional-info">
          <h3>Round Info</h3>
          <p>Other details.</p>
        </div>
      </div>
      <div className="quiz-content">
        <h2>Take a Quiz</h2>
        <p>I've not yet figured out the rest of the design.</p>
        {/* Add your quiz questions and functionality here */}
      </div>
    </div>
  )
}

export default TakeQuiz
