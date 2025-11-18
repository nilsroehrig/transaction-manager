import type { RandomUser } from './api/randomUser.js';

export type Counterparty = RandomUser;

export function getFullName(counterparty: Counterparty): string {
  return `${counterparty.name.first} ${counterparty.name.last}`;
}

export function getCounterpartyId(counterparty: Counterparty): string {
  return counterparty.login.uuid;
}

