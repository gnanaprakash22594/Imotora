import { HttpTypes } from "@medusajs/types"

export type PreorderProductInfo = {
  isPreorder: boolean
  depositPercent: number
  releaseDate: string | null
  note: string
}

export function getPreorderInfo(
  product?: Partial<HttpTypes.StoreProduct> | null
): PreorderProductInfo {
  const meta = (product?.metadata || {}) as Record<string, any>
  const isPreorder = Boolean(meta.is_preorder)
  const rawPct = Number(meta.preorder_deposit_percent)
  const depositPercent =
    Number.isFinite(rawPct) && rawPct > 0 && rawPct <= 100 ? rawPct : 50

  return {
    isPreorder,
    depositPercent,
    releaseDate: meta.preorder_release_date
      ? String(meta.preorder_release_date)
      : null,
    note: meta.preorder_note
      ? String(meta.preorder_note)
      : "Reserve with a 50% deposit today. Pay the remaining 50% balance right before dispatch.",
  }
}

export type CartPreorderSplit = {
  hasPreorderItems: boolean
  hasDepositSplit: boolean
  preorderItemCount: number
  fullTotal: number
  payableToday: number
  balanceDueLater: number
  releaseDates: string[]
}

export function calculateCartPreorderSplit(
  cart?: HttpTypes.StoreCart | null
): CartPreorderSplit {
  if (!cart) {
    return {
      hasPreorderItems: false,
      hasDepositSplit: false,
      preorderItemCount: 0,
      fullTotal: 0,
      payableToday: 0,
      balanceDueLater: 0,
      releaseDates: [],
    }
  }

  const fullTotal = Number(cart.total ?? cart.subtotal ?? 0)
  let deferredAmount = 0
  let preorderItemCount = 0
  const releaseDates = new Set<string>()

  for (const item of cart.items || []) {
    const itemMeta = (item.metadata || {}) as Record<string, any>
    const prodMeta = (item.product?.metadata || {}) as Record<string, any>
    const isPreorder = Boolean(itemMeta.is_preorder || prodMeta.is_preorder)
    if (!isPreorder) continue

    preorderItemCount += item.quantity
    const relDate = itemMeta.preorder_release_date || prodMeta.preorder_release_date
    if (relDate) releaseDates.add(String(relDate))

    const mode = itemMeta.preorder_payment_mode || "deposit_50"
    if (mode !== "full") {
      const pct = Number(itemMeta.deposit_percent || prodMeta.preorder_deposit_percent || 50)
      const lineTotal = Number(item.total ?? item.subtotal ?? (item.unit_price || 0) * item.quantity)
      const balanceShare = Math.round(lineTotal * ((100 - pct) / 100))
      deferredAmount += balanceShare
    }
  }

  const payableToday = Math.max(0, fullTotal - deferredAmount)

  return {
    hasPreorderItems: preorderItemCount > 0,
    hasDepositSplit: deferredAmount > 0,
    preorderItemCount,
    fullTotal,
    payableToday,
    balanceDueLater: deferredAmount,
    releaseDates: Array.from(releaseDates),
  }
}

