import { AppHeader } from "@/components/AppHeader";
import { useAuthContext } from "@/context/auth.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./ListHeader";
import { TransactionCard } from "./TransactionCard";

export const Home = () => {
  const { handleLogout } = useAuthContext();
  const {
    fetchCategories,
    fetchTransactions,
    transactions,
    refreshTransactions,
    loading,
    loadMoreTransactions,
  } = useTransactionContext();
  const { handleError } = useErrorHandler();

  const handleFetchCategories = async () => {
    try {
      fetchCategories();
    } catch (error) {
      handleError(error, "Falha ao buscar categorias de transação");
    }
  };

  const fetchInitialTransactions = async () => {
    try {
      fetchTransactions({ page: 1 });
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      await loadMoreTransactions();
    } catch (error) {
      handleError(error, "Falha ao buscar novas transações");
    }
  };

  const handleRefreshTransactions = async () => {
    try {
      await refreshTransactions();
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([handleFetchCategories(), fetchInitialTransactions()]);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <FlatList
        className="bg-background-secondary"
        data={transactions}
        keyExtractor={({ id }) => `transaction-${id}`}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        ListHeaderComponent={ListHeader}
        onEndReached={handleLoadMoreTransactions}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefreshTransactions}
          />
        }
      />
    </SafeAreaView>
  );
};
