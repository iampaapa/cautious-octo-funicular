import React, { useState } from 'react';
import './NewQuizSetup.css';

const NewQuizSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    difficulty: '1',
    subjects: {
      nsmq: false,
      bio: false,
      math: false,
    },
    form: 'form1',
    rounds: {
      round1: false,
      round2: false,
      round3: false,
    },
    playerMode: 'single',
    helperMode: false,
    voiceSelection: false,
    timePerQuestion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [category, key] = name.split('.');
    setFormData({
      ...formData,
      [category]: {
        ...formData[category as keyof typeof formData],
        [key]: checked,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save form data logic here
    console.log(formData);
  };

  return (
    <div className="new-quiz-setup">
      <h2>New Quiz Setup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name of Setup:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Difficulty Setting:</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <label>
            <input type="checkbox" name="subjects.nsmq" checked={formData.subjects.nsmq} onChange={handleCheckboxChange} />
            NSMQ Format
          </label>
          <label>
            <input type="checkbox" name="subjects.bio" checked={formData.subjects.bio} onChange={handleCheckboxChange} />
            Bio
          </label>
          <label>
            <input type="checkbox" name="subjects.math" checked={formData.subjects.math} onChange={handleCheckboxChange} />
            Math
          </label>
        </div>

        <div className="form-group">
          <label>Form:</label>
          <label>
            <input type="radio" name="form" value="form1" checked={formData.form === 'form1'} onChange={handleChange} />
            Form 1
          </label>
          <label>
            <input type="radio" name="form" value="form2" checked={formData.form === 'form2'} onChange={handleChange} />
            Form 2
          </label>
          <label>
            <input type="radio" name="form" value="form3" checked={formData.form === 'form3'} onChange={handleChange} />
            Form 3
          </label>
        </div>

        <div className="form-group">
          <label>Rounds:</label>
          <label>
            <input type="checkbox" name="rounds.round1" checked={formData.rounds.round1} onChange={handleCheckboxChange} />
            Round 1
          </label>
          <label>
            <input type="checkbox" name="rounds.round2" checked={formData.rounds.round2} onChange={handleCheckboxChange} />
            Round 2
          </label>
          <label>
            <input type="checkbox" name="rounds.round3" checked={formData.rounds.round3} onChange={handleCheckboxChange} />
            Round 3
          </label>
        </div>

        <div className="form-group">
          <label>Player Mode:</label>
          <label>
            <input type="radio" name="playerMode" value="single" checked={formData.playerMode === 'single'} onChange={handleChange} />
            Single player
          </label>
          <label>
            <input type="radio" name="playerMode" value="multiplayer" checked={formData.playerMode === 'multiplayer'} onChange={handleChange} />
            Multiplayer
          </label>
        </div>

        <div className="form-group">
          <label>Helper Mode:</label>
          <input type="checkbox" name="helperMode" checked={formData.helperMode} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Voice Selection:</label>
          <input type="checkbox" name="voiceSelection" checked={formData.voiceSelection} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Time per Question:</label>
          <input type="number" name="timePerQuestion" value={formData.timePerQuestion} onChange={handleChange} required />
        </div>

        <button type="submit">Save Setup</button>
      </form>
    </div>
  );
};

export default NewQuizSetup;
