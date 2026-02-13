import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Albaly Insights</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to access your business dashboard.
                    </p>
                </div>

                <LoginForm />

                <div className="text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                    </span>
                    <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                        Register
                    </a>
                </div>
            </div>
        </div>
    )
}
