"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Leaf, Zap, ShoppingCart, TrendingDown, Users, Award } from "lucide-react"
import Navbar from "../components/Navbar"

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Navbar />

      {user ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <section className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Welcome back, {user.email.split("@")[0]}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Continue shopping or explore new deals today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition text-lg"
              >
                <ShoppingCart size={20} /> Continue Shopping
              </Link>
              {user.role === "seller" && (
                <Link
                  href="/seller-dashboard"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/10 transition text-lg"
                >
                  <Zap size={20} /> My Inventory
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/10 transition text-lg"
                >
                  <Zap size={20} /> Admin Panel
                </Link>
              )}
            </div>
          </section>

          {/* Recent Activity or Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-muted-foreground">Active Orders</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl font-bold text-green-600 mb-2">0 kg</div>
              <p className="text-muted-foreground">Waste Saved</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl font-bold text-accent mb-2">0</div>
              <p className="text-muted-foreground">Green Points</p>
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Leaf size={16} /> Eco-Friendly Shopping
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
              Save Money, <span className="text-primary">Save the Planet</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Buy premium household essentials at 20-60% off. Help reduce waste while saving big on soaps, shampoos,
              detergents, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition text-lg"
              >
                <ShoppingCart size={20} /> Start Shopping
              </Link>
              <Link
                href="/seller-onboarding"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/10 transition text-lg"
              >
                <Zap size={20} /> Become a Seller
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-20">
              <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition">
                <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                <p className="text-muted-foreground">Kg Waste Saved</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition">
                <div className="text-3xl font-bold text-accent mb-2">50%</div>
                <p className="text-muted-foreground">Avg. Discount</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition">
                <div className="text-3xl font-bold text-secondary mb-2">10K+</div>
                <p className="text-muted-foreground">Happy Shoppers</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white border-t border-slate-200 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center text-foreground mb-16">Why Choose NearExpiry?</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 border border-slate-200 rounded-xl hover:shadow-lg hover:border-primary/30 transition">
                  <TrendingDown size={40} className="text-accent mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Huge Discounts</h3>
                  <p className="text-muted-foreground">
                    Save 20-60% on trusted brands. Prices drop automatically as products near expiry.
                  </p>
                </div>

                <div className="p-8 border border-slate-200 rounded-xl hover:shadow-lg hover:border-primary/30 transition">
                  <Leaf size={40} className="text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Green Impact</h3>
                  <p className="text-muted-foreground">
                    Earn green points, track waste saved, and contribute to a sustainable future.
                  </p>
                </div>

                <div className="p-8 border border-slate-200 rounded-xl hover:shadow-lg hover:border-primary/30 transition">
                  <Award size={40} className="text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Verified Sellers</h3>
                  <p className="text-muted-foreground">
                    100% authentic products from verified sellers with ratings and reviews.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-center text-foreground mb-16">Browse Categories</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Soaps", icon: "🧼" },
                  { name: "Toothpaste", icon: "🪥" },
                  { name: "Shampoos", icon: "🧴" },
                  { name: "Detergents", icon: "🧽" },
                  { name: "Cleaners", icon: "🧹" },
                  { name: "Dishwash", icon: "🍽️" },
                  { name: "Baby Care", icon: "👶" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/marketplace?category=${cat.name.toLowerCase().replace(/\s/g, "-")}`}
                    className="p-6 bg-white border border-slate-200 rounded-xl text-center hover:shadow-lg hover:border-primary transition"
                  >
                    <div className="text-4xl mb-2">{cat.icon}</div>
                    <p className="font-semibold text-foreground">{cat.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Users size={40} className="mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl font-bold mb-6">Join Thousands Saving & Living Green</h2>
              <p className="text-lg mb-8 opacity-90">
                Start shopping discounted essentials today and make a difference tomorrow.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <ShoppingCart size={20} /> Shop Now
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
              <p className="mb-2 font-semibold">NearExpiry - Save Money. Save the Planet.</p>
              <p className="text-sm">Made with love for a sustainable future</p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
