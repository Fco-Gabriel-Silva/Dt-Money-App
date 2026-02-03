export interface Transaction {
  id: number;
  typeId: number;
  categoryId: number;
  description: string | undefined;
  userId: number;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  type: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}
