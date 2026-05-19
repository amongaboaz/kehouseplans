/**
 * Stripe payment UI — premium card layout for checkout (preserves existing order API).
 */
import { CreditCard, Lock } from "lucide-react"

const hasStripeKey = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export function StripePaymentSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="size-4 text-primary" />
        Secured by Stripe
      </div>

      {hasStripeKey ? (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <CreditCard className="size-6 text-primary" />
            <div className="flex gap-1">
              {["Visa", "MC", "Amex"].map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-background border border-border"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-11 rounded-xl bg-background border border-border px-4 flex items-center text-sm text-muted-foreground">
              Card number
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-11 rounded-xl bg-background border border-border px-4 flex items-center text-sm text-muted-foreground">
                MM / YY
              </div>
              <div className="h-11 rounded-xl bg-background border border-border px-4 flex items-center text-sm text-muted-foreground">
                CVC
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Place your order to reserve these plans. Card capture can connect to Stripe Checkout when
            the backend session endpoint is enabled.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          <CreditCard className="size-8 mx-auto mb-2 opacity-50" />
          Add <code className="text-xs bg-muted px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> for
          Stripe branding.
        </div>
      )}
    </div>
  )
}
