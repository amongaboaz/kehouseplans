/**
 * Homepage — hero, features, centered categories, popular designs, newsletter.
 */
import Features from "@/components/Home/Features"
import Hero from "@/components/Home/Hero"
import HomeCategories from "@/components/Home/HomeCategories"
import NewsLetter from "@/components/Home/NewsLetter"
import PopularProducts from "@/components/Home/PopularProducts"

const Home = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Hero />
        <Features />
      </div>
      <HomeCategories />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <PopularProducts />
        <NewsLetter />
      </div>
    </div>
  )
}

export default Home
