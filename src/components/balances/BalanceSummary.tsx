import { Balance } from '../../types';
import { CURRENCY_SYMBOLS } from '../../data/constants';

interface BalanceSummaryProps {
  balances: Balance[];
  totalSpent: number;
}

export function BalanceSummary({ balances, totalSpent }: BalanceSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
        <p className="text-sm text-gray-500">Total group spending</p>
        <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOLS.EUR}{totalSpent.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-1">{CURRENCY_SYMBOLS.EUR}{(totalSpent / Math.max(balances.length, 1)).toFixed(2)} per person (if split equally)</p>
      </div>

      {balances.map((b) => {
        const isPositive = b.netBalance > 0.01;
        const isNegative = b.netBalance < -0.01;

        return (
          <div
            key={b.personId}
            className={`rounded-lg shadow-sm border p-4 ${
              isPositive
                ? 'bg-green-50 border-green-200'
                : isNegative
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{b.personName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paid: {CURRENCY_SYMBOLS.EUR}{b.totalPaid.toFixed(2)} &middot; Share: {CURRENCY_SYMBOLS.EUR}{b.totalShare.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    isPositive ? 'text-green-700' : isNegative ? 'text-red-700' : 'text-gray-500'
                  }`}
                >
                  {b.netBalance > 0 ? '+' : ''}{CURRENCY_SYMBOLS.EUR}{b.netBalance.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {isPositive ? 'is owed' : isNegative ? 'owes' : 'settled'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
