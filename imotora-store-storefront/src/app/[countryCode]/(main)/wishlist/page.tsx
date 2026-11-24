"use client"

import React, { useTransition } from "react"
import { useParams } from "next/navigation"
import { useWishlist } from "@lib/context/wishlist-context"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"
  const [isPending, startTransition] = useTransition()

  const handleMoveToCart = (variantId?: string, id?: string) => {
    if (!variantId) return
    startTransition(async () => {
      await addToCart({ variantId, quantity: 1, countryCode })
      if (id) removeItem(id)
    })
  }

  return (
    <div className="bg-[#0B0B0E] text-white py-12 min-h-[70vh]">
      <div className="content-container">
        <div className="mb-8 border-b border-white/10 pb-5 flex items-end justify-between">
          <div>
            <h1 className="font-racing text-3xl sm:text-4xl font-extrabold">
              My <span className="text-[#E11D2E]">Wishlist</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Save your dream die-cast cars and move them to your garage cart anytime.
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            {items.length} {items.length === 1 ? "model" : "models"} saved
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#141418] border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <p className="text-lg font-bold text-white">Your wishlist is empty</p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Tap the heart icon on any die-cast model, racing track, or display case to keep track
              of collectibles you love.
            </p>
            <LocalizedClientLink href="/store" className="imotora-btn-primary px-6 py-2.5 text-sm">
              Explore Collectibles →
            </LocalizedClientLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 xsmall:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white text-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <LocalizedClientLink
                  href={`/products/${item.handle}`}
                  className="block p-4 aspect-[4/3] bg-white flex items-center justify-center"
                >
                  <img
                    src={item.thumbnail || "/images/prod-ferrari-sf90.jpg"}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </LocalizedClientLink>
                <div className="p-4 pt-2 flex flex-col gap-3">
                  <div>
                    <LocalizedClientLink
                      href={`/products/${item.handle}`}
                      className="text-sm font-bold text-zinc-900 hover:text-[#E11D2E] line-clamp-2"
                    >
                      {item.title}
                    </LocalizedClientLink>
                    {item.price && (
                      <p className="text-base font-extrabold text-zinc-950 mt-1">{item.price}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.variantId && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleMoveToCart(item.variantId, item.id)}
                        className="flex-1 bg-[#E11D2E] hover:bg-[#c81525] text-white text-xs font-bold py-2 rounded-md transition-colors disabled:opacity-60"
                      >
                        Move to Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 rounded-md border border-zinc-300 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

