import { createReadStream } from 'node:fs'
import { Readable } from 'stream'
import * as wav from 'wav'

const sherpa_onnx = require('sherpa-onnx')

export function createOfflineRecognizer() {
  const featConfig = {
    sampleRate: 16000,
    featureDim: 80,
  }

  const modelConfig = {
    transducer: {
      encoder: '',
      decoder: '',
      joiner: '',
    },
    paraformer: {
      model: '',
    },
    nemoCtc: {
      model:
        './electron/static/sherpa-onnx-nemo-ctc-en-conformer-small/model.int8.onnx',
    },
    whisper: {
      encoder: '',
      decoder: '',
      language: '',
      task: '',
      tailPaddings: -1,
    },
    tdnn: {
      model: '',
    },
    tokens:
      './electron/static/sherpa-onnx-nemo-ctc-en-conformer-small/tokens.txt',
    numThreads: 1,
    debug: 0,
    provider: 'cpu',
    modelType: 'nemo_ctc',
  }

  const lmConfig = {
    model: '',
    scale: 1.0,
  }

  const config = {
    featConfig: featConfig,
    modelConfig: modelConfig,
    lmConfig: lmConfig,
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    hotwordsFile: '',
    hotwordsScore: 1.5,
  }

  return sherpa_onnx.createOfflineRecognizer(config)
}

export default function stt() {
  const recognizer = createOfflineRecognizer()
  const stream = recognizer.createStream()

  const waveFilename = '../output.wav'

  const reader = new wav.Reader()
  const readable = new Readable().wrap(reader)
  const buf: Float32Array[] = [] // never type used to please the TS compiler

  reader.on('format', ({ audioFormat, bitDepth, channels, sampleRate }) => {
    if (sampleRate != recognizer.config.featConfig.sampleRate) {
      throw new Error(
        `Only support sampleRate ${recognizer.config.featConfig.sampleRate}. Given ${sampleRate}`,
      )
    }

    if (audioFormat != 1) {
      throw new Error(`Only support PCM format. Given ${audioFormat}`)
    }

    if (channels != 1) {
      throw new Error(`Only a single channel. Given ${channels}`)
    }

    if (bitDepth != 16) {
      throw new Error(`Only support 16-bit samples. Given ${bitDepth}`)
    }
  })

  createReadStream(waveFilename, { highWaterMark: 4096 })
    .pipe(reader)
    .on('finish', function () {
      // tail padding
      const floatSamples = new Float32Array(
        recognizer.config.featConfig.sampleRate * 0.5,
      )

      buf.push(floatSamples)

      const flattened = Float32Array.from(
        // @ts-expect-error TS doesn't like reduce with typed arrays
        buf.reduce((a, b) => [...a, ...b], []),
      )

      stream.acceptWaveform(recognizer.config.featConfig.sampleRate, flattened)
      recognizer.decode(stream)
      const text = recognizer.getResult(stream).text
      console.log(text)

      stream.free()
      recognizer.free()
    })

  readable.on('readable', function () {
    let chunk

    while ((chunk = readable.read()) != null) {
      const int16Samples = new Int16Array(
        chunk.buffer,
        chunk.byteOffset,
        chunk.length / Int16Array.BYTES_PER_ELEMENT,
      )

      const floatSamples = new Float32Array(int16Samples.length)

      for (let i = 0; i < floatSamples.length; i++) {
        floatSamples[i] = int16Samples[i] / 32768.0
      }

      buf.push(floatSamples)
    }
  })
}
