import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
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
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
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
};

export const TransactionContext = createContext({} as TransactionTextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
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

  const refreshTransactions = useCallback(async () => {
    const { page, perPage } = pagination;

    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: page * perPage,
      ...filters,
      categoryIds,
    });

    const getTransactions = await AsyncStorage.getItem("dt-money-transaction");

    const localTransactions = getTransactions
      ? JSON.parse(getTransactions)
      : [];

    const allTransactions = [...localTransactions, ...transactionResponse.data];

    setTransactions(allTransactions);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, [pagination, filters, categoryIds]);

  const fetchCategories = async () => {
    const categories = await transactionService.getTransactionCategories();
    setCategories(categories);
  };

  const createTransaction = async (transaction: CreateTransactionInterface) => {
    // await transactionService.createTransaction(transaction);

    const getTransactions = await AsyncStorage.getItem("dt-money-transaction");

    const localTransactions = getTransactions
      ? JSON.parse(getTransactions)
      : [];

    const categoryFull = categories.find(
      (c) => c.id === transaction.categoryId,
    );

    if (!categoryFull) {
      console.error(
        "Erro Crítico: Tentativa de criar transação com categoria inexistente na lista local.",
      );
      return;
    }

    const typeFull =
      transaction.typeId === transactionTypesLocal.REVENUE.id
        ? transactionTypesLocal.REVENUE
        : transactionTypesLocal.EXPENSE;

    const newTransactionFull: Transaction = {
      id: Date.now(),
      typeId: transaction.typeId,
      categoryId: transaction.categoryId,
      description: transaction.description,
      value: transaction.value,
      isLocal: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      type: typeFull,
      category: categoryFull,
    };

    const newTransactionsList = [newTransactionFull, ...localTransactions];

    await AsyncStorage.setItem(
      "dt-money-transaction",
      JSON.stringify(newTransactionsList),
    );

    await refreshTransactions();
  };

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction);
    await refreshTransactions();
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

      const getTransactions = await AsyncStorage.getItem(
        "dt-money-transaction",
      );

      const localTransactions = getTransactions
        ? JSON.parse(getTransactions)
        : [];

      const allTransactions = [
        ...localTransactions,
        ...transactionResponse.data,
      ];

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

    const filterTransactionsLocal = transactions.filter(
      (t) => t.id !== transaction.id,
    );

    await AsyncStorage.setItem(
      "dt-money-transaction",
      JSON.stringify(filterTransactionsLocal),
    );

    refreshTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
        fetchTransactions,
        totalTransactions,
        transactions,
        updateTransaction,
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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
