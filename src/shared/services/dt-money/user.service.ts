import { dtMoneyApi } from "@/shared/api/dt-money";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";

export const updateUser = async (data: UpdateUserRequest) => {
  await dtMoneyApi.put(`/user/${data.id}`, data);
};

export const deleteUser = async (id: number) => {
  await dtMoneyApi.delete(`/user/${id}`);
};
