import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImotoraProductCard from "@modules/products/components/imotora-product-card"

export default function FeaturedShowcase({
  products,
  titleFirst = "Featured",
  titleAccent = "Products",
  viewAllHref = "/store",
  viewAllLabel = "View All Products",
}: {
  products: HttpTypes.StoreProduct[]
  titleFirst?: string
  titleAccent?: string
  viewAllHref?: string
  viewAllLabel?: string
}) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section
      className="py-10 transition-colors"
      style={{ backgroundColor: "var(--section-alt-bg)" }}
    >
      <div className="content-container">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="font-racing text-2xl sm:text-3xl font-extrabold tracking-tight whitespace-nowrap">
              <span style={{ color: "var(--text-main)" }}>{titleFirst} </span>
              <span style={{ color: "var(--imotora-red)" }}>{titleAccent}</span>
            </h2>
            <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-[var(--imotora-red)]/40 to-transparent" />
          </div>
          <LocalizedClientLink
            href={viewAllHref}
            className="text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[var(--imotora-red)]"
            style={{ color: "var(--text-main)" }}
          >
            {viewAllLabel} <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 xsmall:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <ImotoraProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
