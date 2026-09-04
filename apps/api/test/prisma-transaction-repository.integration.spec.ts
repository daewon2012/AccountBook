import { Transaction } from '@accountbook/domain/transactions';
import { PrismaClient } from '@prisma/client';
import { PrismaTransactionRepository } from '../src/modules/transactions/prisma-transaction-repository';

describe('PrismaTransactionRepository', () => {
  const prisma = new PrismaClient();
  const householdId = 'household-repository-test';
  const categoryId = 'category-repository-test';
  const repository = new PrismaTransactionRepository(prisma, householdId);

  beforeAll(async () => {
    await prisma.household.upsert({ where: { id: householdId }, create: { id: householdId, name: 'Test' }, update: {} });
    await prisma.category.upsert({ where: { id: categoryId }, create: { id: categoryId, householdId, name: 'Food' }, update: {} });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { householdId } });
    await prisma.category.deleteMany({ where: { householdId } });
    await prisma.household.deleteMany({ where: { id: householdId } });
    await prisma.$disconnect();
  });

  it('saves, restores and deletes a transaction', async () => {
    const transaction = Transaction.create({ id: 'tx-repository-test', type: 'EXPENSE', amount: 12500, occurredOn: '2026-09-04', categoryId, memo: 'Lunch' });
    await repository.save(transaction);
    expect((await repository.findById(transaction.id))?.toProps()).toEqual(transaction.toProps());
    await expect(repository.deleteById(transaction.id)).resolves.toBe(true);
    await expect(repository.findById(transaction.id)).resolves.toBeNull();
  });
});
