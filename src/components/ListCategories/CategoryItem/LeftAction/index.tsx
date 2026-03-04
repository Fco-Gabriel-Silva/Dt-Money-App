import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { EditCategoryForm } from "./EditCategoryFom";

export const LeftAction = ({ category }: { category: TransactionCategory }) => {
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className="w-[70px] justify-center items-center">
      <View
        className="absolute top-0 bottom-0 bg-accent-blue-dark rounded-l-[6]"
        style={{
          width: 100,
          left: 0,
        }}
      />

      <Pressable
        className="h-full w-full items-center justify-center z-10"
        onPress={() =>
          openBottomSheet(<EditCategoryForm category={category} />, 0)
        }
      >
        <MaterialIcons color={colors.white} name="edit" size={30} />
      </Pressable>
    </View>
  );
};
