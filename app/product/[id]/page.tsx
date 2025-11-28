"use client"

import { useEffect, useState } from "react"
import { useParams , useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Leaf, ShoppingCart, ChevronLeft } from "lucide-react"

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
  quantity: number
  reviews: any[]
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

const handleAddToCart = () => {
    if (!product) return

    // 1. Safe parsing logic
    let cart: any[] = []
    try {
      const storedCart = localStorage.getItem("cart")
      const parsedCart = storedCart ? JSON.parse(storedCart) : []
      
      // 2. validation: Ensure it is actually an array
      if (Array.isArray(parsedCart)) {
        cart = parsedCart
      } else {
        // If it's valid JSON but not an array (e.g. an object), reset it
        console.warn("Cart data was corrupted (not an array), resetting.")
        cart = []
      }
    } catch (error) {
      // If JSON.parse fails, reset cart
      console.error("Failed to parse cart data:", error)
      cart = []
    }

    // 3. Now it is safe to use .find()
    const existingItem = cart.find((item: any) => item._id === product._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    router.push("/cart")
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/marketplace" className="text-primary font-semibold">
            Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  const daysLeft = daysUntilExpiry(product.expiryDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition font-semibold"
          >
            <ChevronLeft size={20} /> Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg?height=500&width=500&query=household product"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-4 capitalize">{product.category}</p>
            <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              {product.rating > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
                </>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-6">By {product.sellerId.name}</p>

            {/* Pricing */}
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl font-bold text-primary">₹{product.finalPrice.toFixed(0)}</span>
                <span className="text-2xl text-muted-foreground line-through">₹{product.originalPrice.toFixed(0)}</span>
              </div>
              <p className="text-accent font-bold text-lg mb-3">{product.discountPercentage}% OFF</p>
              <p className="text-sm text-muted-foreground">
                You save ₹{(product.originalPrice - product.finalPrice).toFixed(0)}
              </p>
            </div>

            {/* Expiry Info */}
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={18} className="text-green-600" />
                <span className="font-semibold text-green-700">Expiry Information</span>
              </div>
              <p className="text-sm text-green-700">
                Expires in <strong>{daysLeft} days</strong> - High savings on near-expiry products!
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-3 border border-slate-300 rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-1 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>

            {/* Green Impact */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">🌍 Environmental Impact</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Save ~250g of waste per purchase</li>
                <li>✓ Earn 10 green points</li>
                <li>✓ Reduce carbon footprint</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
