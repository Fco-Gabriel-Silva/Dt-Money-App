import { Model, Query } from "@nozbe/watermelondb";
import { children, date, field, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TransactionModel } from "./transactionModel";

export class TransactionCategoryModel extends Model {
  static table = "transaction_categories";

  static associations: Associations = {
    transactions: { type: "has_many", foreignKey: "category_id" },
  };

  @text("name")
  name!: string;

  @field("color")
  color!: string;

  @field("user_id")
  userId!: number;

  @date("created_at")
  createdAt!: Date;

  @date("updated_at")
  updatedAt!: Date;

  @date("deleted_at")
  deletedAt?: Date;

  @children("transactions")
  transactions!: Query<TransactionModel>;
}
