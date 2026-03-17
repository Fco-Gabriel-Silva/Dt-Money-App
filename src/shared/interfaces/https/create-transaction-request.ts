export interface CreateTransactionInterface {
  description: string;
  typeId: number;
  categoryId: number | string;
  value: number;
}
