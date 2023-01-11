/**
 * @file Type Tests - Protocol
 * @module mlly/types/tests/unit-d/Protocol
 */

import type TestSubject from '../protocol'

describe('unit-d:types/Protocol', () => {
  it('should extract "blob:"', () => {
    expectTypeOf<TestSubject>().extract<'blob:'>().toBeString()
  })

  it('should extract "content:"', () => {
    expectTypeOf<TestSubject>().extract<'content:'>().toBeString()
  })

  it('should extract "cvs:"', () => {
    expectTypeOf<TestSubject>().extract<'cvs:'>().toBeString()
  })

  it('should extract "data:"', () => {
    expectTypeOf<TestSubject>().extract<'data:'>().toBeString()
  })

  it('should extract "dns:"', () => {
    expectTypeOf<TestSubject>().extract<'dns:'>().toBeString()
  })

  it('should extract "file:"', () => {
    expectTypeOf<TestSubject>().extract<'file:'>().toBeString()
  })

  it('should extract "fish:"', () => {
    expectTypeOf<TestSubject>().extract<'fish:'>().toBeString()
  })

  it('should extract "ftp:"', () => {
    expectTypeOf<TestSubject>().extract<'ftp:'>().toBeString()
  })

  it('should extract "git:"', () => {
    expectTypeOf<TestSubject>().extract<'git:'>().toBeString()
  })

  it('should extract "http:"', () => {
    expectTypeOf<TestSubject>().extract<'http:'>().toBeString()
  })

  it('should extract "https:"', () => {
    expectTypeOf<TestSubject>().extract<'https:'>().toBeString()
  })

  it('should extract "mvn:"', () => {
    expectTypeOf<TestSubject>().extract<'mvn:'>().toBeString()
  })

  it('should extract "redis:"', () => {
    expectTypeOf<TestSubject>().extract<'redis:'>().toBeString()
  })

  it('should extract "sftp:"', () => {
    expectTypeOf<TestSubject>().extract<'sftp:'>().toBeString()
  })

  it('should extract "ssh:"', () => {
    expectTypeOf<TestSubject>().extract<'ssh:'>().toBeString()
  })

  it('should extract "svn:"', () => {
    expectTypeOf<TestSubject>().extract<'svn:'>().toBeString()
  })

  it('should extract "view-source:"', () => {
    expectTypeOf<TestSubject>().extract<'view-source:'>().toBeString()
  })

  it('should extract "ws:"', () => {
    expectTypeOf<TestSubject>().extract<'ws:'>().toBeString()
  })

  it('should extract "wss:"', () => {
    expectTypeOf<TestSubject>().extract<'wss:'>().toBeString()
  })
})
