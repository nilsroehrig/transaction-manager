import type { Counterparty } from './model.js';
import { getCounterpartyId } from './model.js';
import type { RandomUser } from './api/randomUser.js';

const STORAGE_KEY = 'counterparties';

export function loadCounterparties(): Counterparty[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Counterparty[];
  } catch (error) {
    console.error('Failed to load counterparties:', error);
    return [];
  }
}

export function saveCounterparties(counterparties: Counterparty[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counterparties));
  } catch (error) {
    console.error('Failed to save counterparties:', error);
  }
}

export function addCounterparty(user: RandomUser): Counterparty {
  const counterparties = loadCounterparties();
  const userId = user.login.uuid;

  const existing = counterparties.find(p => getCounterpartyId(p) === userId);
  if (existing) {
    return existing;
  }

  const counterparty: Counterparty = user;
  counterparties.push(counterparty);
  saveCounterparties(counterparties);
  return counterparty;
}

