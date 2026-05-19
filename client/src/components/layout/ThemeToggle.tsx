/**
 * Animated dark/light theme toggle for the navbar.
 */
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="rounded-xl" aria-hidden />
  }

  const isDark = (theme === "dark" || resolvedTheme === "dark")

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-xl relative overflow-hidden"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </motion.div>
    </Button>
  )
}
