/* eslint-disable @typescript-eslint/explicit-function-return-type */

import encoder
  from '../../resources/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/encoder-epoch-99-avg-1.int8.onnx?asset'
import decoder
  from '../../resources/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/decoder-epoch-99-avg-1.onnx?asset'
import joiner
  from '../../resources/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/joiner-epoch-99-avg-1.int8.onnx?asset'
import tokens from '../../resources/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/tokens.txt?asset'

const portAudio = require('naudiodon')

const { parentPort } = require('node:worker_threads')
// console.log(portAudio.getDevices());

const sherpa_onnx = require('sherpa-onnx')

export function createOnlineRecognizer() {
  const onlineTransducerModelConfig = {
    encoder: encoder,
    decoder: decoder,
    joiner: joiner
  }

  const onlineParaformerModelConfig = {
    encoder: '',
    decoder: ''
  }

  const onlineZipformer2CtcModelConfig = {
    model: ''
  }

  const onlineModelConfig = {
    transducer: onlineTransducerModelConfig,
    paraformer: onlineParaformerModelConfig,
    zipformer2Ctc: onlineZipformer2CtcModelConfig,
    tokens: tokens,
    numThreads: 1,
    provider: 'cpu',
    debug: 1,
    modelType: 'zipformer'
  }

  const featureConfig = {
    sampleRate: 16000,
    featureDim: 80
  }

  const recognizerConfig = {
    featConfig: featureConfig,
    modelConfig: onlineModelConfig,
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    enableEndpoint: 1,
    rule1MinTrailingSilence: 2.4,
    rule2MinTrailingSilence: 1.2,
    rule3MinUtteranceLength: 20,
    hotwordsFile: '',
    hotwordsScore: 1.5,
    ctcFstDecoderConfig: {
      graph: '',
      maxActive: 3000
    }
  }

  return sherpa_onnx.createOnlineRecognizer(recognizerConfig)
}

parentPort.on('message', () => {
  console.log(parentPort)
  const recognizer = createOnlineRecognizer()
  const stream = recognizer.createStream()

  let lastText = ''
  let segmentIndex = 0

  const ai = new portAudio.AudioIO({
    inOptions: {
      channelCount: 1,
      closeOnError: false,
      deviceId: -1, // Use -1 or omit the deviceId to select the default device
      sampleFormat: portAudio.SampleFormatFloat32,
      sampleRate: recognizer.config.featConfig.sampleRate
    }
  })

  ai.on('data', (data) => {
    const samples = new Float32Array(data.buffer)

    stream.acceptWaveform(recognizer.config.featConfig.sampleRate, samples)

    while (recognizer.isReady(stream)) {
      recognizer.decode(stream)
    }

    const isEndpoint = recognizer.isEndpoint(stream)
    const text = recognizer.getResult(stream).text

    if (text.length > 0 && lastText != text) {
      parentPort.postMessage(text)
      console.log(text)
    }
    if (isEndpoint) {
      if (text.length > 0) {
        lastText = text
        segmentIndex += 1
      }
      recognizer.reset(stream)
    }
  })

  parentPort.on('close', () => {
    stream.free()
    recognizer.free()
  })

  ai.on('close', () => {
    stream.free()
    recognizer.free()
  })

  ai.start()
})
