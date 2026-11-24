import React from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { calculateCartPreorderSplit } from "@lib/util/preorder"

export default function PreorderDepositBox({
  cart,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  const split = calculateCartPreorderSplit(cart)
  if (!cart || !split.hasDepositSplit) return null

  const currency = cart.currency_code || "inr"

  return (
    <div className="rounded-xl bg-[#0D0D10] text-white p-4 border-l-4 border-[var(--imotora-red)] space-y-2.5 shadow-md">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--imotora-red)" }}
          />
          50% Pre-Order Deposit Active
        </span>
        <span className="text-[11px] text-zinc-400">
          {split.preorderItemCount} pre-order {split.preorderItemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-white/10 text-xs">
        <div className="flex items-center justify-between text-zinc-300">
          <span>Full Order Value</span>
          <span className="font-semibold">
            {convertToLocale({ amount: split.fullTotal, currency_code: currency })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm font-extrabold">
          <span className="text-white">Due Today (50% Deposit)</span>
          <span style={{ color: "var(--imotora-red)" }}>
            {convertToLocale({ amount: split.payableToday, currency_code: currency })}
          </span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Balance Due on Dispatch (50%)</span>
          <span className="font-bold text-zinc-200">
            {convertToLocale({ amount: split.balanceDueLater, currency_code: currency })}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-white/10">
        {split.releaseDates.length > 0
          ? `Estimated dispatch: ${split.releaseDates.join(", ")}. We'll notify you by SMS/email when your collectible arrives for balance payment.`
          : "We'll notify you before dispatch to complete the remaining 50% balance. 100% refundable anytime."}
      </p>
    </div>
  )
}

