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
import { database } from "@/databases";
import { TransactionCategoryModel } from "@/databases/model/transactionCategoryModel";

type CategoryTextType = {
  refreshCategories: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: number | string) => Promise<void>;
};

export const CategoryContext = createContext({} as CategoryTextType);

export const CategoryContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const categoryCollection = database.get<TransactionCategoryModel>(
    "transaction_categories",
  );

  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const refreshCategories = async () => {
    try {
      const localCategories = await categoryCollection.query().fetch();

      const formattedCategories = localCategories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        userId: category.userId,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Erro ao atualizar categorias", error);
    }
  };

  const fetchCategories = async () => {
    try {
      let localCategories = await categoryCollection.query().fetch();

      if (localCategories.length === 0) {
        const response = await categoryService.getTransactionCategories();
        const categoriesFromApi = response;

        if (categoriesFromApi && categoriesFromApi.length > 0) {
          await database.write(async () => {
            await database.batch(
              ...categoriesFromApi.map((apiCategory) =>
                categoryCollection.prepareCreate((newCategory) => {
                  newCategory.name = apiCategory.name;
                  newCategory.color = apiCategory.color;
                  newCategory.userId = apiCategory.userId;
                }),
              ),
            );
          });
          localCategories = await categoryCollection.query().fetch();
        }
      }

      const formattedCategories = localCategories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        userId: category.userId,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error(
        "Erro ao sincronizar categorias da API para o banco local: ",
        error,
      );
    }
  };

  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      await database.write(async () => {
        await categoryCollection.create((newCategory) => {
          newCategory.name = data.name;
          newCategory.color = data.color;
          newCategory.userId = data.userId;
        });
      });
      await refreshCategories();
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (data: UpdateCategoryRequest) => {
    try {
      await database.write(async () => {
        const categoryToUpdate = await categoryCollection.find(String(data.id));

        await categoryToUpdate.update((category) => {
          category.name = data.name;
          category.color = data.color;
          category.userId = data.userId;
        });
      });
      await refreshCategories();
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (id: number | string) => {
    try {
      await database.write(async () => {
        const categoryToDelete = await categoryCollection.find(String(id));
        await categoryToDelete.markAsDeleted();
      });
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
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  return useContext(CategoryContext);
};
