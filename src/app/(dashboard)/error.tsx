
'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                We encountered an error while loading this dashboard data. Please try again.
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
            >
                Try again
            </button>
        </div>
    )
}
