import { Trip, Expense, Currency } from '../types';

const BASE = '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function fetchTrip(): Promise<Trip> {
  return request<Trip>('/api/trip');
}

export async function updateTripName(name: string): Promise<void> {
  await request('/api/trip', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export async function createExpense(data: {
  description: string;
  amount: number;
  currency: Currency;
  amountInBase: number;
  exchangeRate: number;
  paidBy: string;
  participants: string[];
  date: string;
}): Promise<Expense> {
  return request<Expense>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editExpense(expense: Expense): Promise<void> {
  await request(`/api/expenses/${expense.id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  });
}

export async function removeExpense(id: string): Promise<void> {
  await request(`/api/expenses/${id}`, { method: 'DELETE' });
}
