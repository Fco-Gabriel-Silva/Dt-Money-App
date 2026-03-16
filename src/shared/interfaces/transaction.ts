export interface Transaction {
  id: number | string;
  typeId: number | string;
  categoryId: number | string;
  description: string;
  value: number;
  isLocal?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | null;
  type: {
    id: number | string;
    name: string;
  };
  category: {
    id: number | string;
    name: string;
  };
}
