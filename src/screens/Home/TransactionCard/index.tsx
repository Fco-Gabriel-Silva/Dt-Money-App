import { TransactionTypes } from "@/shared/enums/transaction-types";
import { FC } from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
// import { RightAction } from "./RightAction";
// import { LeftAction } from "./LeftAction";
import { Transaction } from "@/shared/interfaces/transaction";
import clsx from "clsx";
import { colors } from "@/shared/colors";

interface Params {
  transaction: Transaction;
}

export const TransactionCard: FC<Params> = ({ transaction }) => {
  const isExpense = transaction.type.id === TransactionTypes.EXPENSE;

  return (
    <Swipeable
      containerStyle={{
        alignItems: "center",
        alignSelf: "center",
        overflow: "visible",
        width: "90%",
        marginBottom: 16,
      }}
      //   overshootRight={false}
      //   overshootLeft={false}
      //   friction={1}
      //   enableTrackpadTwoFingerGesture
      //   rightThreshold={20}
      //   renderRightActions={() => <RightAction transaction={transaction} />}
      //   renderLeftActions={() => <LeftAction transaction={transaction} />}
    >
      <View className="h-[140] bg-background-tertiary rounded-[6] p-6">
        <Text className="text-white text-base">{transaction.description}</Text>
        <Text
          className={clsx(
            "text-2xl font-bold mt-2",
            isExpense ? "text-accent-red" : "text-accent-brand-light",
          )}
        >
          {isExpense && "-"}
          R$ {transaction.value.toFixed(2).replace(".", ",")}
        </Text>
        <View className="flex-row w-full justify-between items-center">
          <View className="items-center flex-row mt-3">
            <MaterialIcons
              name="label-outline"
              size={23}
              color={colors.gray[700]}
            />
            <Text className="text-gray-700 text-vase ml-2">
              {transaction.category.name}
            </Text>
          </View>
          <View className="items-center flex-row mt-3">
            <MaterialIcons
              name="calendar-month"
              size={20}
              color={colors.gray[700]}
            />
            <Text className="text-gray-700 text-base ml-2">
              {format(transaction.createdAt, "dd/MM/yyyy")}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};
