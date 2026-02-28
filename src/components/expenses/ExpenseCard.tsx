import { Expense, Person } from '../../types';
import { CURRENCY_SYMBOLS } from '../../data/constants';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, people, onEdit, onDelete }: ExpenseCardProps) {
  const payer = people.find((p) => p.id === expense.paidBy);
  const participantNames = expense.participants
    .map((pid) => people.find((p) => p.id === pid)?.name ?? pid)
    .join(', ');
  const sharePerPerson = expense.amountInBase / expense.participants.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{expense.description}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {payer?.name} paid{' '}
            <span className="font-medium text-gray-700">
              {CURRENCY_SYMBOLS[expense.currency]}{expense.amount.toFixed(2)}
            </span>
            {expense.currency !== 'EUR' && (
              <span className="text-gray-400 ml-1">
                ({CURRENCY_SYMBOLS.EUR}{expense.amountInBase.toFixed(2)})
              </span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Split among {expense.participants.length}: {participantNames}
          </p>
          <p className="text-xs text-gray-400">
            {CURRENCY_SYMBOLS.EUR}{sharePerPerson.toFixed(2)}/person &middot; {expense.date}
          </p>
        </div>
        <div className="flex gap-1 ml-2 shrink-0">
          <button
            onClick={() => onEdit(expense)}
            className="text-gray-400 hover:text-indigo-600 p-1 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
