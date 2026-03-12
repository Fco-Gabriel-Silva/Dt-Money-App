import { appSchema } from "@nozbe/watermelondb";
import { transactionSchema } from "./transactionSchema";
import { transactionCategorySchema } from "./transactionCategorySchema";

export const schemas = appSchema({
  version: 1,
  tables: [transactionSchema, transactionCategorySchema],
});
