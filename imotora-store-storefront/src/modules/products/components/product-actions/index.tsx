"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { getProductPrice } from "@lib/util/get-product-price"
import { getPreorderInfo } from "@lib/util/preorder"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>(() =>
    product.variants && product.variants.length >= 1
      ? optionsAsKeymap(product.variants[0].options) ?? {}
      : {}
  )
  const [isAdding, setIsAdding] = useState(false)
  const [paymentMode, setPaymentMode] = useState<"deposit_50" | "full">("deposit_50")
  const countryCode = useParams().countryCode as string

  const { isPreorder, depositPercent, releaseDate, note: preorderNote } =
    getPreorderInfo(product)

  useEffect(() => {
    if (product.variants && product.variants.length >= 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const { variantPrice, cheapestPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })
  const activePrice = variantPrice || cheapestPrice
  const unitPriceNum = activePrice?.calculated_price_number ?? 0
  const currencyCode = activePrice?.currency_code || "inr"
  const depositNow = Math.ceil((unitPriceNum * depositPercent) / 100)
  const balanceLater = Math.max(0, unitPriceNum - depositNow)

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    if (value) params.set("v_id", value)
    else params.delete("v_id")
    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (isPreorder) return true
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant, isPreorder])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      ...(isPreorder
        ? {
            metadata: {
              is_preorder: true,
              preorder_payment_mode: paymentMode,
              deposit_percent: paymentMode === "deposit_50" ? depositPercent : 100,
              preorder_release_date: releaseDate || "Coming Soon",
            },
          }
        : {}),
    })
    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-3" ref={actionsRef}>
        {isPreorder && (
          <div className="rounded-xl bg-[#0D0D10] text-white p-4 border-l-4 border-[var(--imotora-red)] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--imotora-red)" }}
                />
                Pre-Order &bull; {depositPercent}% Deposit
              </span>
              {releaseDate && (
                <span className="text-[11px] font-bold text-zinc-300">
                  Est. Ship: {releaseDate}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{preorderNote}</p>

            {/* 50% Deposit vs Full Payment Option Selector */}
            {unitPriceNum > 0 && (
              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentMode("deposit_50")}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    paymentMode === "deposit_50"
                      ? "bg-white text-zinc-900 border-[var(--imotora-red)] ring-2 ring-[var(--imotora-red)]"
                      : "bg-white/5 text-zinc-200 border-white/15 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span>Pay {depositPercent}% Deposit Now</span>
                    <span style={{ color: "var(--imotora-red)" }}>
                      {convertToLocale({ amount: depositNow, currency_code: currencyCode })}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      paymentMode === "deposit_50" ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    Remaining{" "}
                    {convertToLocale({ amount: balanceLater, currency_code: currencyCode })} due
                    on dispatch
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("full")}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    paymentMode === "full"
                      ? "bg-white text-zinc-900 border-[var(--imotora-red)] ring-2 ring-[var(--imotora-red)]"
                      : "bg-white/5 text-zinc-200 border-white/15 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span>Pay 100% Full Amount</span>
                    <span>
                      {convertToLocale({ amount: unitPriceNum, currency_code: currencyCode })}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      paymentMode === "full" ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    Zero balance remaining upon dispatch
                  </p>
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-11 font-extrabold text-sm border-none shadow-md"
          style={{
            backgroundColor: isPreorder ? "#0D0D10" : "var(--imotora-red)",
            color: "#FFFFFF",
          }}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : isPreorder
            ? paymentMode === "deposit_50" && unitPriceNum > 0
              ? `Pre-Order — Pay ${depositPercent}% (${convertToLocale({
                  amount: depositNow,
                  currency_code: currencyCode,
                })})`
              : "Pre-Order — Pay Full Amount"
            : "Add to Cart"}
        </Button>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
