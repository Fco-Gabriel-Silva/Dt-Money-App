export interface UpdateTransactionInterface {
  id: number | string;
  description: string;
  typeId: number;
  categoryId: number | string;
  value: number;
}
