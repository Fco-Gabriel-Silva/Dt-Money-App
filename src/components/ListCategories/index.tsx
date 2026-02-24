import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppButton } from "../AppButton";
import { useTransactionContext } from "@/context/transaction.context";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { NewCategory } from "../NewCategory";

export const ListCategories = () => {
  const { categories } = useTransactionContext();
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-background-primary p-4">
        <Text className="text-white text-lg mb-4 font-heading">
          Categorias Existentes
        </Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => `category-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-2">
              {item.color && (
                <View
                  style={{ backgroundColor: item.color }}
                  className="w-3 h-3 rounded-full mr-2"
                />
              )}
              <Text className="text-white text-center text-lg font-normal">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View className="bg-background-primary shadow-lg shadow-black w-full">
              <View className="mb-4 pb-4 border-b border-gray-700 bg-background-primary">
                <AppButton
                  mode="outline"
                  onPress={() => openBottomSheet(<NewCategory />, 0)}
                  iconName="add"
                >
                  Nova Categoria
                </AppButton>
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]}
        />
      </View>
    </View>
  );
};
