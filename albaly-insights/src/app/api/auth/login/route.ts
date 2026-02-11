import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { ApiResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return ApiResponse.error('VALIDATION_ERROR', 'Email and password are required', null, 400);
        }

        const authService = new AuthService();
        const user = await authService.login(email);

        // In a real app, you would verify password here or in service
        // and set a HttpOnly cookie

        return ApiResponse.success({
            user,
            message: 'Login successful'
        });

    } catch (error) {
        return ApiResponse.internalError('Login failed');
    }
}
