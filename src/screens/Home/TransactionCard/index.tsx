import { TransactionTypes } from "@/shared/enums/transaction-types";
import { FC, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Transaction } from "@/shared/interfaces/transaction";
import clsx from "clsx";
import { colors } from "@/shared/colors";
import { RightAction } from "./RightAction";
import { LeftAction } from "./LeftAction";
import { moneyMapper } from "@/shared/utils/money-mapper";
import { useTransactionContext } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";

interface Params {
  transaction: Transaction;
}

export const TransactionCard: FC<Params> = ({ transaction }) => {
  const [loading, setLoading] = useState(false);
  const { syncTransaction } = useTransactionContext();
  const { handleError } = useErrorHandler();

  const isExpense = transaction.type.id === TransactionTypes.EXPENSE;

  const contentOpacity = transaction.isLocal ? "opacity-50" : "";

  const handleSyncTransaction = async (transaction: Transaction) => {
    try {
      await syncTransaction(transaction);
      setLoading(true);
    } catch (error) {
      handleError(error, "Falha ao sincornizar transação com API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Swipeable
      containerStyle={{
        alignItems: "center",
        alignSelf: "center",
        overflow: "visible",
        width: "90%",
        marginBottom: 16,
      }}
      overshootRight={false}
      overshootLeft={false}
      renderRightActions={() => <RightAction transactionId={transaction.id} />}
      renderLeftActions={() => <LeftAction transaction={transaction} />}
    >
      <View
        className={clsx(
          "h-[140] rounded-[6] p-6",
          transaction.isLocal ? "bg-[#1C1C1F]" : "bg-background-tertiary",
        )}
      >
        <View className={clsx("flex-row justify-between", contentOpacity)}>
          <Text className="text-white text-base">
            {transaction.description}
          </Text>

          {transaction.isLocal && (
            <Text className="text-gray-700 text-base">Salvo - Local</Text>
          )}
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={clsx(
              "text-xl font-bold mt-2",
              isExpense ? "text-accent-red" : "text-accent-brand-light",
              contentOpacity,
            )}
          >
            {isExpense && "-"}
            R$ {moneyMapper(transaction.value)}
          </Text>

          {transaction.isLocal && (
            <TouchableOpacity
              onPress={() => handleSyncTransaction(transaction)}
              className="bg-accent-brand items-center justify-center rounded-xl h-10 mt-3 opacity-90 px-5"
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className="text-white font-bold text-sm">Sync</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        <View
          className={clsx(
            "flex-row w-full justify-between items-center",
            contentOpacity,
          )}
        >
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
