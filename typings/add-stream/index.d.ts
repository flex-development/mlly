declare module 'add-stream' {
  import type { ReadStream, WriteStream } from 'node:fs'

  /**
   * Creates a transform stream that appends the contents of `stream` onto
   * whatever is piped into it.
   *
   * @param {ReadStream} stream - Stream to append
   * @return {WriteStream} Transform stream
   */
  function addStream(stream: ReadStream): WriteStream

  export default addStream
}
