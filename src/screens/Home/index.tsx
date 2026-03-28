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
import { useCategoryContext } from "@/context/category.context";
import { TransactionCardSkeleton } from "./TransactionCardSkeleton";

export const Home = () => {
  const { handleLogout } = useAuthContext();
  const { fetchCategories } = useCategoryContext();
  const {
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
      await fetchCategories();
    } catch (error) {
      handleError(error, "Falha ao buscar categorias de transação");
    }
  };

  const fetchInitialTransactions = async () => {
    try {
      await refreshTransactions();
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      handleLoadings({ key: "loadMore", value: true });
      await loadMoreTransactions();
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
      handleLoadings({ key: "initial", value: true });

      await Promise.all([handleFetchCategories(), fetchInitialTransactions()]);

      handleLoadings({ key: "initial", value: false });
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
      ListEmptyComponent={
        loadings.initial ? (
          <View className="mt-2">
            <TransactionCardSkeleton />
            <TransactionCardSkeleton />
            <TransactionCardSkeleton />
            <TransactionCardSkeleton />
          </View>
        ) : (
          <EmptyList />
        )
      }
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
