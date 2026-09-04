export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export interface TransactionProps { id: string; type: TransactionType; amount: number; occurredOn: string; categoryId: string; memo?: string; }
export class TransactionValidationError extends Error { constructor(message: string) { super(message); this.name = 'TransactionValidationError'; } }
export class Transaction {
  private constructor(private readonly props: TransactionProps) {}
  static create(input: TransactionProps): Transaction {
    const id = requireText(input.id, 'id');
    const categoryId = requireText(input.categoryId, 'categoryId');
    if (!TRANSACTION_TYPES.includes(input.type)) throw new TransactionValidationError('type must be INCOME or EXPENSE');
    if (!Number.isSafeInteger(input.amount) || input.amount <= 0) throw new TransactionValidationError('amount must be a positive safe integer');
    if (!isCalendarDate(input.occurredOn)) throw new TransactionValidationError('occurredOn must be a valid YYYY-MM-DD date');
    const memo = normalizeMemo(input.memo);
    const { memo: _memo, ...required } = input;
    return new Transaction({ ...required, id, categoryId, ...(memo === undefined ? {} : { memo }) });
  }
  get id() { return this.props.id; } get type() { return this.props.type; } get amount() { return this.props.amount; }
  get occurredOn() { return this.props.occurredOn; } get categoryId() { return this.props.categoryId; } get memo() { return this.props.memo; }
  toProps(): TransactionProps { return { ...this.props }; }
}
function requireText(value: string, field: string): string { const normalized = value?.trim(); if (!normalized) throw new TransactionValidationError(`${field} must not be empty`); return normalized; }
function normalizeMemo(value?: string): string | undefined { if (value === undefined) return undefined; const normalized = value.trim(); if (normalized.length > 500) throw new TransactionValidationError('memo must be at most 500 characters'); return normalized || undefined; }
function isCalendarDate(value: string): boolean { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]); const date = new Date(Date.UTC(year, month - 1, day)); return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day; }
