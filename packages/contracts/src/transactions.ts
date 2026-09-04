import { z } from 'zod';
export const transactionSchema = z.object({ id: z.string().trim().min(1), type: z.enum(['INCOME', 'EXPENSE']), amount: z.number().int().positive().safe(), occurredOn: z.string().date(), categoryId: z.string().trim().min(1), memo: z.string().trim().max(500).optional() });
export type TransactionDto = z.infer<typeof transactionSchema>;
