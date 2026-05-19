/**
 * Premium animated hero — parallax gradients, Framer Motion reveals, CTAs.
 */
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { heroSectionData } from "@/assets/assets"
import { Button } from "@/components/ui/button"

const Hero = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, 80])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

  return (
    <section className="relative mb-12 sm:mb-16 overflow-hidden rounded-3xl min-h-[min(85vh,720px)] flex items-center">
      {/* Background image + gradients */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={heroSectionData.hero_image}
          alt="Modern architecture"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-blue-950/70" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />
      </motion.div>

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="size-3.5" />
            Premium Kenyan house plans
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-6">
            Build your dream home with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
              expert designs
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
            {heroSectionData.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full shadow-xl shadow-primary/30">
              <Link to="/products">
                Explore designs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
              <Link to="/products?category=bungalows">Browse bungalows</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
