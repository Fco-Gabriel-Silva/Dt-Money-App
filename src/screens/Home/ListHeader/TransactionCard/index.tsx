import { colors } from "@/shared/colors";
import { TransactionTypes } from "@/shared/enums/transaction-types";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";

type TransactionCardType = TransactionTypes | "total";

interface Props {
  type: TransactionTypes | "total";
  amount: number;
}

interface IconsData {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const ICONS: Record<TransactionCardType, IconsData> = {
  [TransactionTypes.REVENUE]: {
    color: colors["accent-brand-light"],
    name: "arrow-circle-up",
  },
  [TransactionTypes.EXPENSE]: {
    color: colors["accent-brand-light"],
    name: "arrow-circle-down",
  },
  total: {
    color: colors.white,
    name: "attach-money",
  },
};

export const TransactionCard: FC<Props> = ({ amount, type }) => {
  const iconData = ICONS[type];

  return (
    <View>
      <MaterialIcons name={iconData.name} size={26} color={iconData.color} />
    </View>
  );
};
