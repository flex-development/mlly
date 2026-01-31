import type {} from 'editorconfig'

declare module 'editorconfig' {
  interface UnknownMap extends KnownProps {}
}
