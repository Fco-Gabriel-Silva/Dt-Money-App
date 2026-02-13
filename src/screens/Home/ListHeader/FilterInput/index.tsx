import { useTransactionContext } from "@/context/transaction.context";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { colors } from "@/styles/colors";
import { TransactionsFilters } from "./TransactionsFilters";
import { Text } from "@/components/Text";
import { fontFamily } from "@/styles/fontFamily";
import { Input } from "@/components/Input";

export const FilterInput = () => {
  const { searchText, setSearchText, fetchTransactions, pagination } =
    useTransactionContext();

  const { openBottomSheet } = useBottomSheetContext();

  const [text, setText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchText(text);
    }, 500);

    return () => clearTimeout(handler);
  }, [text]);

  useEffect(() => {
    (async () => {
      try {
        await fetchTransactions({ page: 1 });
      } catch (error) {}
    })();
  }, [searchText]);

  return (
    <View className="mb-4 w-[90%] self-center">
      <View className="w-full flex-row justify-between items-center mt-4 mb-3">
        <Text className="text-white text-xl font-heading">Transações</Text>
        <Text className="text-gray-700 text-base">
          {pagination.totalRows} {pagination.totalRows === 1 ? "Item" : "itens"}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        className={`flex-row items-center justify-between h-16`}
      >
        <Input
          className="h-[50] text-white w-full bg-background-primary text-lg pl-4"
          value={text}
          onChangeText={setText}
          placeholderTextColor={colors.gray["600"]}
          placeholder="Busque uma transação"
          style={{ fontFamily: fontFamily.sans }}
        />
        <TouchableOpacity
          onPress={() => openBottomSheet(<TransactionsFilters />, 1)}
          className="absolute right-0"
        >
          <MaterialIcons
            name="filter-list"
            color={colors["accent-brand-light"]}
            size={26}
            className="mr-3"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};
