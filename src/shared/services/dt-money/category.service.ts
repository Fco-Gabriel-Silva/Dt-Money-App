import { dtMoneyApi } from "@/shared/api/dt-money";
import { CreateCategoryRequest } from "@/shared/interfaces/https/create-category-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";

export const createCategory = async (data: CreateCategoryRequest) => {
  await dtMoneyApi.post("/category", data);
};

export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const { data } = await dtMoneyApi.get<TransactionCategory[]>("/categories");
  return data;
};

export const deleteCategory = async (id: number) => {
  await dtMoneyApi.delete(`/category/${id}`);
};
