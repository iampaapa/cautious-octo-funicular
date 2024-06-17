import React from 'react'

const ChangingRounds: React.FC<{ currentRound: number; handleStartNextRound: () => void }> = ({
  currentRound,
  handleStartNextRound
}) => {
  return (
    <>
      <h1>Round {currentRound}</h1>
      <h2>Get ready for the next round</h2>
      <button onClick={handleStartNextRound}>Start</button>
    </>
  )
}

export default ChangingRounds
