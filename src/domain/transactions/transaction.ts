export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface TransactionProps {
  id: string;
  type: TransactionType;
  amount: number;
  occurredOn: string;
  categoryId: string;
  memo?: string;
}

export class TransactionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionValidationError';
  }
}

/**
 * A framework-independent transaction aggregate.
 * Amounts are stored as positive integers in the currency's smallest unit.
 */
export class Transaction {
  readonly id: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly occurredOn: string;
  readonly categoryId: string;
  readonly memo?: string;

  private constructor(props: TransactionProps) {
    this.id = props.id;
    this.type = props.type;
    this.amount = props.amount;
    this.occurredOn = props.occurredOn;
    this.categoryId = props.categoryId;
    this.memo = props.memo;
  }

  static create(props: TransactionProps): Transaction {
    const id = requireText(props.id, 'id');
    const categoryId = requireText(props.categoryId, 'categoryId');

    if (!TRANSACTION_TYPES.includes(props.type)) {
      throw new TransactionValidationError('type must be INCOME or EXPENSE');
    }

    if (!Number.isSafeInteger(props.amount) || props.amount <= 0) {
      throw new TransactionValidationError('amount must be a positive safe integer');
    }

    if (!isCalendarDate(props.occurredOn)) {
      throw new TransactionValidationError('occurredOn must be a valid YYYY-MM-DD date');
    }

    const memo = normalizeMemo(props.memo);
    return new Transaction({ ...props, id, categoryId, memo });
  }

  toProps(): TransactionProps {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      occurredOn: this.occurredOn,
      categoryId: this.categoryId,
      ...(this.memo === undefined ? {} : { memo: this.memo }),
    };
  }
}

function requireText(value: string, field: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new TransactionValidationError(`${field} must not be empty`);
  }
  return normalized;
}

function normalizeMemo(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (normalized.length > 500) {
    throw new TransactionValidationError('memo must be at most 500 characters');
  }
  return normalized || undefined;
}

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
