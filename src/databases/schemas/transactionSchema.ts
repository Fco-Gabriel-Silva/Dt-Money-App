import { tableSchema } from "@nozbe/watermelondb";

export const transactionSchema = tableSchema({
  name: "transactions",
  columns: [
    { name: "description", type: "string" },
    { name: "type_id", type: "number", isIndexed: true },
    { name: "category_id", type: "string", isIndexed: true },
    { name: "user_id", type: "number", isIndexed: true },
    { name: "value", type: "number" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
    { name: "deleted_at", type: "number", isOptional: true },
  ],
});
