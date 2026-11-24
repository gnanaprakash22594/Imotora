"use client"

import React, { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { getPreorderInfo } from "@lib/util/preorder"
import { convertToLocale } from "@lib/util/money"
import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ImotoraProductCard({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"
  const { isWishlisted, toggleItem } = useWishlist()
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  const { cheapestPrice } = getProductPrice({ product })
  const firstVariant = product.variants?.[0]
  const metadata = (product.metadata || {}) as Record<string, any>
  const { isPreorder, depositPercent, releaseDate } = getPreorderInfo(product)

  const displayPrice = cheapestPrice?.calculated_price || "₹1,999"
  const numericAmount = cheapestPrice?.calculated_price_number ?? 0
  const depositAmountFormatted =
    isPreorder && numericAmount > 0
      ? convertToLocale({
          amount: Math.ceil((numericAmount * depositPercent) / 100),
          currency_code: cheapestPrice?.currency_code || "inr",
        })
      : null

  const compareAtRaw = metadata?.compare_at_price_inr
    ? `₹${Number(metadata.compare_at_price_inr).toLocaleString("en-IN")}`
    : cheapestPrice?.price_type === "sale"
    ? cheapestPrice.original_price
    : null

  const discountBadge =
    metadata?.discount_badge ||
    (cheapestPrice?.percentage_diff && Number(cheapestPrice.percentage_diff) > 0
      ? `${cheapestPrice.percentage_diff}% OFF`
      : null)

  const thumbnail =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/images/prod-ferrari-sf90.jpg"

  const wishlisted = isWishlisted(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      handle: product.handle || "",
      title: product.title,
      thumbnail,
      price: displayPrice,
      variantId: firstVariant?.id,
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!firstVariant?.id) return

    startTransition(async () => {
      try {
        await addToCart({
          variantId: firstVariant.id,
          quantity: 1,
          countryCode,
          ...(isPreorder
            ? {
                metadata: {
                  is_preorder: true,
                  preorder_payment_mode: "deposit_50",
                  deposit_percent: depositPercent,
                  preorder_release_date: releaseDate || "Coming Soon",
                },
              }
            : {}),
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
      } catch (err) {
        console.error("Failed to add to cart:", err)
      }
    })
  }

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-200 hover:border-[var(--imotora-red)]"
      data-testid="product-wrapper"
    >
      {/* Image, Pre-Order Badge & Wishlist */}
      <div className="relative bg-white pt-4 px-3 pb-2">
        {isPreorder && (
          <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0D0D10] text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--imotora-red)" }}
              />
              PRE-ORDER &bull; {depositPercent}%
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center transition-all shadow-sm"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? "fill-[var(--imotora-red)] text-[var(--imotora-red)]"
                : "fill-none text-zinc-600 hover:text-[var(--imotora-red)]"
            }`}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block aspect-[4/3] w-full overflow-hidden rounded-lg flex items-center justify-center bg-white"
        >
          <img
            src={thumbnail}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </LocalizedClientLink>
      </div>

      {/* Info & CTA */}
      <div className="px-3.5 pb-3.5 pt-2 flex flex-col flex-1 justify-between bg-white">
        <div>
          <LocalizedClientLink href={`/products/${product.handle}`}>
            <h3
              className="text-[13.5px] font-bold text-[#0D0D10] leading-snug line-clamp-2 min-h-[38px] group-hover:text-[var(--imotora-red)] transition-colors"
              data-testid="product-title"
            >
              {product.title}
            </h3>
          </LocalizedClientLink>

          <div className="mt-2 flex items-center flex-wrap gap-1.5">
            <span className="text-[15px] font-extrabold text-[#0D0D10]">
              {displayPrice}
            </span>
            {compareAtRaw && (
              <span className="text-xs text-zinc-400 line-through font-medium">
                {compareAtRaw}
              </span>
            )}
            {discountBadge && (
              <span
                className="ml-auto px-1.5 py-0.5 rounded text-white text-[10px] font-extrabold tracking-wide uppercase"
                style={{ backgroundColor: "var(--imotora-red)" }}
              >
                {discountBadge}
              </span>
            )}
          </div>

          {isPreorder && depositAmountFormatted && (
            <p className="mt-1.5 text-[11px] font-bold text-zinc-700 bg-zinc-100 rounded px-2 py-1 flex items-center justify-between">
              <span>Pay {depositPercent}% now:</span>
              <span style={{ color: "var(--imotora-red)" }}>{depositAmountFormatted}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending || !firstVariant?.id}
          className={`mt-3 w-full py-2.5 rounded-md text-xs font-extrabold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-60 ${
            added
              ? "bg-emerald-600 text-white"
              : isPreorder
              ? "bg-[#0D0D10] hover:bg-[var(--imotora-red)] text-white"
              : "text-white"
          }`}
          style={
            !added && !isPreorder
              ? { backgroundColor: "var(--imotora-red)" }
              : undefined
          }
        >
          {isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {isPreorder ? "Reserving..." : "Adding..."}
            </>
          ) : added ? (
            isPreorder ? "✓ 50% Deposit Added" : "✓ Added to Cart"
          ) : isPreorder ? (
            `Pre-Order (${depositPercent}% Deposit)`
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  )
}
