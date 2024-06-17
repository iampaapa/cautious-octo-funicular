interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
}

interface ClientToServerEvents {
  hello: () => void

  /**
   * This function is used to handle audio data.
   * @param {Buffer} audioData - The audio data. Although the actual type is Buffer, it is annotated as Blob.
   * @returns {Promise<void>} A promise that resolves when the audio data has been processed.
   */
  audioData: (audioData: Blob) => Promise<void>
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  age: number
}
