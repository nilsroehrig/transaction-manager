import type { Transaction, CreateTransactionInput } from './model.js';

const STORAGE_KEY = 'transactions';

export function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
}

export function createTransaction(input: CreateTransactionInput): Transaction {
  return {
    id: crypto.randomUUID(),
    ...input,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function revertTransaction(originalTransaction: Transaction): {
  reversal: Transaction;
} {
  const reversalId = crypto.randomUUID();
  
  const reversal: Transaction = {
    id: reversalId,
    type: originalTransaction.type === 'income' ? 'expense' : 'income',
    amount: originalTransaction.amount,
    description: `Revert: ${originalTransaction.description}`,
    category: originalTransaction.category,
    status: 'pending',
    createdAt: new Date().toISOString(),
    reversesTransactionId: originalTransaction.id,
    ...(originalTransaction.counterpartyId && { counterpartyId: originalTransaction.counterpartyId }),
  };

  return { reversal };
}

