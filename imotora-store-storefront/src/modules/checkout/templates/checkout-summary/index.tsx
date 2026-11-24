import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import PreorderDepositBox from "@modules/common/components/preorder-deposit-box"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-6 py-8 small:py-0">
      <div className="w-full bg-white flex flex-col gap-y-4">
        <Divider className="my-4 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-2xl font-extrabold items-baseline"
        >
          In your Garage Cart
        </Heading>
        <Divider />
        <CartTotals totals={cart} />
        <PreorderDepositBox cart={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
