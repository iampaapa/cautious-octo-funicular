import Countdown from 'react-countdown'

export function Timer(props: { countDownFrom: number, onTimerComplete: () => void }) {
  return <Countdown key={props.countDownFrom} date={props.countDownFrom} onComplete={props.onTimerComplete} />
}