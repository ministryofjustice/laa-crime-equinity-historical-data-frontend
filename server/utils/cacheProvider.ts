import { LRUCache } from 'lru-cache'

type CacheOptions = {
  max?: number
  maxAge?: number
}

class CacheProvider {
  cache: LRUCache<string, string>

  constructor(private readonly options: CacheOptions = {}) {
    this.cache = new LRUCache<string, string>({
      max: this.options.max || 100,
      ttl: this.options.maxAge || 1000 * 60 * 60, // 1 hr
    })
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  get(key: string): string {
    return this.cache.get(key)
  }

  set(key: string, value: string): void {
    this.cache.set(key, value)
  }
}

const sdsAuthCache = new CacheProvider({ maxAge: 1000 * 60 * 50 }) // 50 minutes

export default sdsAuthCache
