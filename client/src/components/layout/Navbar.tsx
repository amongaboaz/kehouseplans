/**
 * Premium sticky navbar — search, categories, theme, cart, profile, glass on scroll.
 */
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  ShoppingBag,
  User,
  X,
} from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { categoriesData } from "@/assets/assets"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount, setIsCartOpen } = useCart()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate("/")
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 border-b",
          scrolled
            ? "glass border-border/80 shadow-lg"
            : "bg-background/80 backdrop-blur-md border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center gap-3 sm:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 font-semibold text-lg tracking-tight"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </span>
              <span className="hidden sm:inline">KEPlans</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search house plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full bg-muted/50 border-transparent focus:border-border"
                />
              </div>
            </form>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted transition-colors"
              >
                Home
              </Link>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                  >
                    Categories
                    <ChevronDown className="size-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[220px] rounded-2xl border border-border bg-card p-2 shadow-xl animate-fade-in"
                    sideOffset={8}
                  >
                    {categoriesData.map((cat) => (
                      <DropdownMenu.Item key={cat.slug} asChild>
                        <Link
                          to={`/products?category=${cat.slug}`}
                          className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-muted"
                        >
                          {cat.name}
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Separator className="my-1 h-px bg-border" />
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/products"
                        className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-primary outline-none hover:bg-muted"
                      >
                        View all designs
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {user && (
                <Link
                  to="/orders"
                  className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                >
                  Orders
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <ThemeToggle />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative rounded-xl"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              {user ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="hidden sm:flex size-10 rounded-full bg-primary text-primary-foreground items-center justify-center font-semibold text-sm"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-50 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl"
                      sideOffset={8}
                      align="end"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link to="/orders" className="dropdown-link rounded-xl">
                          <Package className="size-4" /> My Orders
                        </Link>
                      </DropdownMenu.Item>
                      {user.isAdmin && (
                        <DropdownMenu.Item asChild>
                          <Link to="/admin" className="dropdown-link rounded-xl text-primary">
                            <Shield className="size-4" /> Admin
                          </Link>
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Item
                        className="dropdown-link rounded-xl text-destructive cursor-pointer"
                        onSelect={handleLogout}
                      >
                        <LogOut className="size-4" /> Logout
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <Button asChild size="sm" className="hidden sm:inline-flex rounded-xl">
                  <Link to="/login">
                    <User className="size-4" /> Sign in
                  </Link>
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[min(100%,320px)] z-50 bg-card border-l border-border p-6 pt-20 flex flex-col gap-2 lg:hidden"
            >
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-3 font-medium">
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-3 font-medium">
                All designs
              </Link>
              {categoriesData.map((c) => (
                <Link
                  key={c.slug}
                  to={`/products?category=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm text-muted-foreground"
                >
                  {c.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-3 font-medium mt-4 border-t pt-4">
                    My orders
                  </Link>
                  <button type="button" onClick={handleLogout} className="py-3 text-left text-destructive">
                    Logout
                  </button>
                </>
              ) : (
                <Button asChild className="mt-4 rounded-xl">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                </Button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
