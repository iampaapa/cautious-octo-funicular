import React, { useState } from 'react';
import type { Field, QuizSettings, Rounds, Subject } from '@/features/quiz/types';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import saveQuiz from '../composables/saveQuiz';


const subjects: Subject[] = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];

const  CustomQuizSetup: React.FC = () => {

    const navigate = useNavigate()

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    id: uuid(),
    name: '',
    rounds: {
      roundOne: { fields: [] },
      roundTwo: { fields: [] },
      roundThree: { fields: [] },
      roundFour: { fields: [] },
      roundFive: { fields: [] },
    },
  });

  const handleFieldChange = (round: Rounds, index: number, field: Partial<Field>) => {
    setQuizSettings((prev) => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [round]: {
          ...prev.rounds[round],
          fields: prev.rounds[round].fields.map((f, i) => (i === index ? { ...f, ...field } : f)),
        },
      },
    }));
  };

  const saveSettings = () => {
    const quizTypes = localStorage.getItem('quizTypes');
    let quizTypesParsed: QuizSettings[] = [];
    
    if (quizTypes) {
        try {
            quizTypesParsed = JSON.parse(quizTypes);
        } catch (error) {
            console.error('Error parsing quiz types:', error);
        }
    }

    quizTypesParsed.push(quizSettings)
    const updatedQuizTypes = JSON.stringify(quizTypesParsed);

    localStorage.setItem('quizTypes', updatedQuizTypes);
  }

  const saveSettingsAndBeginQuiz = () => {
    saveSettings()

    const quiz = saveQuiz(quizSettings);

    navigate(`/take-quiz/${quiz}`)
  }

  return (
    <div>
        <h1>Custom Quiz Setup</h1>
        <label>
            Quiz name:
            <input
                type='text'
                value={quizSettings.name}
                onChange={(e) => setQuizSettings((prev) => ({ ...prev, name: e.target.value }))}
            />
        </label>
      {(['roundOne', 'roundTwo', 'roundThree', 'roundFour', 'roundFive'] as Rounds[]).map((round) => (
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
                    fields: [...prev.rounds[round].fields, { name: 'Physics', questionCount: 0 }],
                  },
                },
              }))
            }
          >
            Add field
          </button>
        </div>
      ))}

<div className='my-8 flex'>
      <button onClick={saveSettings}>Save</button>
      <button onClick={saveSettingsAndBeginQuiz}>Save and begin quiz</button>
</div>
    </div>
  );
};

export default CustomQuizSetup