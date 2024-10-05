/**
 * @file Type Tests - ProtocolMap
 * @module mlly/interfaces/tests/unit-d/ProtocolMap
 */

import type TestSubject from '#interfaces/protocol-map'

describe('unit-d:interfaces/ProtocolMap', () => {
  it('should have property "blob:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('blob:')
  })

  it('should have property "content:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('content:')
  })

  it('should have property "cvs:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cvs:')
  })

  it('should have property "data:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('data:')
  })

  it('should have property "dns:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('dns:')
  })

  it('should have property "file:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('file:')
  })

  it('should have property "fish:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('fish:')
  })

  it('should have property "ftp:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ftp:')
  })

  it('should have property "git:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('git:')
  })

  it('should have property "http:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('http:')
  })

  it('should have property "https:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('https:')
  })

  it('should have property "mvn:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('mvn:')
  })

  it('should have property "redis:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('redis:')
  })

  it('should have property "sftp:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('sftp:')
  })

  it('should have property "ssh:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ssh:')
  })

  it('should have property "svn:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('svn:')
  })

  it('should have property "view-source:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('view-source:')
  })

  it('should have property "ws:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ws:')
  })

  it('should have property "wss:"', () => {
    expectTypeOf<TestSubject>().toHaveProperty('wss:')
  })
})
