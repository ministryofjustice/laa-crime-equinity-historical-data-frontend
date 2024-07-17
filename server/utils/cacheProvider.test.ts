import sdsAuthCache from './cacheProvider'

describe('CacheProvider', () => {
  beforeEach(() => {
    sdsAuthCache.set('some-key', '123456')
  })

  it('should get item from cache', () => {
    const result = sdsAuthCache.get('some-key')

    expect(result).toEqual('123456')
  })

  it('should return true if key exists in cache', () => {
    const result = sdsAuthCache.has('some-key')

    expect(result).toBe(true)
  })

  it('should return false if key does not exist in cache', () => {
    const result = sdsAuthCache.has('???')

    expect(result).toBe(false)
  })
})
