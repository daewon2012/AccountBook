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

  const income = Transaction.create({
    id: 'transaction-2',
    type: 'INCOME',
    amount: 3_000_000,
    occurredOn: '2024-02-29',
    categoryId: 'salary',
  });

  assert(income.type === 'INCOME', 'income transactions should be supported');
  assert(income.memo === undefined, 'memo should remain optional');

  assertThrows(
    () => Transaction.create({ ...expense.toProps(), id: ' ' }),
    'id must not be empty',
  );

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
  assertThrows(
    () => Transaction.create({ ...expense.toProps(), amount: Number.MAX_SAFE_INTEGER + 1 }),
    'amount must be a positive safe integer',
  );
  assertThrows(
    () => Transaction.create({ ...expense.toProps(), memo: 'a'.repeat(501) }),
    'memo must be at most 500 characters',
  );

  const repository = new InMemoryTransactionRepository();
  await repository.save(expense);
  assert((await repository.findById(expense.id)) === expense, 'saved transaction should be found');
  assert((await repository.findById('missing')) === null, 'missing transaction should return null');

  const updatedExpense = Transaction.create({ ...expense.toProps(), amount: 15_000 });
  await repository.save(updatedExpense);
  assert(
    (await repository.findById(expense.id)) === updatedExpense,
    'saving the same id should replace the stored transaction',
  );
}

run().catch((error: unknown) => {
  console.error(error);
  throw error;
});
