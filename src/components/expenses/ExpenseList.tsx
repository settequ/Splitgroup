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
  return (
    <div className="space-y-3">
      <button
        onClick={onAdd}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
      >
        + Add Expense
      </button>

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No expenses yet</p>
          <p className="text-sm mt-1">Add your first expense to get started</p>
        </div>
      ) : (
        expenses.map((expense) => (
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
