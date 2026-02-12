import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { DateFilter } from "./DateFilter";
import { CategoryFilter } from "./CategoryFilter";
import { TypeFilter } from "./TypeFilter";
import { AppButton } from "@/components/AppButton";
import { useTransactionContext } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { Text } from "@/components/Text";

export const TransactionsFilters = () => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { fetchTransactions, handleLoadings, resetFilter } =
    useTransactionContext();
  const { handleError } = useErrorHandler();

  const handleFetchTranscations = async () => {
    try {
      handleLoadings({ key: "refresh", value: true });
      await fetchTransactions({ page: 1 });
    } catch (error) {
      handleError(error, "Falha ao aplicar filtros");
    } finally {
      handleLoadings({ key: "refresh", value: false });
      closeBottomSheet();
    }
  };

  const handleResetTranscations = async () => {
    try {
      handleLoadings({ key: "refresh", value: true });
      await resetFilter();
    } catch (error) {
      handleError(error, "Falha ao limpar filtros");
    } finally {
      handleLoadings({ key: "refresh", value: false });
      closeBottomSheet();
    }
  };

  return (
    <View className="flex-1 bg-gray[1000] p-6">
      <View className="flex-row justify-between">
        <Text className="text-xl font-heading mb-5 text-white">
          Filtrar transações
        </Text>
        <TouchableOpacity onPress={closeBottomSheet}>
          <MaterialIcons name="close" color={colors.gray["600"]} size={20} />
        </TouchableOpacity>
      </View>

      <DateFilter />

      <CategoryFilter />

      <TypeFilter />

      <View className="flex-row w-full gap-4 mb-4 mt-8">
        <AppButton
          onPress={handleResetTranscations}
          className="flex-1"
          widthFull={false}
          mode="outline"
        >
          Limpar Filtros
        </AppButton>
        <AppButton
          onPress={handleFetchTranscations}
          className="flex-1"
          widthFull={false}
        >
          Filtrar
        </AppButton>
      </View>
    </View>
  );
};
