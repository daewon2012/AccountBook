import {
  CreateTransactionRequest,
  TransactionErrorCode,
  TransactionErrorResponse,
  TransactionResponse,
  TRANSACTION_ERROR_STATUS,
  UpdateTransactionRequest,
} from '../../contracts/transactions/transaction-contract';
import {
  Transaction,
  TransactionProps,
  TransactionValidationError,
} from '../../domain/transactions/transaction';
import { TransactionRepository } from './transaction-repository';

export class TransactionApplicationError extends Error {
  readonly status: number;

  constructor(
    readonly code: TransactionErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'TransactionApplicationError';
    this.status = TRANSACTION_ERROR_STATUS[code];
  }

  toResponse(): TransactionErrorResponse {
    return { code: this.code, message: this.message };
  }
}

export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  async create(request: CreateTransactionRequest): Promise<TransactionResponse> {
    const id = requireId(request.id);
    const transaction = createTransaction({ ...request, id });
    if (await this.readFromRepository(id)) {
      throw new TransactionApplicationError('ALREADY_EXISTS', `transaction ${id} already exists`);
    }

    await this.writeToRepository(() => this.repository.save(transaction));
    return toResponse(transaction);
  }

  async update(idInput: string, request: UpdateTransactionRequest): Promise<TransactionResponse> {
    const id = requireId(idInput);
    const current = await this.requireTransaction(id);
    const transaction = createTransaction({ ...current.toProps(), ...request, id });

    await this.writeToRepository(() => this.repository.save(transaction));
    return toResponse(transaction);
  }

  async delete(idInput: string): Promise<void> {
    const id = requireId(idInput);
    const deleted = await this.writeToRepository(() => this.repository.deleteById(id));
    if (!deleted) {
      throw notFound(id);
    }
  }

  async get(idInput: string): Promise<TransactionResponse> {
    return toResponse(await this.requireTransaction(requireId(idInput)));
  }

  private async requireTransaction(id: string): Promise<Transaction> {
    const transaction = await this.readFromRepository(id);
    if (!transaction) throw notFound(id);
    return transaction;
  }

  private readFromRepository(id: string): Promise<Transaction | null> {
    return this.writeToRepository(() => this.repository.findById(id));
  }

  private async writeToRepository<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof TransactionApplicationError) throw error;
      throw new TransactionApplicationError(
        'REPOSITORY_UNAVAILABLE',
        'transaction repository is unavailable',
        { cause: error },
      );
    }
  }
}

function createTransaction(props: TransactionProps): Transaction {
  try {
    return Transaction.create(props);
  } catch (error) {
    if (error instanceof TransactionValidationError) {
      throw new TransactionApplicationError('INVALID_INPUT', error.message, { cause: error });
    }
    throw error;
  }
}

function requireId(value: string): string {
  const id = value?.trim();
  if (!id) {
    throw new TransactionApplicationError('INVALID_INPUT', 'id must not be empty');
  }
  return id;
}

function notFound(id: string): TransactionApplicationError {
  return new TransactionApplicationError('NOT_FOUND', `transaction ${id} was not found`);
}

function toResponse(transaction: Transaction): TransactionResponse {
  return transaction.toProps();
}
