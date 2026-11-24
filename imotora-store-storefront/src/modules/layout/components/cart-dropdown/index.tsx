"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const FREE_SHIPPING_THRESHOLD = 999

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full flex items-center">
        <PopoverButton className="focus:outline-none">
          <LocalizedClientLink
            className="relative p-2 text-[#111114] hover:text-[var(--imotora-red)] hover:bg-zinc-100 rounded-full transition-colors flex items-center"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Cart with ${totalItems} items`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "var(--imotora-red)" }}
            >
              {totalItems}
            </span>
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+10px)] right-0 bg-white border border-zinc-200 rounded-xl shadow-2xl w-[410px] text-zinc-900 overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="px-5 py-3.5 bg-[#0D0D10] text-white flex items-center justify-between">
              <h3 className="font-racing text-lg font-bold tracking-wide">
                Your <span style={{ color: "var(--imotora-red)" }}>Garage Cart</span>
              </h3>
              <span className="text-xs text-zinc-400">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                {/* Free Shipping Progress */}
                <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-200">
                  <p className="text-xs text-zinc-700 mb-1.5">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add{" "}
                        <span className="text-zinc-950 font-bold">
                          ₹{remainingForFreeShipping.toLocaleString("en-IN")}
                        </span>{" "}
                        more for{" "}
                        <span className="font-bold" style={{ color: "var(--imotora-red)" }}>
                          FREE Shipping
                        </span>
                      </>
                    ) : (
                      <span className="text-emerald-600 font-bold">
                        ✓ You unlocked FREE Insured Collector Shipping!
                      </span>
                    )}
                  </p>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${progressPct}%`, backgroundColor: "var(--imotora-red)" }}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[340px] px-5 py-4 space-y-4 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item) => {
                      const isPreorder = Boolean((item.product?.metadata as any)?.is_preorder)
                      return (
                        <div
                          className="grid grid-cols-[84px_1fr] gap-x-3.5 items-start"
                          key={item.id}
                          data-testid="cart-item"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="w-[84px] bg-zinc-50 border border-zinc-200 rounded-lg p-1 block"
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </LocalizedClientLink>
                          <div className="flex flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                {isPreorder && (
                                  <span
                                    className="inline-block mb-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider text-white"
                                    style={{ backgroundColor: "var(--imotora-red)" }}
                                  >
                                    Pre-Order
                                  </span>
                                )}
                                <h4 className="text-sm font-bold text-zinc-900 truncate">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                    className="hover:text-[var(--imotora-red)] transition-colors"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h4>
                                <div className="text-xs text-zinc-500">
                                  <LineItemOptions
                                    variant={item.variant}
                                    data-testid="cart-item-variant"
                                    data-value={item.variant}
                                  />
                                </div>
                                <span
                                  className="text-xs text-zinc-500"
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              <div className="text-sm font-bold text-zinc-950 shrink-0">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                            <DeleteButton
                              id={item.id}
                              className="mt-1.5 text-xs text-zinc-500 hover:text-[var(--imotora-red)]"
                              data-testid="cart-item-remove-button"
                            >
                              Remove
                            </DeleteButton>
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 font-medium">
                      Subtotal <span className="text-zinc-400 font-normal">(excl. shipping)</span>
                    </span>
                    <span
                      className="text-base font-extrabold text-zinc-950"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <LocalizedClientLink
                      href="/cart"
                      onClick={close}
                      className="text-center py-2.5 rounded-md border border-zinc-300 text-sm font-bold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
                      data-testid="go-to-cart-button"
                    >
                      View Cart
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/checkout?step=address"
                      onClick={close}
                      className="imotora-btn-primary py-2.5 text-sm"
                    >
                      Checkout →
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center gap-3">
                <p className="text-sm text-zinc-600 font-medium">Your collector garage is empty.</p>
                <LocalizedClientLink
                  href="/store"
                  onClick={close}
                  className="imotora-btn-primary px-5 py-2 text-xs"
                >
                  Explore Die-Cast Cars →
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
