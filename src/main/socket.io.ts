import { Server } from 'socket.io'
import { createOnlineRecognizer } from './stt_online'

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
  cors: {
    origin: '*'
  }
})

io.listen(3124)

io.on('connection', (socket) => {
  console.log('client connected')

  const recognizer = createOnlineRecognizer()
  const stream = recognizer.createStream()

  let lastText = ''
  let segmentIndex = 0

  socket.on('audioData', async (audioData) => {
    const s = audioData as unknown as Buffer
    const samples = new Float32Array(s.buffer)

    stream.acceptWaveform(recognizer.config.featConfig.sampleRate, samples)

    while (recognizer.isReady(stream)) {
      recognizer.decode(stream)
    }

    const isEndpoint = recognizer.isEndpoint(stream)
    const text = recognizer.getResult(stream).text

    if (text.length > 0 && lastText != text) {
      lastText = text
      console.log(segmentIndex, lastText)
    }
    if (isEndpoint) {
      if (text.length > 0) {
        lastText = text
        segmentIndex += 1
      }
      recognizer.reset(stream)
    }
  })
})
