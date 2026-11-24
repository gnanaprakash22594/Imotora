import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

const QUICK_CATEGORIES = [
  { label: "All Collectibles", href: "/store" },
  { label: "Diecast Cars", href: "/categories/diecast-cars" },
  { label: "Racing Tracks", href: "/categories/racing-tracks" },
  { label: "Display & Garage", href: "/categories/display-garage" },
  { label: "Collector Accessories", href: "/categories/collector-accessories" },
  { label: "iMotora Originals", href: "/collections/imotora-originals" },
]

const StoreTemplate = ({
  sortBy,
  page,
  q,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  q?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="py-8 min-h-[70vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
      data-testid="category-container"
    >
      <div className="content-container">
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <h1
            className="font-racing text-3xl sm:text-4xl font-extrabold"
            data-testid="store-page-title"
          >
            {q ? (
              <>
                Search Results for{" "}
                <span style={{ color: "var(--imotora-red)" }}>&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              <>
                Shop <span style={{ color: "var(--imotora-red)" }}>Collectibles</span>
              </>
            )}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {QUICK_CATEGORIES.map((item) => (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-zinc-300 text-zinc-800 hover:border-[var(--imotora-red)] hover:text-[var(--imotora-red)] transition-colors shadow-sm"
              >
                {item.label}
              </LocalizedClientLink>
            ))}
            {q && (
              <LocalizedClientLink
                href="/store"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-colors"
                style={{ backgroundColor: "var(--imotora-red)" }}
              >
                Clear search ×
              </LocalizedClientLink>
            )}
          </div>
        </div>

        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <div className="small:w-[220px] shrink-0 bg-white text-zinc-900 border border-zinc-200 rounded-xl p-4 shadow-sm">
            <RefinementList sortBy={sort} />
          </div>
          <div className="w-full">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                q={q}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
