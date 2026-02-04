import { TotalTransactions } from "../total-transaction";
import { Transaction } from "../transaction";

export interface Pagination {
  page: number;
  perPage: number;
  totalRows?: number;
  totalPages: number;
}

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

export interface Filters {
  from?: Date;
  to?: Date;
  typeId?: number;
  categoryIds?: Record<number, boolean>;
}
