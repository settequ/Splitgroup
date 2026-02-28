import { useMemo } from 'react';
import { Trip, Balance, Settlement } from '../types';
import { calculateBalances } from '../services/balances';
import { calculateSettlements } from '../services/settlements';

export function useBalances(trip: Trip) {
  const balances: Balance[] = useMemo(
    () => calculateBalances(trip.people, trip.expenses),
    [trip.people, trip.expenses]
  );

  const settlements: Settlement[] = useMemo(
    () => calculateSettlements(balances, trip.people),
    [balances, trip.people]
  );

  const totalSpent = useMemo(
    () => Math.round(trip.expenses.reduce((sum, e) => sum + e.amountInBase, 0) * 100) / 100,
    [trip.expenses]
  );

  return { balances, settlements, totalSpent };
}
