import { CreateCategoryRequest } from "@/shared/interfaces/https/create-category-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import * as categoryService from "@/shared/services/dt-money/category.service";
import { UpdateCategoryRequest } from "@/shared/interfaces/https/update-category-request";

type CategoryTextType = {
  refreshCategories: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (data: UpdateCategoryRequest) => Promise<void>;
};

export const CategoryContext = createContext({} as CategoryTextType);

export const CategoryContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const refreshCategories = async () => {
    try {
      const categories = await categoryService.getTransactionCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Erro ao atualizar categorias", error);
    }
  };

  const fetchCategories = async () => {
    const categories = await categoryService.getTransactionCategories();
    console.log(categories);
    setCategories(categories);
  };

  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      await categoryService.createCategory(data);
      await fetchCategories();
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (data: UpdateCategoryRequest) => {
    try {
      await categoryService.updateCategory(data);
      await refreshCategories();
    } catch (error) {
      throw error;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        fetchCategories,
        categories,
        createCategory,
        refreshCategories,
        updateCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  return useContext(CategoryContext);
};
