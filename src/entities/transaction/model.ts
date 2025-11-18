export type TransactionStatus = 'pending' | 'approved' | 'declined' | 'processed' | 'reverted';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  status: TransactionStatus;
  createdAt: string;
  processedAt?: string;
  revertedBy?: string;
  reversesTransactionId?: string;
  counterpartyId?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  counterpartyId?: string;
}

