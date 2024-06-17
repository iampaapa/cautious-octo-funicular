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

  const sampleRate = recognizer.config.featConfig.sampleRate
  const bufferDuration = 5 // seconds
  const bufferSize = sampleRate * bufferDuration
  let audioBuffer: Float32Array = new Float32Array(bufferSize)
  let bufferOffset = 0

  socket.on('audioData', async (audioData) => {
    const s = audioData as unknown as Buffer
    const samples = new Float32Array(
      s.buffer,
      s.byteOffset,
      s.byteLength / Float32Array.BYTES_PER_ELEMENT
    )

    // Accumulate audio data
    for (let i = 0; i < samples.length; i++) {
      if (bufferOffset < bufferSize) {
        audioBuffer[bufferOffset++] = samples[i]
      }

      // When the buffer is full, process the audio
      if (bufferOffset === bufferSize) {
        stream.acceptWaveform(sampleRate, audioBuffer)

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

        // Clear the buffer and reset offset
        audioBuffer = new Float32Array(bufferSize)
        bufferOffset = 0
      }
    }
  })
})
