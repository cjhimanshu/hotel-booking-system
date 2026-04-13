// Caching utility for performance optimization
const cache = new Map();

const getFromCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (item.expireAt && item.expireAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return item.value;
};

const setInCache = (key, value, ttlSeconds = 300) => {
  cache.set(key, {
    value,
    expireAt: Date.now() + ttlSeconds * 1000,
  });
};

const clearCache = (pattern = null) => {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.match(pattern)) {
      cache.delete(key);
    }
  }
};

module.exports = {
  getFromCache,
  setInCache,
  clearCache,
};
