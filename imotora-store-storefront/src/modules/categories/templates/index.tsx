import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      getParents(cat.parent_category)
    }
  }
  getParents(category)

  return (
    <div
      className="py-8 min-h-[70vh] transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)", color: "var(--text-main)" }}
      data-testid="category-container"
    >
      <div className="content-container">
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            <LocalizedClientLink href="/" className="hover:text-[var(--imotora-red)]">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-[var(--imotora-red)]">
              Shop
            </LocalizedClientLink>
            {parents.map((parent) => (
              <span key={parent.id} className="flex items-center gap-2">
                <span>/</span>
                <LocalizedClientLink
                  href={`/categories/${parent.handle}`}
                  className="hover:text-[var(--imotora-red)]"
                >
                  {parent.name}
                </LocalizedClientLink>
              </span>
            ))}
          </div>
          <h1
            className="font-racing text-3xl sm:text-4xl font-extrabold"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-sm max-w-2xl" style={{ color: "var(--text-muted)" }}>
              {category.description}
            </p>
          )}
          {category.category_children && category.category_children.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category.category_children.map((c) => (
                <InteractiveLink key={c.id} href={`/categories/${c.handle}`}>
                  {c.name}
                </InteractiveLink>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <div className="small:w-[220px] shrink-0 bg-white text-zinc-900 border border-zinc-200 rounded-xl p-4 shadow-sm">
            <RefinementList sortBy={sort} data-testid="sort-by-container" />
          </div>
          <div className="w-full">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
