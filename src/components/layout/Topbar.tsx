
export default function Topbar() {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
            <div className="flex items-center">
                {/* Placeholder for Breadcrumbs or Page Title if needed dynamically */}
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</span>
                </div>
            </div>
        </header>
    )
}
