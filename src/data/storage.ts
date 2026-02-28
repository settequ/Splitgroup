import { Trip } from '../types';
import { DEFAULT_PEOPLE, BASE_CURRENCY } from './constants';

const STORAGE_KEY = 'splitgroup_trip';

function createDefaultTrip(): Trip {
  return {
    id: crypto.randomUUID(),
    name: 'Our Trip',
    people: DEFAULT_PEOPLE,
    expenses: [],
    baseCurrency: BASE_CURRENCY,
  };
}

export function loadTrip(): Trip {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Trip;
    }
  } catch {
    // Corrupted data — start fresh
  }
  return createDefaultTrip();
}

export function saveTrip(trip: Trip): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
}

export function exportTrip(trip: Trip): string {
  return JSON.stringify(trip, null, 2);
}

export function importTrip(json: string): Trip {
  const trip = JSON.parse(json) as Trip;
  if (!trip.id || !trip.people || !trip.expenses) {
    throw new Error('Invalid trip data');
  }
  return trip;
}
