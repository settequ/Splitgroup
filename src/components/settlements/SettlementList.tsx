import { Settlement } from '../../types';
import { CURRENCY_SYMBOLS } from '../../data/constants';

interface SettlementListProps {
  settlements: Settlement[];
}

export function SettlementList({ settlements }: SettlementListProps) {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">All settled up!</p>
        <p className="text-sm mt-1">No payments needed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
        <p className="text-sm text-gray-500">
          {settlements.length} payment{settlements.length !== 1 ? 's' : ''} to settle all debts
        </p>
      </div>

      {settlements.map((s, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-right">
              <p className="font-medium text-red-700">{s.fromName}</p>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-sm font-bold text-gray-900 mt-0.5">
                {CURRENCY_SYMBOLS.EUR}{s.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-700">{s.toName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
