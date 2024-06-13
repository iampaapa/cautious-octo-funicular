import React, { useState } from 'react'
import type { Field, QuizSettings, Rounds, Subject } from '@renderer/features/quiz/types'
import { v4 as uuid } from 'uuid'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { deleteQuizSetting, saveQuiz, saveSettings } from '@renderer/api'

const subjects: Subject[] = ['Physics', 'Chemistry', 'Biology', 'Mathematics']

const CustomQuizSetup: React.FC = () => {
  const data = useLoaderData() as QuizSettings

  const navigate = useNavigate()

  const [quizSettings, setQuizSettings] = useState<QuizSettings>(
    data || {
      id: uuid(),
      name: '',
      rounds: {
        roundOne: { fields: [] },
        roundTwo: { fields: [] },
        roundThree: { fields: [] },
        roundFour: { fields: [] },
        roundFive: { fields: [] }
      }
    }
  )

  const handleFieldChange = (round: Rounds, index: number, field: Partial<Field>) => {
    setQuizSettings((prev) => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [round]: {
          ...prev.rounds[round],
          fields: prev.rounds[round].fields.map((f, i) => (i === index ? { ...f, ...field } : f))
        }
      }
    }))
  }

  const saveSettingsAndBeginQuiz = () => {
    saveSettings(quizSettings)
    const quiz = saveQuiz(quizSettings)

    navigate(`/take-quiz/${quiz}`)
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div className="bg-gray-300 p-4">
        <h1>Custom Quiz Setup</h1>
        <label>
          Quiz name:
          <input
            className="bg-white"
            type="text"
            value={quizSettings.name}
            onChange={(e) => setQuizSettings((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>

        {(['roundOne', 'roundTwo', 'roundThree', 'roundFour', 'roundFive'] as Rounds[]).map(
          (round) => (
            <div key={round}>
              <h2>{round}</h2>
              {quizSettings.rounds[round].fields.map((field, index) => (
                <div key={index}>
                  <label>
                    Subject:
                    <select
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(round, index, { name: e.target.value as Subject })
                      }
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Number of questions:
                    <input
                      type="number"
                      value={field.questionCount}
                      onChange={(e) =>
                        handleFieldChange(round, index, { questionCount: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>
              ))}
              <button
                onClick={() =>
                  setQuizSettings((prev) => ({
                    ...prev,
                    rounds: {
                      ...prev.rounds,
                      [round]: {
                        ...prev.rounds[round],
                        fields: [
                          ...prev.rounds[round].fields,
                          { name: 'Physics', questionCount: 0 }
                        ]
                      }
                    }
                  }))
                }
              >
                Add field
              </button>
            </div>
          )
        )}

        <div className="my-8 flex gap-4">
          <button
            onClick={() => {
              saveSettings(quizSettings)
              navigate('/')
            }}
          >
            Save
          </button>
          <button onClick={saveSettingsAndBeginQuiz}>Save and begin quiz</button>
          {data ? (
            <button
              onClick={() => {
                deleteQuizSetting(quizSettings.id)
                navigate('/')
              }}
            >
              Delete
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomQuizSetup
