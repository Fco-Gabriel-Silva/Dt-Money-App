import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Transaction } from "@/shared/interfaces/transaction";
import { colors } from "@/shared/colors";
import { EditTransactionForm } from "./EditTransactionForm";

interface Params {
  transaction: Transaction;
}

export const LeftAction: FC<Params> = ({ transaction }) => {
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <Pressable
      onPress={() =>
        openBottomSheet(<EditTransactionForm transaction={transaction} />, 1)
      }
    >
      <View className="h-[140] bg-accent-blue-dark w-[80] rounded-l-[6] items-center justify-center z-99">
        <MaterialIcons color={colors.white} name="edit" size={30} />
      </View>
    </Pressable>
  );
};
