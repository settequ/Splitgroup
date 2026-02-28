import { useState, useEffect } from 'react';
import { Expense, Person, Currency } from '../../types';
import { SUPPORTED_CURRENCIES, CURRENCY_SYMBOLS } from '../../data/constants';
import { convertToBase } from '../../services/currency';

interface ExpenseFormProps {
  people: Person[];
  getRate: (from: Currency, to: Currency) => number;
  rateLoading: boolean;
  editingExpense: Expense | null;
  onSubmit: (data: {
    description: string;
    amount: number;
    currency: Currency;
    amountInBase: number;
    exchangeRate: number;
    paidBy: string;
    participants: string[];
    date: string;
  }) => void;
  onUpdate: (expense: Expense) => void;
  onClose: () => void;
}

export function ExpenseForm({
  people,
  getRate,
  rateLoading,
  editingExpense,
  onSubmit,
  onUpdate,
  onClose,
}: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [paidBy, setPaidBy] = useState(people[0]?.id ?? '');
  const [participants, setParticipants] = useState<string[]>(people.map((p) => p.id));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCurrency(editingExpense.currency);
      setPaidBy(editingExpense.paidBy);
      setParticipants(editingExpense.participants);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const rate = getRate(currency, 'EUR');
  const numAmount = parseFloat(amount) || 0;
  const convertedAmount = convertToBase(numAmount, rate);

  const toggleParticipant = (id: string) => {
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setParticipants(people.map((p) => p.id));
  const selectNone = () => setParticipants([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || numAmount <= 0 || participants.length === 0) return;

    const data = {
      description: description.trim(),
      amount: numAmount,
      currency,
      amountInBase: convertedAmount,
      exchangeRate: rate,
      paidBy,
      participants,
      date,
    };

    if (editingExpense) {
      onUpdate({ ...editingExpense, ...data });
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {editingExpense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at restaurant"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              autoFocus
              required
            />
          </div>

          {/* Amount + Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {CURRENCY_SYMBOLS[c]} {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversion preview */}
          {currency !== 'EUR' && numAmount > 0 && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
              {CURRENCY_SYMBOLS[currency]}{numAmount.toFixed(2)} = {CURRENCY_SYMBOLS.EUR}{convertedAmount.toFixed(2)}
              <span className="text-gray-400 ml-1">
                (rate: {rate.toFixed(4)}{rateLoading ? ' loading...' : ''})
              </span>
            </div>
          )}

          {/* Paid by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid by</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Split among</label>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-xs text-indigo-600 hover:text-indigo-800">
                  All
                </button>
                <button type="button" onClick={selectNone} className="text-xs text-gray-500 hover:text-gray-700">
                  None
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {people.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    participants.includes(p.id)
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={participants.includes(p.id)}
                    onChange={() => toggleParticipant(p.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {p.name}
                </label>
              ))}
            </div>
            {participants.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one person</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!description.trim() || numAmount <= 0 || participants.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
