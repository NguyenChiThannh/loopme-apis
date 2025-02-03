import type { Response } from "express";

interface reponsePrams {
    res: Response,
    message: string,
    status: number,
    data?: any,
}

export function successResponse({ res, message, status, data }: reponsePrams) {
    return res.status(status).json({ success: true, message, data: data });
}

export interface PaginatedResponse {
    data: any[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    nextCursor?: number;
    totalElement?: number,
}