import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import type { Design } from "../types"
import { categoriesData } from "../assets/assets"
import {
  ChevronDown,
  HomeIcon,
  SlidersHorizontal,
  XIcon
} from "lucide-react"

import ProductCard from "../components/ProductCard"
import Loading from "../components/Loading"
import FilterPanel from "../components/FilterPanel"
import toast from "react-hot-toast"
import api from "../config/api"

const Products = () => {

  const [searchParams, setSearchParams] = useSearchParams()

  const [designs, setDesigns] = useState<Design[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const category = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || ""
  const page = Number(searchParams.get("page")) || 1
  const minPrice = searchParams.get("minPrice") || ""
  const maxPrice = searchParams.get("maxPrice") || ""
  const search = searchParams.get("search") || ""

  const fetchDesigns = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (category) params.set("category", category)
      if (sort) params.set("sort", sort)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (search) params.set("search", search)

      params.set("page", String(page))
      params.set("limit", "12")

      const { data } = await api.get(`/designs?${params.toString()}`)

      setDesigns(data.designs)
      setTotalPages(data.pages)

    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)

    if (value) newParams.set(key, value)
    else newParams.delete(key)

    if (key !== "page") newParams.delete("page")

    setSearchParams(newParams)
  }

  const clearFilters = () => setSearchParams({})

  const activeCategory = categoriesData.find(
    (c) => c.slug === category
  )

  const hasFilters = category || minPrice || maxPrice

  useEffect(() => {
    fetchDesigns()
  }, [category, sort, page, minPrice, maxPrice, search])

  return (
    <div className="min-h-screen bg-app-cream">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-4">

          <Link to="/" className="hover:text-app-accent transition-colors">
            <HomeIcon className="size-4" />
          </Link>

          <span>/</span>

          <span className="text-app-accent font-medium">
            {activeCategory ? activeCategory.name : "All House Plans"}
          </span>

        </nav>

        <div className="flex gap-8 xl:gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">

            <div className="bg-white rounded-2xl p-4 sticky top-24 shadow-sm border border-gray-100">

              <FilterPanel
                categories={categoriesData}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />

            </div>

          </aside>

          {/* Main */}
          <main className="flex-1">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-app-blue">
                  {activeCategory ? activeCategory.name : "All House Plans"}
                </h1>

                <p className="text-sm text-app-text-light mt-0.5">
                  {designs.length} architectural designs available
                </p>

              </div>

              <div className="flex flex-col lg:flex-row gap-3">

                {/* Mobile filter */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </button>

                {/* Sort */}
                <div className="relative">

                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-white rounded-xl border border-gray-200 outline-none"
                  >
                    <option value="">Newest</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                  </select>

                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

                </div>

              </div>

            </div>

            {/* Content */}
            {loading ? (
              <Loading />
            ) : designs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border">

                <p className="text-lg font-semibold text-app-blue mb-2">
                  No house plans found
                </p>

                <p className="text-sm text-app-text-light mb-4">
                  Try adjusting your filters
                </p>

                <button
                  onClick={clearFilters}
                  className="px-5 py-2 text-sm bg-app-accent text-white rounded-xl"
                >
                  Clear Filters
                </button>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {designs.map((design) => (
                  <ProductCard key={design.id} product={design} />
                ))}

              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateFilter("page", String(i + 1))
                      window.scrollTo(0, 0)
                    }}
                    className={`w-10 h-10 rounded-xl text-sm font-medium ${
                      page === i + 1
                        ? "bg-app-accent text-white"
                        : "bg-white border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between p-4 border-b">

              <h3 className="font-semibold">Filters</h3>

              <button onClick={() => setMobileFiltersOpen(false)}>
                <XIcon className="size-5" />
              </button>

            </div>

            <div className="p-4">
              <FilterPanel
                categories={categoriesData}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>

          </div>
        </>
      )}

    </div>
  )
}

export default Products