import Countdown from 'react-countdown'

interface TimerProps {
  countDownFrom: number,
  className?: string,
  onTimerComplete: () => void
}

export function Timer({ onTimerComplete, className, countDownFrom }: TimerProps) {
  return <Countdown key={countDownFrom}
                    className={className}
                    date={countDownFrom}
                    onComplete={onTimerComplete} />
}