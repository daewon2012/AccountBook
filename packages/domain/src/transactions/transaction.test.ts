import { describe, expect, it } from 'vitest';
import { Transaction, TransactionValidationError } from './transaction';
const valid = { id: 'tx-1', type: 'EXPENSE' as const, amount: 12500, occurredOn: '2026-09-04', categoryId: 'food', memo: ' lunch ' };
describe('Transaction', () => {
  it('creates income and expense transactions', () => { expect(Transaction.create(valid).memo).toBe('lunch'); expect(Transaction.create({ ...valid, type: 'INCOME' }).type).toBe('INCOME'); });
  it.each<Partial<typeof valid>>([{ amount: 0 }, { amount: 1.5 }, { occurredOn: '2026-02-30' }, { categoryId: ' ' }])('rejects invalid input %#', (change) => { expect(() => Transaction.create({ ...valid, ...change })).toThrow(TransactionValidationError); });
});
