import { NextResponse } from 'next/server';

export type ApiErrorDetail = {
    code: string;
    message: string;
    details?: any;
};

export type ApiResponseSuccess<T> = {
    success: true;
    data: T;
};

export type ApiResponseError = {
    success: false;
    error: ApiErrorDetail;
};

export type ApiResponseBody<T> = ApiResponseSuccess<T> | ApiResponseError;

export class ApiResponse {
    static success<T>(data: T, status: number = 200) {
        return NextResponse.json<ApiResponseSuccess<T>>(
            { success: true, data },
            { status }
        );
    }

    static error(
        code: string,
        message: string,
        details?: any,
        status: number = 400
    ) {
        return NextResponse.json<ApiResponseError>(
            {
                success: false,
                error: {
                    code,
                    message,
                    details,
                },
            },
            { status }
        );
    }

    // Common error shortcuts
    static unauthorized(message: string = "Unauthorized") {
        return this.error("UNAUTHORIZED", message, null, 401);
    }

    static notFound(message: string = "Resource not found") {
        return this.error("NOT_FOUND", message, null, 404);
    }

    static internalError(message: string = "Internal Server Error", details?: any) {
        return this.error("INTERNAL_ERROR", message, details, 500);
    }
}
