export type Currency = 'EUR' | 'USD';

export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: Currency;
  amountInBase: number;
  exchangeRate: number;
  paidBy: string;
  participants: string[];
  date: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
  baseCurrency: Currency;
}

export interface Balance {
  personId: string;
  personName: string;
  totalPaid: number;
  totalShare: number;
  netBalance: number;
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export type Tab = 'expenses' | 'balances' | 'settle';
