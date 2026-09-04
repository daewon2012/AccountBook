import type { TransactionRepository } from '@accountbook/application/transactions';
import { Transaction } from '@accountbook/domain/transactions';
import { PrismaClient } from '@prisma/client';

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaClient, private readonly householdId: string) {}

  async save(transaction: Transaction): Promise<void> {
    const values = transaction.toProps();
    const data = {
      householdId: this.householdId,
      type: values.type,
      amount: BigInt(values.amount),
      occurredOn: new Date(`${values.occurredOn}T00:00:00.000Z`),
      categoryId: values.categoryId,
      memo: values.memo ?? null,
    };
    await this.prisma.transaction.upsert({ where: { id: values.id }, create: { id: values.id, ...data }, update: data });
  }

  async findById(id: string): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findFirst({ where: { id, householdId: this.householdId } });
    if (!record) return null;
    return Transaction.create({
      id: record.id,
      type: record.type,
      amount: Number(record.amount),
      occurredOn: record.occurredOn.toISOString().slice(0, 10),
      categoryId: record.categoryId,
      ...(record.memo === null ? {} : { memo: record.memo }),
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.transaction.deleteMany({ where: { id, householdId: this.householdId } });
    return result.count === 1;
  }
}
