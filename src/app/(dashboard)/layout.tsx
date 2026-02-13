import Sidebar from '@/components/layout/Sidebar'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar userEmail={session.email} userRole={session.user?.role || 'VIEWER'} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow">
                    {/* ลบ max-w-7xl mx-auto ออก และปรับ px ให้เป็น 6 เพื่อให้ขอบตรงกับ main */}
                    <div className="w-full py-4 px-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold leading-tight text-gray-900">
                            Dashboard
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 hidden sm:block">
                                Welcome, {session.email}
                            </span>
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {session.email[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}