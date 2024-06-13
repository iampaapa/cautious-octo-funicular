import { Server } from 'socket.io'

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
  cors: {
    origin: '*'
  }
})

io.listen(3124)

io.on('connection', (socket) => {
  console.log('client connected')

  socket.on('audioData', async (audioData) => {})
})
