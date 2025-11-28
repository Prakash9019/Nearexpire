"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, ShoppingCart, Leaf, ArrowRight } from "lucide-react"

interface CartItem {
  _id: string
  name: string
  finalPrice: number
  originalPrice: number
  quantity: number
  discountPercentage: number
  images: [string]
  expiryDate: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
    setLoading(false)
  }, [])

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((item) => item._id !== productId)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const updated = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
    )
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
  const wasteSaved = cartItems.length * 0.25
  const greenPointsEarned = Math.floor(subtotal / 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartItems.length} items</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-xl border border-slate-200 flex gap-4">
                  <img
                    src={item.images[0] || "/placeholder.svg?height=100&width=100&query=product"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="line-through">₹{item.originalPrice}</span> • {item.discountPercentage}% off
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-primary">₹{(item.finalPrice * item.quantity).toFixed(0)}</span>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-auto text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-4">
                <h3 className="font-bold text-foreground text-lg mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount (avg)</span>
                    <span className="font-semibold">-₹{(subtotal * 0.2).toFixed(0)}</span>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="font-bold text-foreground text-lg">₹{subtotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Total payable</p>
                </div>

                {/* Green Impact */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-semibold text-green-700 mb-2">Environmental Impact</p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <Leaf size={14} /> {wasteSaved.toFixed(2)} kg waste saved
                    </li>
                    <li className="flex items-center gap-2">
                      <span>+</span> {greenPointsEarned} green points
                    </li>
                  </ul>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <Link
                  href="/marketplace"
                  className="w-full mt-3 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
