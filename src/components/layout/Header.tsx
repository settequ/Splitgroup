import { CURRENCY_SYMBOLS } from '../../data/constants';
import { Currency } from '../../types';

interface HeaderProps {
  tripName: string;
  totalSpent: number;
  baseCurrency: Currency;
  expenseCount: number;
  onExport: () => void;
  onImport: () => void;
}

export function Header({ tripName, totalSpent, baseCurrency, expenseCount, onExport, onImport }: HeaderProps) {
  return (
    <header className="bg-indigo-600 text-white px-4 py-5 shadow-lg">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold">{tripName}</h1>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <span className="text-indigo-200 text-sm">Total spent: </span>
            <span className="text-lg font-semibold">
              {CURRENCY_SYMBOLS[baseCurrency]}{totalSpent.toFixed(2)}
            </span>
            <span className="text-indigo-300 text-xs ml-2">({expenseCount} expenses)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="text-xs bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded transition-colors"
            >
              Export
            </button>
            <label className="text-xs bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded cursor-pointer transition-colors">
              Import
              <input type="file" accept=".json" className="hidden" onChange={onImport as any} />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
