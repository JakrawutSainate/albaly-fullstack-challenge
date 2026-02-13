'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions'

export function LoginForm() {
    const [state, action, isPending] = useActionState(login, undefined)

    return (
        <form action={action} className="mt-8 space-y-6">
            {/* Demo Credentials Info */}
            <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 rounded-md p-4 mb-6 text-sm">
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Demo Credentials</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-indigo-800 dark:text-indigo-300">Admin</p>
                        <p className="text-indigo-600 dark:text-gray-400 text-xs">admin@albaly.com</p>
                        <p className="text-indigo-600 dark:text-gray-400 font-mono text-xs">password123</p>
                    </div>
                    <div>
                        <p className="font-medium text-indigo-800 dark:text-indigo-300">Viewer</p>
                        <p className="text-indigo-600 dark:text-gray-400 text-xs">viewer@albaly.com</p>
                        <p className="text-indigo-600 dark:text-gray-400 font-mono text-xs">password123</p>
                    </div>
                </div>
            </div>

            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                    />
                    {state?.errors?.email && (
                        <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                    />
                    {state?.errors?.password && (
                        <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
                    )}
                </div>
            </div>

            {state?.message && (
                <p className="text-red-500 text-sm text-center">{state.message}</p>
            )}

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isPending ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    )
}
