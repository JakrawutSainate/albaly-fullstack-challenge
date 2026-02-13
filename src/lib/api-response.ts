export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
    }
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
        success: true,
        data,
    }
}

export function createErrorResponse(message: string, code: string = 'ERROR'): ApiResponse {
    return {
        success: false,
        error: {
            code,
            message,
        },
    }
}
