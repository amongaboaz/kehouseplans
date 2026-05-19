const FilterPanel = ({
  categories,
  category,
  minPrice,
  updateFilter,
  clearFilters,
  hasFilters
}: any) => {

  const categoriesWithAll = [
    { slug: "", name: "All Designs" },
    ...categories
  ]

  return (
    <div className="space-y-6">

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-app-blue mb-3">
          House Design Categories
        </h3>

        <div className="space-y-1.5">
          {categoriesWithAll.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                category === cat.slug
                  ? "bg-app-accent text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-app-blue mb-3">
          Budget Range (KES)
        </h3>

        <div className="flex items-center gap-2">

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:border-app-accent outline-none"
          />

          <span className="text-gray-400">—</span>

          <input
            type="number"
            placeholder="Max price"
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:border-app-accent outline-none"
          />

        </div>

      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Clear Filters
        </button>
      )}

    </div>
  )
}

export default FilterPanel