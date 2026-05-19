/**
 * Admin shell — premium sidebar + main content (admin-only).
 */
import { Navigate, NavLink, Outlet } from "react-router-dom"
import {
  BarChart3,
  LogOut,
  PackageSearch,
  Plus,
  Shield,
  ShoppingBag,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { cn } from "@/lib/utils"

export default function AdminLayout() {
  const { user } = useAuth()

  const links = [
    { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
    { to: "/admin/products/new", label: "Add design", icon: Plus },
    { to: "/admin/products", label: "Designs", icon: PackageSearch },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/", label: "Exit store", icon: LogOut },
  ]

  if (!user?.isAdmin) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-lg:hidden">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 glass rounded-3xl p-5 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 px-2">
            <Shield className="size-5 text-primary" />
            Admin
          </h2>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                <link.icon className="size-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
