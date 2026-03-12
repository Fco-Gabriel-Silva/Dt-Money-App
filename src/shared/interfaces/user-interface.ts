export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
