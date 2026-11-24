"use client"

import { Button, Heading } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import PreorderDepositBox from "@modules/common/components/preorder-deposit-box"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { calculateCartPreorderSplit } from "@lib/util/preorder"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const split = calculateCartPreorderSplit(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[1.75rem] leading-[2.25rem] font-extrabold">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <PreorderDepositBox cart={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button
          className="w-full h-11 font-extrabold border-none"
          style={{ backgroundColor: "var(--imotora-red)", color: "#FFFFFF" }}
        >
          {split.hasDepositSplit
            ? `Checkout — Pay ${convertToLocale({
                amount: split.payableToday,
                currency_code: cart.currency_code || "inr",
              })} Deposit`
            : "Go to Checkout →"}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
