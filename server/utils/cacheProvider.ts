import { LRUCache } from 'lru-cache'
import { CrmResponse } from '@eqApi'
import config from '../config'

type CacheOptions = {
  max: number
  ttlMinutes: number
}

class CacheProvider<T> {
  cache: LRUCache<string, T>

  constructor(private readonly options: CacheOptions) {
    this.cache = new LRUCache<string, T>({
      max: this.options.max,
      ttl: 1000 * 60 * options.ttlMinutes,
    })
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  get(key: string): T {
    return this.cache.get(key)
  }

  set(key: string, value: T): void {
    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
  }
}

const crmApiCache = new CacheProvider<CrmResponse>({
  max: config.cache.crmApiCache.max,
  ttlMinutes: config.cache.crmApiCache.ttlMinutes,
})

const sdsAuthCache = new CacheProvider<string>({
  max: config.cache.sdsAuthCache.max,
  ttlMinutes: config.cache.sdsAuthCache.ttlMinutes,
})

export { crmApiCache, sdsAuthCache }
