import { useState, useEffect, useCallback } from 'react';
import { Currency } from '../types';
import { fetchExchangeRate } from '../services/currency';

export function useCurrency() {
  const [rates, setRates] = useState<Record<string, number>>({ EUR_EUR: 1, USD_USD: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchExchangeRate('USD', 'EUR').then((rate) => {
      if (!cancelled) {
        setRates((prev) => ({
          ...prev,
          USD_EUR: rate,
          EUR_USD: Math.round((1 / rate) * 10000) / 10000,
        }));
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const getRate = useCallback(
    (from: Currency, to: Currency): number => {
      if (from === to) return 1;
      return rates[`${from}_${to}`] ?? 1;
    },
    [rates]
  );

  return { rates, getRate, loading };
}
