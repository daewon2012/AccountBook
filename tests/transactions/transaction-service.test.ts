import {
  TransactionApplicationError,
  TransactionService,
} from '../../src/application/transactions/transaction-service';
import { TransactionRepository } from '../../src/application/transactions/transaction-repository';
import { Transaction } from '../../src/domain/transactions/transaction';
import { InMemoryTransactionRepository } from '../../src/infrastructure/transactions/in-memory-transaction-repository';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function assertRejects(
  action: () => Promise<unknown>,
  code: TransactionApplicationError['code'],
  status: number,
): Promise<void> {
  try {
    await action();
  } catch (error) {
    assert(error instanceof TransactionApplicationError, 'expected application error');
    assert(error.code === code, `expected ${code}, received ${error.code}`);
    assert(error.status === status, `expected status ${status}, received ${error.status}`);
    assert(error.toResponse().code === code, 'error response should expose the stable code');
    return;
  }
  throw new Error(`expected ${code}`);
}

async function run(): Promise<void> {
  const repository = new InMemoryTransactionRepository();
  const service = new TransactionService(repository);
  const request = {
    id: 'transaction-1',
    type: 'EXPENSE' as const,
    amount: 12_500,
    occurredOn: '2026-09-04',
    categoryId: 'groceries',
    memo: 'weekly groceries',
  };

  const created = await service.create(request);
  assert(created.id === request.id, 'create should return the transaction');
  assert((await service.get(request.id)).amount === request.amount, 'get should return saved data');

  const updated = await service.update(request.id, { amount: 15_000, memo: 'updated' });
  assert(updated.amount === 15_000, 'update should change supplied fields');
  assert(updated.categoryId === request.categoryId, 'update should preserve omitted fields');

  await assertRejects(() => service.create(request), 'ALREADY_EXISTS', 409);
  await assertRejects(() => service.create({ ...request, amount: 0 }), 'INVALID_INPUT', 400);
  await assertRejects(() => service.get('missing'), 'NOT_FOUND', 404);
  await assertRejects(() => service.update('missing', { amount: 1 }), 'NOT_FOUND', 404);
  await assertRejects(() => service.delete('missing'), 'NOT_FOUND', 404);
  await assertRejects(() => service.get(' '), 'INVALID_INPUT', 400);

  await service.delete(request.id);
  await assertRejects(() => service.get(request.id), 'NOT_FOUND', 404);

  const dependencyFailure = new TransactionService(new FailingTransactionRepository());
  await assertRejects(() => dependencyFailure.get('transaction-1'), 'REPOSITORY_UNAVAILABLE', 503);
}

class FailingTransactionRepository implements TransactionRepository {
  async save(_transaction: Transaction): Promise<void> {
    throw new Error('database unavailable');
  }

  async findById(_id: string): Promise<Transaction | null> {
    throw new Error('database unavailable');
  }

  async deleteById(_id: string): Promise<boolean> {
    throw new Error('database unavailable');
  }
}

run().catch((error: unknown) => {
  console.error(error);
  throw error;
});
