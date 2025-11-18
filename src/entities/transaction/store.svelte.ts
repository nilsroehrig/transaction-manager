import type { Transaction, CreateTransactionInput } from './model.js';
import * as api from './api.js';

class TransactionStore {
  private _transactions = $state<Transaction[]>(api.loadTransactions());

  private save() {
    api.saveTransactions(this._transactions);
  }

  get transactions(): readonly Readonly<Transaction>[] {
    return this._transactions;
  }

  createTransaction(input: CreateTransactionInput): Transaction {
    const transaction = api.createTransaction(input);
    this._transactions.push(transaction);
    this.save();
    return transaction;
  }

  approveTransaction(id: string): void {
    const transaction = this._transactions.find((t) => t.id === id);
    if (transaction) {
      if (transaction.type === 'income') {
        throw new Error('Income transactions cannot be approved. Use markAsProcessed instead.');
      }
      transaction.status = 'approved';
      transaction.processedAt = new Date().toISOString();
      
      if (transaction.reversesTransactionId) {
        const originalTransaction = this._transactions.find((t) => t.id === transaction.reversesTransactionId);
        if (originalTransaction) {
          originalTransaction.status = 'reverted';
          originalTransaction.processedAt = new Date().toISOString();
          originalTransaction.revertedBy = transaction.id;
        }
      }
      
      this.save();
    }
  }

  declineTransaction(id: string): void {
    const transaction = this._transactions.find((t) => t.id === id);
    if (transaction) {
      if (transaction.type === 'income') {
        throw new Error('Income transactions cannot be declined');
      }
      transaction.status = 'declined';
      transaction.processedAt = new Date().toISOString();
      
      if (transaction.reversesTransactionId) {
        const originalTransaction = this._transactions.find((t) => t.id === transaction.reversesTransactionId);
        if (originalTransaction && originalTransaction.status === 'reverted' && originalTransaction.revertedBy === transaction.id) {
          const wasProcessed = originalTransaction.type === 'income';
          originalTransaction.status = wasProcessed ? 'processed' : 'approved';
          originalTransaction.revertedBy = undefined;
        }
      }
      
      this.save();
    }
  }

  markAsProcessed(id: string): void {
    const transaction = this._transactions.find((t) => t.id === id);
    if (transaction) {
      if (transaction.type !== 'income') {
        throw new Error('Only income transactions can be marked as processed');
      }
      transaction.status = 'processed';
      transaction.processedAt = new Date().toISOString();
      
      if (transaction.reversesTransactionId) {
        const originalTransaction = this._transactions.find((t) => t.id === transaction.reversesTransactionId);
        if (originalTransaction) {
          originalTransaction.status = 'reverted';
          originalTransaction.processedAt = new Date().toISOString();
          originalTransaction.revertedBy = transaction.id;
        }
      }
      
      this.save();
    }
  }

  revertTransaction(id: string): Transaction {
    const transaction = this._transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error(`Transaction ${id} not found`);
    }
    if (transaction.status !== 'approved' && transaction.status !== 'processed') {
      throw new Error('Only approved or processed transactions can be reverted');
    }
    if (transaction.revertedBy) {
      throw new Error('Transaction has already been reverted');
    }
    
    const existingReversal = this._transactions.find(
      (t) => t.reversesTransactionId === id && t.status === 'pending'
    );
    if (existingReversal) {
      throw new Error('A reversal transaction is already pending for this transaction');
    }
    
    const { reversal } = api.revertTransaction(transaction);
    
    this._transactions.push(reversal);
    this.save();
    return reversal;
  }
}

export const transactionStore = new TransactionStore();

