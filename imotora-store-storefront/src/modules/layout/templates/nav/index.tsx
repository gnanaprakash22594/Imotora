import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import ImotoraNavClient from "@modules/layout/components/imotora-nav-client"

export default async function Nav() {
  const [categories, collectionsData] = await Promise.all([
    listCategories().catch(() => []),
    listCollections({ fields: "id, handle, title" }).catch(() => ({
      collections: [],
    })),
  ])

  const navCategories = (categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  const navCollections = (collectionsData?.collections || []).map((c) => ({
    id: c.id,
    title: c.title,
    handle: c.handle,
  }))

  return (
    <ImotoraNavClient
      categories={navCategories}
      collections={navCollections}
      cartSlot={
        <Suspense
          fallback={
            <LocalizedClientLink
              className="relative p-2 text-zinc-200 hover:text-white flex items-center"
              href="/cart"
              data-testid="nav-cart-link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D2E] text-white text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>
      }
    />
  )
}
