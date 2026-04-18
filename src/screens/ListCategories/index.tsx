import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppButton } from "../../components/AppButton";
import { useTransactionContext } from "@/context/transaction.context";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { NewCategory } from "../../components/NewCategory";
import { CategoryItem } from "./CategoryItem";
import { useCategoryContext } from "@/context/category.context";

export const ListCategories = () => {
  const { visibleCategories } = useCategoryContext();
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-background-primary p-4">
        <Text className="text-white text-lg mb-4 font-heading">
          Categorias Existentes
        </Text>
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
        <FlatList
          data={visibleCategories}
          keyExtractor={(item) => `category-${item.id}`}
          renderItem={({ item }) => <CategoryItem category={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
