
type CachedData = {
  data: { name: string; value: number; color: string }[];
  timestamp: number;
  stale: boolean;
};

const CACHE_EXPIRATION = 48 * 60 * 60 * 1000; // 48 hours
const STALE_EXPIRATION = 14 * 24 * 60 * 60 * 1000; // 14 days

class PaymentStatusCache {
  private cache = new Map<string, CachedData>();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedCache = localStorage.getItem('payment-status-cache');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        Object.entries(parsedCache).forEach(([key, value]) => {
          this.cache.set(key, value as CachedData);
        });
        console.log('Loaded payment status cache from localStorage');
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
    }
  }

  private persistToLocalStorage() {
    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      localStorage.setItem('payment-status-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  get(key: string): CachedData | undefined {
    return this.cache.get(key);
  }

  set(key: string, data: CachedData) {
    this.cache.set(key, data);
    this.persistToLocalStorage();
  }

  isValidCache(cachedData: CachedData | undefined): boolean {
    if (!cachedData) return false;
    const now = Date.now();
    return now - cachedData.timestamp < CACHE_EXPIRATION;
  }

  isStaleButUsable(cachedData: CachedData | undefined): boolean {
    if (!cachedData) return false;
    const now = Date.now();
    return now - cachedData.timestamp < STALE_EXPIRATION;
  }
}

export const paymentStatusCache = new PaymentStatusCache();
export { CACHE_EXPIRATION, STALE_EXPIRATION };
