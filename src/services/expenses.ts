import { Expense, Trip, Currency } from '../types';

export function addExpense(
  trip: Trip,
  data: {
    description: string;
    amount: number;
    currency: Currency;
    amountInBase: number;
    exchangeRate: number;
    paidBy: string;
    participants: string[];
    date: string;
  }
): Trip {
  const expense: Expense = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  return { ...trip, expenses: [...trip.expenses, expense] };
}

export function updateExpense(trip: Trip, updated: Expense): Trip {
  return {
    ...trip,
    expenses: trip.expenses.map((e) => (e.id === updated.id ? updated : e)),
  };
}

export function deleteExpense(trip: Trip, expenseId: string): Trip {
  return {
    ...trip,
    expenses: trip.expenses.filter((e) => e.id !== expenseId),
  };
}
