export interface IUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
