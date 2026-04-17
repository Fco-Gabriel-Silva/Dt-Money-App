import { CreateCategoryRequest } from "@/shared/interfaces/https/create-category-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { UpdateCategoryRequest } from "@/shared/interfaces/https/update-category-request";
import { database } from "@/databases";
import { TransactionCategoryModel } from "@/databases/model/transactionCategoryModel";
import { syncWithBackend } from "@/databases/sync";
import { useAuthContext } from "./auth.context";
import { Q } from "@nozbe/watermelondb";

type CategoryContextType = {
  refreshCategories: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  visibleCategories: TransactionCategory[];
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: number | string) => Promise<void>;
};

export const CategoryContext = createContext({} as CategoryContextType);

export const CategoryContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const categoryCollection = database.get<TransactionCategoryModel>(
    "transaction_categories",
  );
  const { user } = useAuthContext();

  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const visibleCategories = useMemo(() => {
    return categories.filter(
      (category) => category.name.toLowerCase() !== "a revisar",
    );
  }, [categories]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = categoryCollection
      .query(Q.where("user_id", user.id))
      .observe()
      .subscribe((localCategories) => {
        const formattedCategories = localCategories.map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
          userId: category.userId,
        }));

        setCategories(formattedCategories);
      });

    return () => subscription.unsubscribe();
  }, [user?.id]);

  const refreshCategories = async () => {
    try {
      if (!user) {
        return;
      }

      await syncWithBackend();

      const localCategories = await categoryCollection
        .query(Q.where("user_id", user.id))
        .fetch();

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
      if (!user) {
        setCategories([]);
        return;
      }

      const localCategories = await categoryCollection
        .query(Q.where("user_id", user.id))
        .fetch();

      const formattedCategories = localCategories.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        userId: category.userId,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias do banco local: ", error);
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

      await syncWithBackend();

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

      await syncWithBackend();

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

      await syncWithBackend();

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
        visibleCategories,
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
