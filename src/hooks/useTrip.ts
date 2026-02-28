import { useState, useCallback, useEffect, useRef } from 'react';
import { Trip, Expense, Currency } from '../types';
import { fetchTrip, createExpense, editExpense, removeExpense, updateTripName } from '../services/api';
import { DEFAULT_PEOPLE, BASE_CURRENCY } from '../data/constants';

const POLL_INTERVAL = 15_000; // 15 seconds

function emptyTrip(): Trip {
  return {
    id: 'default-trip',
    name: 'Our Trip',
    people: DEFAULT_PEOPLE,
    expenses: [],
    baseCurrency: BASE_CURRENCY,
  };
}

export function useTrip() {
  const [trip, setTrip] = useState<Trip>(emptyTrip);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const data = await fetchTrip();
      setTrip(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [load]);

  const handleAddExpense = useCallback(
    async (data: {
      description: string;
      amount: number;
      currency: Currency;
      amountInBase: number;
      exchangeRate: number;
      paidBy: string;
      participants: string[];
      date: string;
    }) => {
      const expense = await createExpense(data);
      setTrip((prev) => ({ ...prev, expenses: [expense, ...prev.expenses] }));
    },
    []
  );

  const handleUpdateExpense = useCallback(async (expense: Expense) => {
    await editExpense(expense);
    setTrip((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === expense.id ? expense : e)),
    }));
  }, []);

  const handleDeleteExpense = useCallback(async (expenseId: string) => {
    await removeExpense(expenseId);
    setTrip((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
  }, []);

  const handleSetTripName = useCallback(async (name: string) => {
    await updateTripName(name);
    setTrip((prev) => ({ ...prev, name }));
  }, []);

  return {
    trip,
    loading,
    error,
    refresh: load,
    addExpense: handleAddExpense,
    updateExpense: handleUpdateExpense,
    deleteExpense: handleDeleteExpense,
    setTripName: handleSetTripName,
  };
}
