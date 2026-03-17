import { Text } from "@/components/Text";
import { useCategoryContext } from "@/context/category.context";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/styles/colors";
import Checkbox from "expo-checkbox";
import { TouchableOpacity, View } from "react-native";

export const CategoryFilter = () => {
  const { categories } = useCategoryContext();
  const { filters, handleCategoryFilter } = useTransactionContext();

  const handleChangeCategory = (categoryId: number | string) => {
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
            value={Boolean(filters.categoryIds[String(id)]) || false}
            onValueChange={() => handleChangeCategory(id)}
            color={
              filters.categoryIds[String(id)]
                ? colors["accent-brand-light"]
                : undefined
            }
            className="mr-4"
          />
          <Text className="text-lg text-white">{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
