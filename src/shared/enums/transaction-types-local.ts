export const transactionTypesLocal = {
  REVENUE: {
    id: 1,
    name: "Entrada",
  },
  EXPENSE: {
    id: 2,
    name: "Saída",
  },
} as const;

export type TransactionTypesLocal =
  (typeof transactionTypesLocal)[keyof typeof transactionTypesLocal];
