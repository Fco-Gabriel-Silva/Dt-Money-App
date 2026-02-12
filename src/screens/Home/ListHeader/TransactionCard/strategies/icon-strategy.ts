import { colors } from "@/styles/colors";
import { TransactionTypes } from "@/shared/enums/transaction-types";
import { TransactionCardType } from "..";
import { MaterialIcons } from "@expo/vector-icons";

interface IconsData {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export const ICONS: Record<TransactionCardType, IconsData> = {
  [TransactionTypes.REVENUE]: {
    color: colors["accent-brand-light"],
    name: "arrow-circle-up",
  },
  [TransactionTypes.EXPENSE]: {
    color: colors["accent-red"],
    name: "arrow-circle-down",
  },
  total: {
    color: colors.white,
    name: "attach-money",
  },
};
