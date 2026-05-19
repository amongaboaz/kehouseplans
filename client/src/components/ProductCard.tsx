/**
 * Premium house plan card — Airbnb/Apple-inspired hover, wishlist, specs.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Bath, Bed, Heart, Move, Plus } from "lucide-react"
import type { Design } from "@/types"
import { useCart } from "@/context/CartContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  product: Design
  index?: number
}

const ProductCard = ({ product: design, index = 0 }: Props) => {
  const currency = "KES "
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="group card-premium cursor-pointer"
      onClick={() => navigate(`/products/${design.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={design.images?.[0] || ""}
          alt={design.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {design.featured && (
          <Badge className="absolute top-3 left-3" variant="accent">
            Featured
          </Badge>
        )}

        <Badge
          variant="secondary"
          className="absolute top-3 right-12 bg-background/90 backdrop-blur-md"
        >
          {currency}
          {design.price.toLocaleString()}
        </Badge>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setWishlist(!wishlist)
          }}
          className={cn(
            "absolute top-3 right-3 size-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
            wishlist ? "bg-red-500 text-white" : "bg-background/80 text-foreground hover:scale-110"
          )}
          aria-label="Wishlist"
        >
          <Heart className={cn("size-4", wishlist && "fill-current")} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {design.category.replace(/-/g, " ")}
        </p>
        <h3 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {design.title}
        </h3>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="size-4" /> {design.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-4" /> {design.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Move className="size-4" /> {design.squareMeters}m²
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <p className="text-lg font-bold text-foreground">
              {currency}
              {design.price.toLocaleString()}
            </p>
          </div>
          <Button
            size="icon"
            className="rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              addToCart(design)
            }}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
