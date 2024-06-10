import Countdown from 'react-countdown'
import React from 'react'

interface TimerProps {
  countDownFrom: number,
  className?: string,
  onTimerComplete: () => void,
  setRef: (countdown: Countdown | null) => void
}

const Timer: React.FC<TimerProps> = ({ onTimerComplete, className, countDownFrom, setRef }) => {
  return <Countdown key={countDownFrom}
                    ref={setRef}
                    className={className}
                    date={countDownFrom}
                    onComplete={onTimerComplete}
                    autoStart={false} />
}

export default Timer