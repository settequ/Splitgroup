import { useState, useCallback } from 'react';
import { Tab, Expense } from './types';
import { useTrip } from './hooks/useTrip';
import { useCurrency } from './hooks/useCurrency';
import { useBalances } from './hooks/useBalances';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ExpenseForm } from './components/expenses/ExpenseForm';
import { BalanceSummary } from './components/balances/BalanceSummary';
import { SettlementList } from './components/settlements/SettlementList';
import { exportTrip } from './data/storage';

function App() {
  const { trip, loading, error, addExpense, updateExpense, deleteExpense } = useTrip();
  const { getRate, loading: rateLoading } = useCurrency();
  const { balances, settlements, totalSpent } = useBalances(trip);

  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    setEditingExpense(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirm(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteConfirm) {
      await deleteExpense(deleteConfirm);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteExpense]);

  const handleExport = useCallback(() => {
    const json = exportTrip(trip);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `splitgroup-${trip.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [trip]);

  const handleImport = useCallback(() => {
    // Import is handled by the file input in Header
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load trip</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tripName={trip.name}
        totalSpent={totalSpent}
        baseCurrency={trip.baseCurrency}
        expenseCount={trip.expenses.length}
        onExport={handleExport}
        onImport={handleImport}
      />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-lg mx-auto p-4 pb-20">
        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={trip.expenses}
            people={trip.people}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}
        {activeTab === 'balances' && (
          <BalanceSummary balances={balances} totalSpent={totalSpent} />
        )}
        {activeTab === 'settle' && <SettlementList settlements={settlements} />}
      </main>

      {showForm && (
        <ExpenseForm
          people={trip.people}
          getRate={getRate}
          rateLoading={rateLoading}
          editingExpense={editingExpense}
          onSubmit={async (data) => {
            await addExpense(data);
            setShowForm(false);
          }}
          onUpdate={async (expense) => {
            await updateExpense(expense);
            setShowForm(false);
            setEditingExpense(null);
          }}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900">Delete expense?</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
