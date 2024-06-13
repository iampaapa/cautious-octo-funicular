/* eslint-disable @typescript-eslint/explicit-function-return-type */

import model from '../../resources/vits-piper-en_US-amy-low/en_US-amy-low.onnx?asset'
import modelTokens from '../../resources/vits-piper-en_US-amy-low/tokens.txt?asset'
import { join } from 'path'

const sherpa_onnx = require('sherpa-onnx')

function createOfflineTts() {
  const offlineTtsVitsModelConfig = {
    model: model,
    lexicon: '',
    tokens: modelTokens,
    dataDir: join(__dirname, '../../resources/vits-piper-en_US-amy-low/espeak-ng-data'), // m
    dictDir: '',
    noiseScale: 0.667,
    noiseScaleW: 0.8,
    lengthScale: 1.0
  }
  const offlineTtsModelConfig = {
    offlineTtsVitsModelConfig: offlineTtsVitsModelConfig,
    numThreads: 1,
    debug: 1,
    provider: 'cpu'
  }

  const offlineTtsConfig = {
    offlineTtsModelConfig: offlineTtsModelConfig,
    ruleFsts: '',
    ruleFars: '',
    maxNumSentences: 1
  }

  return sherpa_onnx.createOfflineTts(offlineTtsConfig)
}

export default function generateAudio(text: string): string {
  const tts = createOfflineTts()
  const speakerId = 0
  const speed = 1.0

  const audio = tts.generate({
    text: text,
    sid: speakerId,
    speed: speed
  })

  tts.save('./output.wav', audio)
  tts.free()

  return './output.wav'
}
