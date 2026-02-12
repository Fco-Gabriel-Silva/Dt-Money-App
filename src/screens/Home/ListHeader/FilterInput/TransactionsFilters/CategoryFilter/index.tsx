import { Text } from "@/components/Text";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/styles/colors";
import Checkbox from "expo-checkbox";
import { TouchableOpacity, View } from "react-native";

export const CategoryFilter = () => {
  const { categories, filters, handleCategoryFilter } = useTransactionContext();

  const handleChangeCategory = (categoryId: number) => {
    handleCategoryFilter(categoryId);
  };

  return (
    <View className="mb-6">
      <Text className="text-base font-normal mb-5 text-gray-600">
        Categorias
      </Text>
      {categories.map(({ id, name }) => (
        <TouchableOpacity
          onPress={() => handleChangeCategory(id)}
          key={`category-${id}`}
          className="flex-row items-center py-2"
        >
          <Checkbox
            value={Boolean(filters.categoryIds[id]) || false}
            onValueChange={() => handleChangeCategory(id)}
            color={
              filters.categoryIds[id] ? colors["accent-brand-light"] : undefined
            }
            className="mr-4"
          />
          <Text className="text-lg text-white">{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
