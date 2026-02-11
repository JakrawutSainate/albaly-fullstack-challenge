import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <TopNav />
            {/* Main content area offset by sidebar width and topnav height */}
            <main className="pl-64 pt-16">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
