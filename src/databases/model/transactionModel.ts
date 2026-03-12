import { TransactionTypes } from "@/shared/enums/transaction-types";
import { Model, Relation } from "@nozbe/watermelondb";
import { field, text, date, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TransactionCategoryModel } from "./transactionCategoryModel";

export class TransactionModel extends Model {
  static table = "transactions";

  static associations: Associations = {
    transaction_categories: { type: "belongs_to", key: "category_id" },
  } as const;

  @text("description")
  description!: string;

  @field("type_id")
  typeId!: TransactionTypes;

  @field("category_id")
  categoryId!: string;

  @field("user_id")
  userId!: number;

  @field("value")
  value!: number;

  @date("created_at")
  createdAt!: Date;

  @date("updated_at")
  updatedAt!: Date;

  @date("deleted_at")
  deletedAt?: Date;

  @relation("transaction_categories", "category_id")
  category!: Relation<TransactionCategoryModel>;
}
