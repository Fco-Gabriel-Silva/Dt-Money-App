import { dtMoneyApi } from "@/shared/api/dt-money";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";
import { IUser } from "@/shared/interfaces/user-interface";

export const updateUser = async (data: UpdateUserRequest): Promise<IUser> => {
  const response = await dtMoneyApi.put(`/user/${data.id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await dtMoneyApi.delete(`/user/${id}`);
};
