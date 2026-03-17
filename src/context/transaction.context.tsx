import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Transaction } from "@/shared/interfaces/transaction";
import { TotalTransactions } from "@/shared/interfaces/total-transaction";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import {
  Filters,
  Pagination,
} from "@/shared/interfaces/https/get-transactions-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transactionTypesLocal } from "@/shared/enums/transaction-types-local";
import { useCategoryContext } from "./category.context";
import { database } from "@/databases";
import { TransactionModel } from "@/databases/model/transactionModel";
import { Q } from "@nozbe/watermelondb";

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

type TransactionTextType = {
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
  handleCategoryFilter: (categoryId: number) => void;
  resetFilter: () => Promise<void>;
  syncTransaction: (transaction: Transaction) => Promise<void>;
  getLocalTransactions: () => Promise<Transaction[]>;
};

export const TransactionContext = createContext({} as TransactionTextType);

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
    { expense: 0, revenue: 0, total: 0 },
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
      .map(([key]) => Number(key));
  }, [filters]);

  const handleLoadings = ({ key, value }: HandleLoadingParams) =>
    setLoadings((prevValues) => ({ ...prevValues, [key]: value }));

  const getLocalTransactions = async () => {
    const localTransactions = await AsyncStorage.getItem(
      "dt-money-transaction-local",
    );
    const parsedTransactions = localTransactions
      ? JSON.parse(localTransactions)
      : [];
    return parsedTransactions;
  };

  const refreshTransactions = useCallback(async () => {
    try {
      const { page, perPage } = pagination;

      const totalRows = await transactionCollection.query().fetchCount();

      const totalPages = Math.ceil(totalRows / perPage);

      const itemsToSkip = (page - 1) * perPage;

      const localTransactions = await transactionCollection
        .query(
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

      setTransactions(formattedTransactions);

      setPagination({
        ...pagination,
        page,
        totalPages,
        totalRows,
      });

      const allTransactionsForBalance = await transactionCollection
        .query()
        .fetch();

      const revenue = allTransactionsForBalance
        .filter((t) => t.typeId === 1)
        .reduce((acc, t) => acc + t.value, 0);

      const expense = allTransactionsForBalance
        .filter((t) => t.typeId === 2)
        .reduce((acc, t) => acc + t.value, 0);

      setTotalTransactions({
        revenue,
        expense,
        total: revenue - expense,
      });
    } catch (error) {
      console.error("Erro ao buscar transações locais:", error);
    }
  }, [pagination]);

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
      await refreshTransactions();
    } catch (error) {
      console.error(
        "Erro crítico ao criar transação no banco de dados:",
        error,
      );
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
      await refreshTransactions();
    } catch (error) {
      console.error(
        "Erro crítico ao atualizar transação no banco de dados:",
        error,
      );
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
      await refreshTransactions();
    } catch (error) {
      console.error(
        "Erro crítico ao deletar transação no banco de dados:",
        error,
      );
      throw error;
    }
  };

  const fetchTransactions = useCallback(
    async ({ page = 1 }: FetchTransactionsParams) => {
      const transactionResponse = await transactionService.getTransactions({
        page,
        perPage: pagination.perPage,
        searchText,
        ...filters,
        categoryIds,
      });

      const getLocal = await getLocalTransactions();

      const allTransactions = [...getLocal, ...transactionResponse.data];

      if (page === 1) {
        setTransactions(allTransactions);
      } else {
        setTransactions((prevState) => [...prevState, ...allTransactions]);
      }

      setTotalTransactions(transactionResponse.totalTransactions);
      setPagination({
        ...pagination,
        page,
        totalRows: transactionResponse.totalRows,
        totalPages: transactionResponse.totalPages,
      });
    },
    [pagination, searchText, filters, categoryIds],
  );

  const loadMoreTransactions = useCallback(() => {
    if (loadings || pagination.page >= pagination.totalPages) return;
    fetchTransactions({ page: pagination.page + 1 });
  }, [loadings, pagination, fetchTransactions]);

  const handleFilters = ({ key, value }: HandleFiltersParams) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryFilter = (categoryId: number) => {
    setFilters((prevValue) => ({
      ...prevValue,
      categoryIds: {
        ...prevValue.categoryIds,
        [categoryId]: !Boolean(prevValue.categoryIds[categoryId]),
      },
    }));
  };

  const resetFilter = useCallback(async () => {
    setFilters(filtersInitialValues);
    setSearchText("");

    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: pagination.perPage,
      searchText: "",
      categoryIds: [],
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page: 1,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, [pagination, searchText]);

  const syncTransaction = async (transaction: Transaction) => {
    await transactionService.createTransaction(transaction);

    const localTransactions = await getLocalTransactions();

    const filterTransactionsLocal = localTransactions.filter(
      (t: Transaction) => t.id !== transaction.id,
    );

    await AsyncStorage.setItem(
      "dt-money-transaction-local",
      JSON.stringify(filterTransactionsLocal),
    );

    await refreshTransactions();
  };

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
        syncTransaction,
        getLocalTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
