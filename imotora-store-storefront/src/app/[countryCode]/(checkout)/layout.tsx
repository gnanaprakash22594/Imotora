import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-[#F5F5F7] min-h-screen flex flex-col">
      <div className="h-[76px] bg-white border-b-2 border-[var(--imotora-red)] shadow-sm">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-xs sm:text-sm font-bold text-zinc-700 hover:text-[var(--imotora-red)] flex items-center gap-x-2 flex-1 basis-0 transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Back to shopping cart</span>
            <span className="block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex flex-col items-center"
            data-testid="store-link"
          >
            <img
              src="/images/imotora-logo.png"
              alt="iMotora"
              className="h-10 w-auto object-contain"
            />
          </LocalizedClientLink>
          <div className="flex-1 basis-0 flex justify-end">
            <span className="text-xs font-bold text-zinc-700 hidden sm:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Secure Checkout
            </span>
          </div>
        </nav>
      </div>
      <div
        className="relative flex-1 py-8 content-container"
        data-testid="checkout-container"
      >
        <div className="bg-white text-zinc-900 rounded-2xl p-5 sm:p-8 shadow-xl border border-zinc-200">
          {children}
        </div>
      </div>
      <div className="py-5 bg-[#0D0D10] text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} iMotora Automotive Collectibles &bull; Powered by Medusa
      </div>
    </div>
  )
}
