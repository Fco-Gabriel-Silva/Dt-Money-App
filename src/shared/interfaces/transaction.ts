export interface Transaction {
  id: number;
  typeId: number;
  categoryId: number;
  description: string | undefined;
  value: number;
  isLocal?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
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
