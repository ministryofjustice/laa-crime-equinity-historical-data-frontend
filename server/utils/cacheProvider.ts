import { LRUCache } from 'lru-cache'
import config from '../config'

type CacheOptions = {
  max?: number
  ttlMinutes?: number
}

class CacheProvider {
  cache: LRUCache<string, string>

  constructor(private readonly options: CacheOptions = {}) {
    this.cache = new LRUCache<string, string>({
      max: this.options.max || 100,
      ttl: 1000 * 60 * (options.ttlMinutes || 60),
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

const sdsAuthCache = new CacheProvider({ ttlMinutes: config.cache.sdsAuthCache.ttlMinutes }) // 50 minutes

export default sdsAuthCache
