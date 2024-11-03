/**
 * @file Type Tests - ProtocolMap
 * @module mlly/interfaces/tests/unit-d/ProtocolMap
 */

import type TestSubject from '#interfaces/protocol-map'

describe('unit-d:interfaces/ProtocolMap', () => {
  it('should match [blob: "blob:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('blob').toEqualTypeOf<'blob:'>()
  })

  it('should match [content: "content:"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('content')
      .toEqualTypeOf<'content:'>()
  })

  it('should match [cvs: "cvs:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('cvs').toEqualTypeOf<'cvs:'>()
  })

  it('should match [data: "data:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('data').toEqualTypeOf<'data:'>()
  })

  it('should match [dns: "dns:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('dns').toEqualTypeOf<'dns:'>()
  })

  it('should match [file: "file:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('file').toEqualTypeOf<'file:'>()
  })

  it('should match [fish: "fish:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('fish').toEqualTypeOf<'fish:'>()
  })

  it('should match [ftp: "ftp:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ftp').toEqualTypeOf<'ftp:'>()
  })

  it('should match [git: "git:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('git').toEqualTypeOf<'git:'>()
  })

  it('should match [http: "http:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('http').toEqualTypeOf<'http:'>()
  })

  it('should match [https: "https:"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('https')
      .toEqualTypeOf<'https:'>()
  })

  it('should match [mvn: "mvn:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('mvn').toEqualTypeOf<'mvn:'>()
  })

  it('should match [node: "node:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('node').toEqualTypeOf<'node:'>()
  })

  it('should match [redis: "redis:"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('redis')
      .toEqualTypeOf<'redis:'>()
  })

  it('should match [sftp: "sftp:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('sftp').toEqualTypeOf<'sftp:'>()
  })

  it('should match [ssh: "ssh:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ssh').toEqualTypeOf<'ssh:'>()
  })

  it('should match [svn: "svn:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('svn').toEqualTypeOf<'svn:'>()
  })

  it('should match [viewSource: "view-source:"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('viewSource')
      .toEqualTypeOf<'view-source:'>()
  })

  it('should match [ws: "ws:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ws').toEqualTypeOf<'ws:'>()
  })

  it('should match [wss: "wss:"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('wss').toEqualTypeOf<'wss:'>()
  })
})
