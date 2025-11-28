"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Leaf, Filter } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  originalPrice: number
  finalPrice: number
  discountPercentage: number
  expiryDate: string
  images: [string]
  sellerId: { name: string }
  rating: number
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [loading, setLoading] = useState(true)

  const categories = ["soaps", "toothpaste", "shampoos", "detergents", "cleaners", "dishwash", "baby-care"]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams()
        if (selectedCategory) query.append("category", selectedCategory)
        query.append("sortBy", sortBy)

        const res = await fetch(`/api/products?${query}`)
        const data = await res.json()
        setProducts(data)
        console.log("Fetched products:", data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, sortBy])

  const getDealBadge = (discount: number) => {
    if (discount >= 50) return { text: "Hot Deal", className: "deal-badge-hot", icon: "🔥" }
    if (discount >= 30) return { text: "Good Deal", className: "deal-badge-good", icon: "⭐" }
    return { text: "Fair Deal", className: "deal-badge-fair", icon: "✓" }
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Browse discounted household essentials</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Category</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${!selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-slate-100"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition capitalize ${selectedCategory === cat ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-slate-100"}`}
                    >
                      {cat.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const deal = getDealBadge(product.discountPercentage)
                  const daysLeft = daysUntilExpiry(product.expiryDate)

                  return (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      className="bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:border-primary/30 transition group overflow-hidden"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden group-hover:scale-105 transition">
                        <img
                          src={product.images?.[0] || "/placeholder.svg?height=200&width=200&query=household product"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-3 left-3 ${deal.className}`}>
                          {deal.icon} {deal.text}
                        </div>
                        {daysLeft <= 7 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {daysLeft} days left
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">by {product.sellerId?.name}</p>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-bold text-primary">₹{product.originalPrice - (product.originalPrice * product.discountPercentage / 100)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice?.toFixed(0)}
                          </span>
                          <span className="text-sm font-bold text-accent ml-auto">
                            {product.discountPercentage}% off
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Leaf size={14} className="text-green-600" />
                          <span className="text-xs text-muted-foreground">Saves ~250g waste</span>
                        </div>

                        <button onClick={(e) => {
    e.preventDefault(); // Prevents the Link from navigating
    e.stopPropagation(); // Stops the event bubbling
    console.log("Add to cart clicked for", product._id);
    // Add your add-to-cart logic here
  }}  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                          <ShoppingCart size={16} /> Add to Cart
                        </button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
