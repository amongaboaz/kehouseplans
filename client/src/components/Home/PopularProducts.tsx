/**
 * Featured designs grid on homepage.
 */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Design } from "@/types"
import ProductCard from "@/components/ProductCard"
import api from "@/config/api"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const PopularProducts = () => {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/designs/featured")
      .then(({ data }) => setDesigns(data.designs))
      .catch((error: { response?: { data?: { message?: string } }; message?: string }) => {
        toast.error(error.response?.data?.message || error.message || "Failed to load designs")
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="pb-16 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Popular designs</h2>
          <p className="text-muted-foreground text-sm mt-1">Top architectural plans this season</p>
        </div>
        <Button variant="ghost" asChild className="rounded-xl">
          <Link to="/products">
            View all <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {designs.slice(0, 8).map((design, i) => (
            <ProductCard key={design.id} product={design} index={i} />
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default PopularProducts
