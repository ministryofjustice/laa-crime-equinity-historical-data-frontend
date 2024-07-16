import { LRUCache } from 'lru-cache'

type CacheOptions = {
  max?: number
  maxAge?: number
}

class CacheService {
  cache: LRUCache<string, string>

  constructor(private readonly options: CacheOptions = {}) {
    this.cache = new LRUCache<string, string>({
      max: options.max || 100,
      ttl: options.maxAge || 1000 * 60 * 60, // 1 hr
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

export const SDS_ACCESS_TOKEN = 'sds-access-token'

const cacheService = new CacheService()

export default cacheService
