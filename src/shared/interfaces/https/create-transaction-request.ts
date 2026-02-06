export interface CreateTransactionInterface {
  description: string;
  typeId: number;
  categoryId: number;
  value: number;
}

export interface CreateTransactionInterfaceLocal {
  id: number;
  description: string;
  typeId: number;
  categoryId: number;
  value: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  isLocal: boolean;
}
