/**
 * Main storefront layout — navbar, scroll progress, animated outlet, footer, cart.
 */
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Banner from "@/components/Banner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CartSidebar from "@/components/CartSidebar"
import { ScrollProgress } from "@/components/layout/ScrollProgress"
import { PageTransition } from "@/components/layout/PageTransition"

const AppLayout = () => {
  const location = useLocation()

  return (
  <>
      <ScrollProgress />
      <Banner />
      <Navbar />
      <main className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <CartSidebar />
    </>
  )
}

export default AppLayout
