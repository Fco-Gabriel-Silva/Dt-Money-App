import { TotalTransactions } from "../total-transaction";
import { Transaction } from "../transaction";

export interface GetTransactionsParams {
  page: number;
  perPage: number;
  from?: Date;
  to?: Date;
  typeId?: number;
  categoryId?: number;
  searchText?: string;
}

export interface GetTransactionsResponse {
  totalTransactions: TotalTransactions;
  data: Transaction[];
  totalRows: number;
  totalPages: number;
  page: number;
  perPage: number;
}
