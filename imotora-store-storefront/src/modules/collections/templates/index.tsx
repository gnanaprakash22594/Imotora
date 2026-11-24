import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="py-8 min-h-[70vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
    >
      <div className="content-container">
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            <LocalizedClientLink href="/" className="hover:text-[var(--imotora-red)]">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-[var(--imotora-red)]">
              Collections
            </LocalizedClientLink>
          </div>
          <h1 className="font-racing text-3xl sm:text-4xl font-extrabold">
            {collection.title}{" "}
            <span style={{ color: "var(--imotora-red)" }}>Collection</span>
          </h1>
        </div>

        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <div className="small:w-[220px] shrink-0 bg-white text-zinc-900 border border-zinc-200 rounded-xl p-4 shadow-sm">
            <RefinementList sortBy={sort} />
          </div>
          <div className="w-full">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={collection.products?.length}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
