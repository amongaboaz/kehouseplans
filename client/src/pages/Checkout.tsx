/**
 * Premium checkout — M-Pesa, Bank, Stripe UI; preserves order API integration.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Building2, CheckCircle2, CreditCard, Smartphone } from "lucide-react"
import api from "@/config/api"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { StripePaymentSection } from "@/components/checkout/StripePaymentSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PaymentMethod = "M-Pesa" | "Bank Transfer" | "Stripe"

const Checkout = () => {
  const navigate = useNavigate()
  const currency = "KES "
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState(user?.email || "")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("M-Pesa")
  const [success, setSuccess] = useState(false)

  const total = cartTotal

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerEmail) {
      toast.error("Please enter an email to receive your house plans.")
      return
    }
    setLoading(true)
    try {
      await api.post("/orders", {
        items: items.map((item) => ({
          product: item.design.id,
          quantity: item.quantity,
        })),
        customerEmail,
        paymentMethod,
      })
      clearCart()
      setSuccess(true)
      toast.success("Order placed! Awaiting payment confirmation.")
      setTimeout(() => navigate("/orders"), 1800)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err.response?.data?.message || err.message || "Order failed")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex-center px-4">
        <Card className="max-w-md w-full rounded-3xl text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm mb-6">Browse designs to continue</p>
            <Button onClick={() => navigate("/products")} className="rounded-xl">
              Browse designs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="min-h-[60vh] flex-center px-4"
      >
        <Card className="max-w-md w-full rounded-3xl p-8 text-center">
          <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order placed!</h2>
          <p className="text-muted-foreground text-sm">Redirecting to your orders…</p>
        </Card>
      </motion.div>
    )
  }

  const paymentOptions: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
    { id: "M-Pesa", label: "M-Pesa", icon: Smartphone },
    { id: "Stripe", label: "Card (Stripe)", icon: CreditCard },
    { id: "Bank Transfer", label: "Bank transfer", icon: Building2 },
  ]

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 rounded-xl">
          <ArrowLeft className="size-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl glass">
              <CardHeader>
                <CardTitle>Delivery email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  House plans are sent here after payment approval.
                </p>
                <Input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      paymentMethod === opt.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                    />
                    <opt.icon className="size-5 text-primary" />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}

                {paymentMethod === "M-Pesa" && (
                  <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-sm space-y-1">
                    <p className="font-semibold text-green-700 dark:text-green-400">M-Pesa instructions</p>
                    <p>Paybill: <strong>123456</strong> · Account: your email</p>
                    <p>Amount: <strong>{currency}{total.toLocaleString()}</strong></p>
                  </div>
                )}
                {paymentMethod === "Bank Transfer" && (
                  <div className="rounded-2xl bg-muted p-4 text-sm space-y-1">
                    <p className="font-semibold">Equity Bank · KEPlans Ltd</p>
                    <p>Acc: 1234567890 · Email receipt to payments@keplans.com</p>
                  </div>
                )}
                {paymentMethod === "Stripe" && <StripePaymentSection />}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl h-fit lg:sticky lg:top-24 glass">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.design.id} className="flex justify-between text-sm gap-2">
                  <span className="line-clamp-1">{item.design.title}</span>
                  <span className="shrink-0 font-medium">
                    {currency}{(item.design.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{currency}{total.toLocaleString()}</span>
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                {loading ? "Processing…" : "Place order"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default Checkout
