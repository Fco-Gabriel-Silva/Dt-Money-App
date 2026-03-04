import { dtMoneyApi } from "@/shared/api/dt-money";
import { CreateCategoryRequest } from "@/shared/interfaces/https/create-category-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { UpdateCategoryRequest } from "@/shared/interfaces/https/update-category-request";

export const createCategory = async (data: CreateCategoryRequest) => {
  await dtMoneyApi.post("/category", data);
};

export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const { data } = await dtMoneyApi.get<TransactionCategory[]>("/categories");
  return data;
};

export const updateCategory = async (data: UpdateCategoryRequest) => {
  await dtMoneyApi.put(`/category/${data.id}`, data);
};

export const deleteCategory = async (id: number) => {
  await dtMoneyApi.delete(`/category/${id}`);
};
