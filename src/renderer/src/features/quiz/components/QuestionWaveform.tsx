import type { Question } from '@renderer/features/quiz/types'
import React from 'react'

const QuestionWaveform: React.FC<{ question: Question }> = (props) => <>{props.question.question}</>

export default QuestionWaveform
