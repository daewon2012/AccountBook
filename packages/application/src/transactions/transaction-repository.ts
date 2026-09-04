import type { Transaction } from '@accountbook/domain/transactions';
export interface TransactionRepository { save(transaction: Transaction): Promise<void>; findById(id: string): Promise<Transaction | null>; deleteById(id: string): Promise<boolean>; }
