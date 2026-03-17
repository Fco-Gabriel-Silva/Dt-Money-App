export interface Transaction {
  id: number | string;
  typeId: number;
  categoryId: number | string;
  description: string;
  value: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | null;
  type: {
    id: number;
    name: string;
  };
  category: {
    id: number | string;
    name: string;
  };
}
