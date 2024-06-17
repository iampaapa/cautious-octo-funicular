import React from 'react'

const ProcessingTranscript: React.FC<{ userAnswer: string }> = ({ userAnswer }) => {
  return (
    <>
      <h1>Processing transcription...</h1>
      <h2>{userAnswer}</h2>
    </>
  )
}

export default ProcessingTranscript
