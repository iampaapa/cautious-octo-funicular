import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

// export was added to remove unused var lint error
export const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sherpa_onnx = require('sherpa-onnx')

function createOfflineTts() {
  const offlineTtsVitsModelConfig = {
    model: './electron/static/vits-piper-en_US-amy-low/en_US-amy-low.onnx',
    lexicon: '',
    tokens: './electron/static/vits-piper-en_US-amy-low/tokens.txt',
    dataDir: './electron/static/vits-piper-en_US-amy-low/espeak-ng-data',
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

export default function generateAudio(text: string) {
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

