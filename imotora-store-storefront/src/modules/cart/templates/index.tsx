import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div
      className="py-10 min-h-[70vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)" }}
    >
      <div className="content-container" data-testid="cart-container">
        <div className="mb-6">
          <h1 className="font-racing text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text-main)" }}>
            Your <span style={{ color: "var(--imotora-red)" }}>Garage Cart</span>
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Free insured collector shipping on all orders above ₹999.
          </p>
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="flex flex-col bg-white text-zinc-900 rounded-2xl p-6 gap-y-6 shadow-md border border-zinc-200">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-6 sticky top-28">
                {cart && cart.region && (
                  <div className="bg-white text-zinc-900 rounded-2xl p-6 shadow-md border border-zinc-200">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white text-zinc-900 rounded-2xl p-8 sm:p-12 shadow-md border border-zinc-200">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
