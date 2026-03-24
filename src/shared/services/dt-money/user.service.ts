import { dtMoneyApi } from "@/shared/api/dt-money";
import { UpdateUserRequest } from "@/shared/interfaces/https/update-user-request";
import { IUser } from "@/shared/interfaces/user-interface";

export const uploadAvatar = async (
  imageUri: string,
): Promise<{ fileName: string }> => {
  const formData = new FormData();

  const fileName = imageUri.split("/").pop() || "avatar.jpg";
  const match = /\.(\w+)$/.exec(fileName);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type,
  } as any);

  const response = await dtMoneyApi.patch("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateUser = async (data: UpdateUserRequest): Promise<IUser> => {
  const response = await dtMoneyApi.put(`/user/${data.id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  await dtMoneyApi.delete(`/user/${id}`);
};
