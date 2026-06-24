import { Sidebar } from "@/components/dashboard/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Sidebar />
        <div className="lg:pl-64">{children}</div>
      </div>
    </AuthGuard>
  )
}
