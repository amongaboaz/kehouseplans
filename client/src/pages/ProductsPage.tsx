import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import type { Design } from "../types"
import Loading from "../components/Loading"
import ProductCard from "../components/ProductCard"
import api from "../config/api"
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  Expand,
  Home,
  Minus,
  Move,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/** Embed YouTube or render direct video URL */
function VideoPlayer({ url }: { url: string }) {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  )

  if (youtubeMatch) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
        <iframe
          title="Plan walkthrough"
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <video
      src={url}
      controls
      className="w-full rounded-xl max-h-[400px] bg-black"
      playsInline
    />
  )
}

const ProductsPage = () => {
  const currency = "KES "
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, addToCart, updateQuantity, removeFromCart } = useCart()

  const [design, setDesign] = useState<Design | null>(null)
  const [relatedDesigns, setRelatedDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [localQuantity, setLocalQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setLocalQuantity(1)
    setActiveImage(0)
    window.scrollTo(0, 0)

    api
      .get(`/designs/${id}`)
      .then(({ data }) => {
        const plan = data.design as Design
        setDesign(plan)
        return api.get(`/designs?category=${plan.category}`)
      })
      .then(({ data }) => {
        setRelatedDesigns(
          (data.designs as Design[]).filter((p) => p.id !== id)
        )
      })
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const images = useMemo(() => {
    if (!design?.images?.length) return [""]
    return design.images
  }, [design])

  if (loading) return <Loading />
  if (!design) return null

  const cartItem = items.find((item) => item.design.id === design.id)
  const inCart = !!cartItem
  const displayQuantity = inCart ? cartItem.quantity : localQuantity
  const categoryLabel = design.category.replace(/-/g, " ")

  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1) {
        updateQuantity(design.id, cartItem.quantity - 1)
      } else {
        removeFromCart(design.id)
      }
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1))
    }
  }

  const handlePlus = () => {
    if (inCart) {
      updateQuantity(design.id, cartItem.quantity + 1)
    } else {
      setLocalQuantity(localQuantity + 1)
    }
  }

  const prevImage = () =>
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImage = () =>
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-app-text-light mb-4 sm:mb-6">
          <Link to="/" className="hover:text-app-accent transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-app-accent transition-colors">
            House Plans
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${design.category}`}
            className="hover:text-app-accent transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="text-app-accent font-medium truncate max-w-[140px] sm:max-w-xs">
            {design.title}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-1.5 text-sm text-app-text-light hover:text-app-accent transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={`${design.title} — view ${activeImage + 1}`}
                  className="w-full h-full object-contain p-2 sm:p-4"
                />
              ) : (
                <div className="text-gray-400 text-sm">No image available</div>
              )}

              {design.featured && (
                <Badge className="absolute top-3 left-3">Featured</Badge>
              )}
              {images[activeImage] && (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-full bg-background/90"
                  onClick={() => setFullscreen(true)}
                  aria-label="Fullscreen"
                >
                  <Expand className="size-4" />
                </Button>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-app-accent ring-2 ring-app-accent/20"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky purchase panel */}
          <Card className="lg:sticky lg:top-24 glass rounded-3xl">
            <CardContent className="p-6 sm:p-8 flex flex-col">
            <span className="text-xs text-app-text-light uppercase tracking-wider mb-1">
              {categoryLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-app-blue mb-3 font-serif">
              {design.title}
            </h1>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-app-text-light mb-4">
              <span className="flex items-center gap-1.5">
                <Bed className="size-4" /> {design.bedrooms} beds
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="size-4" /> {design.bathrooms} baths
              </span>
              <span className="flex items-center gap-1.5">
                <Move className="size-4" /> {design.squareMeters} m²
              </span>
            </div>

            <p className="text-3xl sm:text-4xl font-semibold text-app-blue mb-6">
              {currency}
              {design.price.toLocaleString()}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                <button
                  type="button"
                  onClick={handleMinus}
                  className="p-3 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-semibold min-w-[40px] text-center">
                  {displayQuantity}
                </span>
                <button
                  type="button"
                  onClick={handlePlus}
                  className="p-3 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!inCart) addToCart(design, localQuantity)
                }}
                className={`flex-1 py-3 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  inCart
                    ? "bg-gray-100 text-app-blue border border-gray-300"
                    : "bg-app-accent text-white hover:bg-app-accent-dark"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {inCart ? "In your selection" : "Add to selection"}
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Instant digital delivery after payment approval.
            </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full flex-wrap h-auto gap-1">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Photos & Videos</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card className="rounded-3xl mt-4">
              <CardContent className="p-6 sm:p-8">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {design.description || "Detailed description coming soon."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card className="rounded-3xl mt-4">
              <CardContent className="p-6 grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-muted p-4 text-center">
                  <Bed className="size-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{design.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                </div>
                <div className="rounded-2xl bg-muted p-4 text-center">
                  <Bath className="size-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{design.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
                <div className="rounded-2xl bg-muted p-4 text-center">
                  <Move className="size-6 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">{design.squareMeters} m²</p>
                  <p className="text-xs text-muted-foreground">Floor area</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="media" className="mt-4">
            {design.videos?.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 mb-8">
                {design.videos.map((url, i) => (
                  <VideoPlayer key={i} url={url} />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setActiveImage(idx); setFullscreen(true) }}
                  className="aspect-square rounded-2xl overflow-hidden border border-border hover:ring-2 hover:ring-primary"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="downloads">
            <Card className="rounded-3xl mt-4">
              <CardContent className="p-6">
                {design.documents?.length ? (
                  <ul className="space-y-2 text-sm">
                    {design.documents.map((doc, i) => (
                      <li key={i}>
                        <a href={doc} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          Document {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Blueprints unlock after purchase approval.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {fullscreen && images[activeImage] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setFullscreen(false)}
            >
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setFullscreen(false)}
              >
                <X />
              </Button>
              <img
                src={images[activeImage]}
                alt={design.title}
                className="max-h-[90vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related */}
        {relatedDesigns.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-app-blue">
                  Related house plans
                </h2>
                <p className="text-sm text-app-text-light mt-1 capitalize">
                  More in {categoryLabel}
                </p>
              </div>
              <Link
                to={`/products?category=${design.category}`}
                className="text-sm font-semibold text-app-accent hover:text-app-accent-dark flex items-center gap-1"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {relatedDesigns.slice(0, 5).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
