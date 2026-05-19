import { useEffect, useState } from "react"
import type { Design } from "../types"
import { Zap } from "lucide-react"
import Loading from "../components/Loading"
import ProductCard from "../components/ProductCard"
import api from "../config/api"
import toast from "react-hot-toast"

const FlashDeals = () => {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/designs/flash-deals")
      .then((res) => setDesigns(res.data.designs))
      .catch((error: any) =>
        toast.error(error.response?.data?.message || error?.message)
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>

      {/* HERO BANNER */}
      <div className="bg-linear-to-r from-app-blue to-app-green-lighter text-white py-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="flex items-center justify-center gap-2 mb-3">

            <Zap className="size-6 fill-white" />

            <h1 className="text-3xl font-semibold">
              Featured House Plan Deals
            </h1>

            <Zap className="size-6 fill-white" />

          </div>

          <p className="text-white/80 max-w-md mx-auto">
            Limited-time discounts on premium architectural house designs in Kenya.
            Download instantly after payment.
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading ? (
          <Loading />
        ) : designs.length === 0 ? (
          <div className="text-center py-16">

            <Zap className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-lg font-semibold text-app-blue mb-2">
              No active deals right now
            </h2>

            <p className="text-sm text-app-text-light">
              New discounted house plans will appear here soon.
            </p>

          </div>

        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">

            {designs.map((design) => (
              <ProductCard key={design.id} product={design} />
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default FlashDeals