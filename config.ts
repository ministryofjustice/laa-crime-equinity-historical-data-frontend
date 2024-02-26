const production = process.env.NODE_ENV === 'production'
export default {
  buildNumber: 1,
  gitRef: 1,
  staticResourceCacheDuration: '1h',
  https: production
}
