import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Transaction } from "@/shared/interfaces/transaction";
import { TotalTransactions } from "@/shared/interfaces/total-transaction";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import {
  Filters,
  Pagination,
} from "@/shared/interfaces/https/get-transactions-request";
import { transactionTypesLocal } from "@/shared/enums/transaction-types-local";
import { useCategoryContext } from "./category.context";
import { database } from "@/databases";
import { TransactionModel } from "@/databases/model/transactionModel";
import { Q } from "@nozbe/watermelondb";
import { syncWithBackend } from "@/databases/sync";

const filtersInitialValues = {
  categoryIds: {},
  from: undefined,
  to: undefined,
  typeId: undefined,
};

export interface FetchTransactionsParams {
  page: number;
}

interface Loadings {
  initial: boolean;
  refresh: boolean;
  loadMore: boolean;
}

interface HandleLoadingParams {
  key: keyof Loadings;
  value: boolean;
}

interface HandleFiltersParams {
  key: keyof Filters;
  value: Date | Boolean | number;
}

type TransactionContextType = {
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
  updateTransaction: (
    transaction: UpdateTransactionInterface | Transaction,
  ) => Promise<void>;
  deleteTransaction: (id: number | string) => Promise<void>;
  fetchTransactions: (params: FetchTransactionsParams) => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loadMoreTransactions: () => void;
  loadings: Loadings;
  handleLoadings: (params: HandleLoadingParams) => void;
  pagination: Pagination;
  setSearchText: (text: string) => void;
  searchText: string;
  filters: Filters;
  handleFilters: (params: HandleFiltersParams) => void;
  handleCategoryFilter: (categoryId: number | string) => void;
  resetFilter: () => Promise<void>;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const transactionCollection = database.get<TransactionModel>("transactions");
  const { categories } = useCategoryContext();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<Filters>(filtersInitialValues);

  const [loadings, setLoadings] = useState<Loadings>({
    initial: false,
    refresh: false,
    loadMore: false,
  });

  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    },
  );

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 15,
    totalRows: 0,
    totalPages: 0,
  });

  const categoryIds = useMemo(() => {
    return Object.entries(filters.categoryIds)
      .filter(([key, value]) => value)
      .map(([key]) => String(key));
  }, [filters]);

  const handleLoadings = ({ key, value }: HandleLoadingParams) =>
    setLoadings((prevValues) => ({ ...prevValues, [key]: value }));

  const fetchTransactions = useCallback(
    async ({ page = 1 }: FetchTransactionsParams) => {
      try {
        const perPage = pagination.perPage;
        const itemsToSkip = (page - 1) * perPage;

        const baseConditions: Q.Clause[] = [];

        if (searchText) {
          baseConditions.push(
            Q.where(
              "description",
              Q.like(`%${Q.sanitizeLikeString(searchText)}%`),
            ),
          );
        }

        if (filters?.typeId) {
          baseConditions.push(Q.where("type_id", filters.typeId));
        }

        if (categoryIds && categoryIds.length > 0) {
          const idsAsStrings = categoryIds.map(String);
          console.log("idsAsStrings", idsAsStrings);
          baseConditions.push(Q.where("category_id", Q.oneOf(idsAsStrings)));
        }

        if (filters.from) {
          const fromTimestamp = new Date(filters.from).getTime();
          baseConditions.push(Q.where("created_at", Q.gte(fromTimestamp)));
        }

        if (filters.to) {
          const toDate = new Date(filters.to);
          toDate.setHours(23, 59, 59, 999);
          const toTimestamp = toDate.getTime();
          baseConditions.push(Q.where("created_at", Q.lte(toTimestamp)));
        }

        const localTransactions = await transactionCollection
          .query(
            ...baseConditions,
            Q.sortBy("created_at", Q.desc),
            Q.skip(itemsToSkip),
            Q.take(perPage),
          )
          .fetch();

        const formattedTransactions = localTransactions.map((t) => {
          let type =
            transactionTypesLocal.EXPENSE.id === t.typeId
              ? transactionTypesLocal.EXPENSE
              : transactionTypesLocal.REVENUE;

          let category = categories.find(
            (c) => String(c.id) === String(t.categoryId),
          );

          return {
            id: t.id as any,
            description: t.description,
            value: t.value,
            typeId: t.typeId,
            categoryId: t.categoryId,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            deletedAt: t.deletedAt ?? null,
            type: {
              id: type.id,
              name: type.name,
            },
            category: {
              id: category?.id || t.categoryId,
              name: category?.name || "Desconhecida",
            },
          };
        });

        if (page === 1) {
          setTransactions(formattedTransactions);
        } else {
          setTransactions((prev) => [...prev, ...formattedTransactions]);
        }

        const totalRows = await transactionCollection
          .query(...baseConditions)
          .fetchCount();
        const totalPages = Math.ceil(totalRows / perPage);

        setPagination((prev) => ({
          ...prev,
          page,
          totalRows,
          totalPages,
        }));

        const allFilteredForBalance = await transactionCollection
          .query(...baseConditions)
          .fetch();
        const revenue = allFilteredForBalance
          .filter((t) => t.typeId === 1)
          .reduce((acc, t) => acc + t.value, 0);
        const expense = allFilteredForBalance
          .filter((t) => t.typeId === 2)
          .reduce((acc, t) => acc + t.value, 0);

        setTotalTransactions({
          revenue,
          expense,
          total: revenue - expense,
        });
      } catch (error) {
        console.error(
          "Erro ao buscar transações paginadas e filtradas:",
          error,
        );
      }
    },
    [pagination.perPage, searchText, filters, categoryIds, categories],
  );

  const refreshTransactions = useCallback(async () => {
    await syncWithBackend();

    await fetchTransactions({ page: 1 });
  }, [fetchTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) return;
    fetchTransactions({ page: pagination.page + 1 });
  }, [loadings.loadMore, pagination, fetchTransactions]);

  const createTransaction = async (transaction: CreateTransactionInterface) => {
    try {
      await database.write(async () => {
        await transactionCollection.create((newTransaction) => {
          newTransaction.description = transaction.description;
          newTransaction.value = transaction.value;
          newTransaction.typeId = transaction.typeId;
          newTransaction.categoryId = String(transaction.categoryId);
        });
      });

      await syncWithBackend();

      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      throw error;
    }
  };

  const updateTransaction = async (
    data: UpdateTransactionInterface | Transaction,
  ) => {
    try {
      await database.write(async () => {
        const transactionToUpdate = await transactionCollection.find(
          String(data.id),
        );
        await transactionToUpdate.update((transaction) => {
          transaction.description = data.description;
          transaction.value = data.value;
          transaction.typeId = data.typeId;
          transaction.categoryId = String(data.categoryId);
        });
      });

      await syncWithBackend();

      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: number | string) => {
    try {
      await database.write(async () => {
        const transactionToDelete = await transactionCollection.find(
          String(id),
        );
        await transactionToDelete.markAsDeleted();
      });

      await syncWithBackend();

      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    }
  };

  const handleFilters = ({ key, value }: HandleFiltersParams) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryFilter = (categoryId: number | string) => {
    const safeId = String(categoryId);
    setFilters((prevValue) => ({
      ...prevValue,
      categoryIds: {
        ...prevValue.categoryIds,
        [safeId]: !Boolean(prevValue.categoryIds[safeId]),
      },
    }));
  };

  const resetFilter = useCallback(async () => {
    setFilters(filtersInitialValues);
    setSearchText("");
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        createTransaction,
        fetchTransactions,
        totalTransactions,
        transactions,
        updateTransaction,
        deleteTransaction,
        refreshTransactions,
        loadMoreTransactions,
        handleLoadings,
        loadings,
        pagination,
        setSearchText,
        searchText,
        filters,
        handleFilters,
        handleCategoryFilter,
        resetFilter,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
