const NodeCache = require('node-cache');

class Cache {
  constructor(ttlSeconds = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flushAll() {
    return this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Create a singleton instance with 60s TTL
const cache = new Cache(60);

module.exports = cache;
