import { Question } from '@/features/quiz/types'

export default function QuestionWaveform(props: { question: Question }) {
  return (
    <>
      {props.question.question}
    </>
  )
}