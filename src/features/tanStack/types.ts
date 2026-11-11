
export type UserRole = "Admin" | "Editor" | "Viewer";

export type UserStatus = "Active" | "Inactive";

export type UserSortField = "name" | "email" | "company" | "createdAt";

export type SortOrder = "asc" | "desc";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  company: string;
  createdAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  company: string;
}

export interface UserFilters {
  search: string;
  role: UserRole | "All";
  status: UserStatus | "All";
  sortBy: UserSortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MutationVariables<T> {
  data: T;
  shouldFail: boolean;
}

export interface UpdateUserVariables {
  id: string;
  data: UserInput;
  shouldFail: boolean;
}

export interface DeleteUserVariables {
  id: string;
  shouldFail: boolean;
}
