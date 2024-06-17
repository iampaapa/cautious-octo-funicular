import React from 'react'
import '../assets/voice_recorder.scss'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const VoiceRecorder: React.FC<{ animate: boolean; onClick: () => void }> = ({
  animate,
  onClick
}) => {
  return (
    <div className={`mic-container `} onClick={onClick}>
      <div className={`circle ${animate ? 'active' : ''}`}>
        <FontAwesomeIcon className="i" icon={faMicrophone} />
      </div>
    </div>
  )
}

export default VoiceRecorder
