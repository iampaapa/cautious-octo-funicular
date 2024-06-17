import generateAudio from './tts'

const player = require('node-wav-player')
const { parentPort } = require('node:worker_threads')

parentPort.on('message', async (message: string) => {
  const audioFile = generateAudio(message)

  await player.play({
    path: audioFile,
    sync: true
  })

  parentPort.postMessage('done')
})
