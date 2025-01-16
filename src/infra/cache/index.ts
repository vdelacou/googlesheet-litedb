import type { Cache } from '../../types/cache';

export const createCache = (cacheDurationMs: number): Cache => {
  const dbCache = new Map<string, unknown>();
  const cacheTTL = new Map<string, number>();

  const setCache = (key: string, value: unknown): void => {
    dbCache.set(key, value);
    cacheTTL.set(key, Date.now() + cacheDurationMs);
  };

  const getCache = (key: string): unknown => {
    const expiresAt = cacheTTL.get(key);
    if (expiresAt && expiresAt > Date.now()) {
      return dbCache.get(key);
    } else {
      // Cache expired or missing
      dbCache.delete(key);
      cacheTTL.delete(key);
      return null;
    }
  };

  const clearCache = (): void => {
    dbCache.clear();
    cacheTTL.clear();
  };

  return {
    setCache,
    getCache,
    clearCache,
  };
};
