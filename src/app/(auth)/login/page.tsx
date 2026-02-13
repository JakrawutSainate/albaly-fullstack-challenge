'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/actions';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? 'Signing in...' : 'Sign in'}
        </button>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: any = {
    message: '',
    errors: undefined
};

export default function LoginPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [state, dispatch] = useFormState(login as any, initialState);

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 h-screen">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
                    Sign in to Albaly Insights
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action={dispatch}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                defaultValue="admin@albaly.com"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                            {state?.errors?.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                defaultValue="password123"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                            {state?.errors?.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {state?.message && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Login Failed
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{state.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
