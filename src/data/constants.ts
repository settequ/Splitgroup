import { Person, Currency } from '../types';

export const DEFAULT_PEOPLE: Person[] = [
  { id: 'filippo', name: 'Filippo' },
  { id: 'cristian', name: 'Cristian' },
  { id: 'davide', name: 'Davide' },
  { id: 'pietro', name: 'Pietro' },
  { id: 'francesca', name: 'Francesca' },
  { id: 'elisa', name: 'Elisa' },
];

export const BASE_CURRENCY: Currency = 'EUR';

export const SUPPORTED_CURRENCIES: Currency[] = ['EUR', 'USD'];

export const FALLBACK_RATES: Record<string, number> = {
  USD_EUR: 0.92,
  EUR_USD: 1.09,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '\u20AC',
  USD: '$',
};

export const RATE_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
