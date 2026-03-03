import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { EditCategoryForm } from "./EditCategoryFom";

export const LeftAction = ({ category }: { category: TransactionCategory }) => {
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <Pressable
      onPress={() =>
        openBottomSheet(<EditCategoryForm category={category} />, 0)
      }
    >
      <View className="h-[140] bg-accent-blue-dark w-[80] rounded-l-[6] items-center justify-center z-99">
        <MaterialIcons color={colors.white} name="edit" size={30} />
      </View>
    </Pressable>
  );
};
