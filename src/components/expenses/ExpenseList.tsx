import { useState } from 'react';
import { Expense, Person } from '../../types';
import { ExpenseCard } from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ExpenseList({ expenses, people, onEdit, onDelete, onAdd }: ExpenseListProps) {
  const [filterPayer, setFilterPayer] = useState('');

  const filteredExpenses = filterPayer
    ? expenses.filter((e) => e.paidBy === filterPayer)
    : expenses;

  return (
    <div className="space-y-3">
      <button
        onClick={onAdd}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
      >
        + Add Expense
      </button>

      <select
        value={filterPayer}
        onChange={(e) => setFilterPayer(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All payers</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No expenses yet</p>
          <p className="text-sm mt-1">Add your first expense to get started</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No expenses for this payer</p>
          <p className="text-sm mt-1">Select a different payer or choose "All payers"</p>
        </div>
      ) : (
        filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            people={people}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
