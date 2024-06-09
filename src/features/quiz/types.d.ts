type Subject = 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics'

type RoundSettings = {
  fields: Field[]
}

export interface Field {
  name: Subject
  questionCount: number
}

export interface QuizSettings {
  id: string
  name: string
  rounds: { [key in Rounds]: RoundSettings }
}

export interface UserQuiz {
  id: string
  settings: QuizSettings
}

export type Rounds =
  | 'roundOne'
  | 'roundTwo'
  | 'roundThree'
  | 'roundFour'
  | 'roundFive'

export interface Question {
  answer: string
  difficulty: string
  form: string
  has_preamble: string
  preamble_text: string
  question: string
  question_type: string
  subject: string
  subject_topic: string
}
