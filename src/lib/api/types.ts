export interface ApiResponse<T> {
  data: T;
  error: null | {
    message: string;
    code?: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}