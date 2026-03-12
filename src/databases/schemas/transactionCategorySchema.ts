import { tableSchema } from "@nozbe/watermelondb";

export const transactionCategorySchema = tableSchema({
  name: "transaction_categories",
  columns: [
    { name: "name", type: "string" },
    { name: "color", type: "string" },
    { name: "user_id", type: "number", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
    { name: "deleted_at", type: "number", isOptional: true },
  ],
});
