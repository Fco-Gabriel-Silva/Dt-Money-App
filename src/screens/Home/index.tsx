import { AppHeader } from "@/components/AppHeader";
import { useAuthContext } from "@/context/auth.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./ListHeader";
import { TransactionCard } from "./TransactionCard";
import { EmptyList } from "./EmptyList";
import { colors } from "@/styles/colors";

export const Home = () => {
  const { handleLogout } = useAuthContext();
  const {
    fetchCategories,
    fetchTransactions,
    transactions,
    refreshTransactions,
    loadMoreTransactions,
    handleLoadings,
    loadings,
  } = useTransactionContext();
  const { handleError } = useErrorHandler();

  const handleFetchCategories = async () => {
    try {
      handleLoadings({ key: "initial", value: true });
      fetchCategories();
    } catch (error) {
      handleError(error, "Falha ao buscar categorias de transação");
    } finally {
      handleLoadings({ key: "initial", value: false });
    }
  };

  const fetchInitialTransactions = async () => {
    try {
      handleLoadings({ key: "initial", value: true });
      fetchTransactions({ page: 1 });
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    } finally {
      handleLoadings({ key: "initial", value: false });
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      handleLoadings({ key: "loadMore", value: true });
      await loadMoreTransactions;
    } catch (error) {
      handleError(error, "Falha ao buscar novas transações");
    } finally {
      handleLoadings({ key: "loadMore", value: false });
    }
  };

  const handleRefreshTransactions = async () => {
    try {
      handleLoadings({ key: "refresh", value: true });
      await refreshTransactions();
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    } finally {
      handleLoadings({ key: "refresh", value: false });
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([handleFetchCategories(), fetchInitialTransactions()]);
    })();
  }, []);

  return (
    <FlatList
      className="bg-background-secondary"
      data={transactions}
      keyExtractor={({ id }) => `transaction-${id}`}
      renderItem={({ item }) => <TransactionCard transaction={item} />}
      ListHeaderComponent={ListHeader}
      onEndReached={handleLoadMoreTransactions}
      ListEmptyComponent={loadings.initial ? null : EmptyList}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadings.loadMore ? (
          <ActivityIndicator
            color={colors["accent-brand-light"]}
            size={"large"}
          />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={loadings.refresh}
          onRefresh={handleRefreshTransactions}
        />
      }
    />
  );
};
