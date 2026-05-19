/**
 * Browse Categories — centered layout, hover lift cards, motion reveals.
 */
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { categoriesData } from "@/assets/assets"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const HomeCategories = () => {
  return (
    <section className="py-16 sm:py-24 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Browse categories
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Explore architectural styles tailored for modern Kenyan living
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 justify-items-center"
        >
          {categoriesData.map((cat) => (
            <motion.div key={cat.slug} variants={item} className="w-full max-w-sm">
              <Link
                to={`/products?category=${cat.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                className="group block card-premium"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View plans →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HomeCategories
