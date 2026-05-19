/**
 * Auth page — sign in / register with redirect to home on success.
 */
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Building2, Loader2, Lock, Mail, User } from "lucide-react"
import { heroSectionData } from "@/assets/assets"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, register, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true })
  }, [user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLoginState) await login(email, password)
      else await register(name, email, password)
      navigate("/", { replace: true })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err.response?.data?.message || err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex-center bg-background">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col lg:flex-row bg-background"
    >
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src={heroSectionData.hero_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 to-blue-950/80" />
        <div className="relative text-center px-10 max-w-md text-white">
          <Building2 className="size-14 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold tracking-tight mb-4">Design. Download. Build.</h2>
          <p className="text-white/70 text-lg">
            Premium Kenyan house plans delivered to your inbox.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md rounded-3xl glass border-border/60 shadow-2xl">
          <CardHeader className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 justify-center mb-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </span>
              <span className="text-xl font-bold">KEPlans</span>
            </Link>
            <CardTitle>{isLoginState ? "Welcome back" : "Create account"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLoginState ? "Sign in to access your plans" : "Join the marketplace"}
              <button
                type="button"
                onClick={() => setIsLoginState(!isLoginState)}
                className="text-primary font-semibold ml-1 hover:underline"
              >
                {isLoginState ? "Register" : "Sign in"}
              </button>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginState && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-10"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-4" /> Please wait…
                  </>
                ) : isLoginState ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default Login
