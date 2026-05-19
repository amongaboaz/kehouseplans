/**
 * Trust features strip — glass card with icon grid.
 */
import { motion } from "framer-motion"
import { heroSectionData } from "@/assets/assets"

const Features = () => {
  return (
    <section className="glass rounded-3xl border border-border/60 py-6 sm:py-8 -mt-6 relative z-10 mx-2 sm:mx-0">
      <div className="mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroSectionData.hero_features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
