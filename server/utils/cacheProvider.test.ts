import sdsAuthCache from './cacheProvider'

describe('CacheProvider', () => {
  beforeEach(() => {
    sdsAuthCache.set('some-key', '123456')
  })

  it('should get item from cache', () => {
    const result = sdsAuthCache.get('some-key')

    expect(result).toEqual('123456')
  })

  it('should return true if item in cache', () => {
    const result = sdsAuthCache.has('some-key')

    expect(result).toBe(true)
  })

  it('should return false if item is not in  cache', () => {
    const result = sdsAuthCache.has('???')

    expect(result).toBe(false)
  })
})
