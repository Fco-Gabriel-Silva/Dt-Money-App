import { useTransactionContext } from "@/context/transaction.context";
import { TransactionTypes } from "@/shared/enums/transaction-types";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICONS } from "./strategies/icon-strategy";
import { CARD_DATA } from "./strategies/card-data-strategy";
import { moneyMapper } from "@/shared/utils/money-mapper";
import clsx from "clsx";
import { Text } from "@/components/Text";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/styles/colors";

export type TransactionCardType = TransactionTypes | "total";

interface Props {
  type: TransactionTypes | "total";
  amount: number;
}

export const TransactionCard: FC<Props> = ({ amount, type }) => {
  const iconData = ICONS[type];
  const cardData = CARD_DATA[type];

  const { transactions, filters, loadings } = useTransactionContext();

  const lastTransaction = transactions.find(
    ({ type: transactionType }) => transactionType.id === type,
  );

  const renderDateInfo = () => {
    if (type === "total") {
      return (
        <Text className="text-white text-sm">
          {filters.from && filters.to
            ? `${format(filters.from, "d MMMM", { locale: ptBR })} até ${format(filters.to, "d MMMM", { locale: ptBR })}`
            : "Todo período"}
        </Text>
      );
    } else {
      return (
        <Text className="text-gray-700 text-sm">
          {lastTransaction?.createdAt
            ? format(
                lastTransaction?.createdAt,
                `'Última ${cardData.label.toLocaleLowerCase()} em' d 'de' MMMM`,
                { locale: ptBR },
              )
            : "Nenhuma transação encontrada"}
        </Text>
      );
    }
  };

  const skeletonColors =
    type === "total"
      ? [colors["accent-brand"], colors["accent-brand-light"]]
      : [colors.gray[800], colors.gray[700]];

  return (
    <View
      className={clsx(
        `bg-${cardData.bgColor} min-w-[280] rounded-[6] px-8 py-6 justify-between mr-6`,
        type === "total" && "mr-12",
      )}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-base">{cardData.label}</Text>
        <MaterialIcons name={iconData.name} size={26} color={iconData.color} />
      </View>
      <View className="mt-4 justify-between">
        {loadings.initial ? (
          <View className="gap-2">
            <Skeleton width={160} height={24} colors={skeletonColors} />
            <Skeleton width={200} height={16} colors={skeletonColors} />
          </View>
        ) : (
          <>
            <Text className="text-xl text-gray-400 font-heading">
              R$ {moneyMapper(amount)}
            </Text>
            {renderDateInfo()}
          </>
        )}
      </View>
    </View>
  );
};
