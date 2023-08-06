declare module 'http2' {
  import * as stream from 'node:stream'
  import * as url from 'node:url'

  export interface ClientSessionOptions extends SessionOptions {
    createConnection?(authority: url.URL, option: SessionOptions): stream.Duplex
  }
}
