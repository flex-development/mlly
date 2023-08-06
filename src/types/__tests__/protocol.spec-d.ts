/**
 * @file Type Tests - Protocol
 * @module mlly/types/tests/unit-d/Protocol
 */

import type TestSubject from '../protocol'

describe('unit-d:types/Protocol', () => {
  it('should extract "blob:"', () => {
    expectTypeOf<TestSubject>().extract<'blob:'>().not.toBeNever()
  })

  it('should extract "content:"', () => {
    expectTypeOf<TestSubject>().extract<'content:'>().not.toBeNever()
  })

  it('should extract "cvs:"', () => {
    expectTypeOf<TestSubject>().extract<'cvs:'>().not.toBeNever()
  })

  it('should extract "data:"', () => {
    expectTypeOf<TestSubject>().extract<'data:'>().not.toBeNever()
  })

  it('should extract "dns:"', () => {
    expectTypeOf<TestSubject>().extract<'dns:'>().not.toBeNever()
  })

  it('should extract "file:"', () => {
    expectTypeOf<TestSubject>().extract<'file:'>().not.toBeNever()
  })

  it('should extract "fish:"', () => {
    expectTypeOf<TestSubject>().extract<'fish:'>().not.toBeNever()
  })

  it('should extract "ftp:"', () => {
    expectTypeOf<TestSubject>().extract<'ftp:'>().not.toBeNever()
  })

  it('should extract "git:"', () => {
    expectTypeOf<TestSubject>().extract<'git:'>().not.toBeNever()
  })

  it('should extract "http:"', () => {
    expectTypeOf<TestSubject>().extract<'http:'>().not.toBeNever()
  })

  it('should extract "https:"', () => {
    expectTypeOf<TestSubject>().extract<'https:'>().not.toBeNever()
  })

  it('should extract "mvn:"', () => {
    expectTypeOf<TestSubject>().extract<'mvn:'>().not.toBeNever()
  })

  it('should extract "redis:"', () => {
    expectTypeOf<TestSubject>().extract<'redis:'>().not.toBeNever()
  })

  it('should extract "sftp:"', () => {
    expectTypeOf<TestSubject>().extract<'sftp:'>().not.toBeNever()
  })

  it('should extract "ssh:"', () => {
    expectTypeOf<TestSubject>().extract<'ssh:'>().not.toBeNever()
  })

  it('should extract "svn:"', () => {
    expectTypeOf<TestSubject>().extract<'svn:'>().not.toBeNever()
  })

  it('should extract "view-source:"', () => {
    expectTypeOf<TestSubject>().extract<'view-source:'>().not.toBeNever()
  })

  it('should extract "ws:"', () => {
    expectTypeOf<TestSubject>().extract<'ws:'>().not.toBeNever()
  })

  it('should extract "wss:"', () => {
    expectTypeOf<TestSubject>().extract<'wss:'>().not.toBeNever()
  })
})
