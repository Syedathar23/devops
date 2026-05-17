import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { categories as staticCategories, colorFilters } from "../data/products";
import useFilterStore from "../store/filterStore";
import { productApi } from "../services/api";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function CatalogPage() {
  const {
    selectedCategories,
    priceRange,
    selectedColors,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    toggleCategory,
    setPriceRange,
    toggleColor,
    setSortBy,
    setViewMode,
    setCurrentPage,
    clearFilters,
    setCategories: setStoreCategories,
    setSelectedBadge,
  } = useFilterStore();

  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Sync URL params with store
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const badge = params.get('badge');
    
    if (cat) {
      setStoreCategories([cat]);
    } else {
      setStoreCategories([]);
    }

    if (badge) {
      setSelectedBadge(badge);
    } else {
      setSelectedBadge(null);
    }
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await productApi.getAll();
        setDbProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Filter products
  const filtered = useMemo(() => {
    let result = [...dbProducts];

    // Map DB fields to component expectations if needed
    result = result.map(p => ({
      ...p,
      name: p.title,
      price: parseFloat(p.sellprice),
      image: p.image1,
      colors: [], // DB doesn't have colors yet
      rating: 4.5,
      reviewCount: 150
    }));

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Badge filter
    const selectedBadge = useFilterStore.getState().selectedBadge;
    if (selectedBadge) {
      result = result.filter((p) => p.badge === selectedBadge);
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [selectedCategories, priceRange, selectedColors, sortBy]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (val) =>
    val >= 500
      ? "$500+"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(val);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-outline-variant/20">
        <div className="max-w-container mx-auto px-6 py-12 lg:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-display text-on-surface"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-body-lg text-on-surface-variant mt-4 max-w-2xl"
          >
            Premium gym essentials for every athlete. From supplements to equipment — everything you need to push beyond limits.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-container mx-auto px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={18} className="text-primary" />
                <h2 className="text-h3 text-on-surface">Filters</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-label-caps text-on-surface-variant mb-3 uppercase">
                  Categories
                </h3>
                <div className="flex flex-col gap-2.5">
                  {staticCategories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.toLowerCase()) || selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded accent-primary cursor-pointer"
                        aria-label={`Filter by ${cat}`}
                      />
                      <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-label-caps text-on-surface-variant mb-3 uppercase">
                  Price Range
                </h3>
                <div className="flex items-center justify-between text-body-sm text-on-surface-variant mb-3">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                  aria-label="Maximum price"
                />
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="text-label-caps text-on-surface-variant mb-3 uppercase">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colorFilters.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColors.includes(color.name)
                          ? "border-primary ring-2 ring-primary/30 scale-110"
                          : "border-outline-variant/40 hover:border-outline"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Filter by ${color.name}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-surface-container text-on-surface-variant text-body-sm font-medium py-2.5 rounded-lg hover:bg-outline-variant/30 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-body-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {paginated.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-on-surface">
                  {totalCount}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="popular">Popular</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center bg-surface-container rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-soft text-primary"
                        : "text-outline hover:text-on-surface"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-soft text-primary"
                        : "text-outline hover:text-on-surface"
                    }`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Grid */}
                {paginated.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {paginated.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-h3 text-on-surface-variant">
                      No products found
                    </p>
                    <p className="text-body-sm text-outline mt-2">
                      Try adjusting your filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary mt-6"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-body-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
