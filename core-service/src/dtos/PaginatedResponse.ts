export interface PaginatedResponse {
    data: any[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    nextCursor?: number;

    totalElement?: number,
}