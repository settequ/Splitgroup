import { Currency } from '../types';
import { FALLBACK_RATES, RATE_CACHE_DURATION_MS } from '../data/constants';

interface CachedRate {
  rate: number;
  timestamp: number;
}

const CACHE_KEY = 'splitgroup_rates';

function loadCache(): Record<string, CachedRate> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, CachedRate>): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function getCacheKey(from: Currency, to: Currency): string {
  return `${from}_${to}`;
}

export async function fetchExchangeRate(from: Currency, to: Currency): Promise<number> {
  if (from === to) return 1;

  const cacheKey = getCacheKey(from, to);
  const cache = loadCache();
  const cached = cache[cacheKey];

  if (cached && Date.now() - cached.timestamp < RATE_CACHE_DURATION_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rate = data.rates[to] as number;

    cache[cacheKey] = { rate, timestamp: Date.now() };
    saveCache(cache);
    return rate;
  } catch {
    // Fallback: cached (even if stale), then hardcoded
    if (cached) return cached.rate;
    return FALLBACK_RATES[cacheKey] ?? 1;
  }
}

export function convertToBase(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}
