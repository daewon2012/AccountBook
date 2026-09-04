export type TransactionContractType = 'INCOME' | 'EXPENSE';

export interface CreateTransactionRequest {
  id: string;
  type: TransactionContractType;
  amount: number;
  occurredOn: string;
  categoryId: string;
  memo?: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionContractType;
  amount?: number;
  occurredOn?: string;
  categoryId?: string;
  memo?: string;
}

export interface TransactionResponse {
  id: string;
  type: TransactionContractType;
  amount: number;
  occurredOn: string;
  categoryId: string;
  memo?: string;
}

export const TRANSACTION_ERROR_STATUS = {
  INVALID_INPUT: 400,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  REPOSITORY_UNAVAILABLE: 503,
} as const;

export type TransactionErrorCode = keyof typeof TRANSACTION_ERROR_STATUS;

export interface TransactionErrorResponse {
  code: TransactionErrorCode;
  message: string;
}
