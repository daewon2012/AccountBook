import { InMemoryTransactionRepository } from '../../src/infrastructure/transactions/in-memory-transaction-repository';
import {
  Transaction,
  TransactionValidationError,
} from '../../src/domain/transactions/transaction';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertThrows(action: () => unknown, expectedMessage: string): void {
  try {
    action();
  } catch (error) {
    assert(error instanceof TransactionValidationError, 'expected validation error');
    assert(error.message === expectedMessage, `unexpected error: ${error.message}`);
    return;
  }
  throw new Error('expected action to throw');
}

async function run(): Promise<void> {
  const expense = Transaction.create({
    id: 'transaction-1',
    type: 'EXPENSE',
    amount: 12_500,
    occurredOn: '2026-09-04',
    categoryId: 'groceries',
    memo: '  weekly groceries  ',
  });

  assert(expense.amount === 12_500, 'amount should use the smallest currency unit');
  assert(expense.memo === 'weekly groceries', 'memo should be normalized');

  assertThrows(
    () => Transaction.create({ ...expense.toProps(), amount: 0 }),
    'amount must be a positive safe integer',
  );
  assertThrows(
    () => Transaction.create({ ...expense.toProps(), occurredOn: '2026-02-30' }),
    'occurredOn must be a valid YYYY-MM-DD date',
  );
  assertThrows(
    () => Transaction.create({ ...expense.toProps(), categoryId: ' ' }),
    'categoryId must not be empty',
  );

  const repository = new InMemoryTransactionRepository();
  await repository.save(expense);
  assert((await repository.findById(expense.id)) === expense, 'saved transaction should be found');
  assert((await repository.findById('missing')) === null, 'missing transaction should return null');
}

run().catch((error: unknown) => {
  console.error(error);
  throw error;
});
