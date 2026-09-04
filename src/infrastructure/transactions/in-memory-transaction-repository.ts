import { TransactionRepository } from '../../application/transactions/transaction-repository';
import { Transaction } from '../../domain/transactions/transaction';

/** Deterministic adapter for development and application tests. */
export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly transactions = new Map<string, Transaction>();

  async save(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }
}
