import { Transaction } from '../../domain/transactions/transaction';

/** Application port implemented by persistence adapters. */
export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
}
